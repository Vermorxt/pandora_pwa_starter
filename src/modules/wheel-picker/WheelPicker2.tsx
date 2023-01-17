import { Device, DeviceInfo } from '@capacitor/device'
import { Ui_Button } from '@vermorxt/pandora_ui'
import { Helper } from '@vermorxt/pandora_utils'
import { resourceUsage } from 'process'
import React, { FC, RefObject, useEffect, useReducer, useRef, useState } from 'react'
import { AnyType } from '../../_types/anytype'
import scss from './styles/wheel-picker2.module.scss'

export interface WheelPickerProps {
  options: {
    start: string
    end: string
  }
}

const testNumbers = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
]
const testStrings = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

let isScrolling: null | ReturnType<typeof setTimeout> = null

const DIAMETER = 340

const WheelPicker2: FC<any> = () => {
  const testDataSet = testNumbers

  const [, forceUpdate] = useReducer(x => Number(x) + 1, 0)
  const [data, setData] = useState(testDataSet)
  const [rotateAngle, setRotateAngle] = useState<number>(0)
  const [snapAngle, setSnapAngle] = useState<number>()
  const [value, setValue] = useState<string>()
  const [touch, setTouch] = useState<string>('nope')
  const [angleValue, setAngleValue] = useState<string>()
  const [touches, setTouches] = useState<number>(0)
  const [itemStyles, setItemStyles] = useState<boolean>(false)
  const [mouseMoving, setMouseMoving] = useState<boolean>(false)

  const refWheeler = useRef<HTMLDivElement>(null)
  const refSelector = useRef<HTMLDivElement>(null)

  const [device, setDevice] = useState<DeviceInfo>()

  const logDeviceInfo = async () => {
    const info = await Device.getInfo()

    setDevice(info)
  }

  const isMobile = () => device?.operatingSystem === 'android' || device?.operatingSystem === 'ios'

  useEffect(() => {
    void logDeviceInfo()
  }, [])

  useEffect(() => {
    if (itemStyles) return

    if (refWheeler.current) {
      setItemStyles(true)
    }
  }, [refWheeler])

  let lastY: number

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault()
    lastY = event.touches[0].pageY

    setTouch('start')
  }

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault()
    const currentY = event.touches[0].clientY
    // const moving = parseInt(currentY.toString(), 10) - (lastY || 0)
    lastY = currentY - (lastY || 0)
    // lastY = moving

    setTouches(currentY)

    handleScroll2()

    setTouch('move')
  }

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault()

    setTouch('end')

    if (refWheeler.current) {
      // refWheeler.current.style.transition = 'transform 1000ms cubic-bezier(0.19, 1, 0.22, 1) 0s'

      setTimeout(() => {
        if (refWheeler.current) {
          // refWheeler.current.style.transition = 'none'
        }
      }, 1000)
    }
  }

  const onMouseDown = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMobile()) return

    setMouseMoving(true)
  }

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMobile()) return

    if (!mouseMoving) return
    lastY = event?.movementY * -1
    handleScroll2()
  }

  const onMouseUp = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMobile()) return

    setMouseMoving(false)

    if (refWheeler.current) {
      refWheeler.current.style.transition = 'transform 1000ms cubic-bezier(0.19, 1, 0.22, 1) 0s'

      setTimeout(() => {
        if (refWheeler.current) {
          refWheeler.current.style.transition = 'none'
        }
      }, 1000)
    }
  }

  const scrollIntoView = (focusIndex: number) => {
    // console.log('ref wheeler', refWheeler.current)

    if (refWheeler.current) {
      const elem = refWheeler.current as HTMLElement
      const style = getComputedStyle(elem)
      const cellItems = elem.querySelectorAll(`.cell-item-${focusIndex}`)
      const firstElem = cellItems[0] as HTMLDivElement
      const dimensions = {
        width: firstElem.offsetWidth,
        height: firstElem.offsetHeight,
        scrollWidth: firstElem.scrollWidth,
        scrollHeight: firstElem.scrollHeight,
        top: firstElem.offsetTop,
        style,
      }

      // console.log('cell item: ', firstElem, dimensions)

      firstElem.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  }

  const getValueBasedOnAngle = (rotateAngle: number) => {
    if (rotateAngle <= 0) {
      const angleMod = Math.abs((Number(angleValue) / 360) >> 0)
      const normalizedAngle = rotateAngle + 360 * angleMod
      const degPerValue = 360 / data.length
      const testV = Number(normalizedAngle) / degPerValue
      const finalIndex = testV < 0 ? testV * -1 : testV

      console.log('angleMod: ', angleMod)

      setAngleValue(finalIndex.toString())
    }

    if (rotateAngle > 0) {
      const angleMod = Math.abs((Number(angleValue) / 360) >> 0)
      const normalizedAngle = rotateAngle - 360 * angleMod
      const degPerValue = 360 / data.length
      const testV = Number(normalizedAngle) / degPerValue
      const finalIndex = data.length - testV

      console.log('angleMod: ', angleMod)

      setAngleValue(finalIndex.toString())
    }
  }

  const handleScroll = (event: any) => {
    // Clear our timeout throughout the scroll
    clearTimeout(isScrolling as unknown as number)
    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(() => {
      // Run the callback
      console.log('-------- > Scrolling has stopped.', isScrolling)

      if (snapAngle) {
        setRotateAngle(snapAngle)
      }
    }, 100)

    if (event) {
      const scrollTopValue = (event.deltaY / 4) as number

      console.log('scroll top value: ', scrollTopValue)

      const angle = refWheeler.current?.style.transform

      if (angle) {
        const angleValue = angle.substring(angle.length - 4, 8)
        const rotationAngle = Number(angleValue) + scrollTopValue
        const degPerValue = 360 / data.length
        const subtractHalfItemHeight = degPerValue / 2

        setRotateAngle(rotationAngle)
        overLap()

        if (rotateAngle <= 0) {
          const angleMod = Math.abs((Number(angleValue) / 360) >> 0)
          const normalizedAngle = rotateAngle + 360 * angleMod - subtractHalfItemHeight
          const testV = Number(normalizedAngle) / degPerValue
          const finalIndex = testV < 0 ? testV * -1 : testV
          const finalInt = Math.abs(parseInt(finalIndex.toString(), 10))
          const testVInt = Math.abs(parseInt(testV.toString(), 10))

          const snapAngle = degPerValue * testVInt * -1
          setSnapAngle(snapAngle - 360 * angleMod)

          console.log('angleMod: ', angleMod)

          const cellItem = refWheeler.current.querySelectorAll(`.cell-item-${finalInt}`)

          if (cellItem[0]) {
            const angleValueFinal = cellItem[0].textContent
            setAngleValue(angleValueFinal?.toString())
          }
        }

        if (rotateAngle > 0) {
          const angleMod = Math.abs((Number(angleValue) / 360) >> 0)
          const normalizedAngle = rotateAngle - 360 * angleMod - subtractHalfItemHeight
          const testV = Number(normalizedAngle) / degPerValue
          const finalIndex = data.length - testV
          const finalInt = Math.abs(parseInt(finalIndex.toString(), 10))
          const testVInt = Math.abs(parseInt(testV.toString(), 10))

          const snapAngle = degPerValue * (testVInt + 1)
          setSnapAngle(snapAngle + 360 * angleMod)

          console.log(snapAngle, ' <------> angleMod: ', angleMod)

          const cellItem = refWheeler.current.querySelectorAll(`.cell-item-${finalInt}`)

          if (cellItem[0]) {
            const angleValueFinal = cellItem[0].textContent
            setAngleValue(angleValueFinal?.toString())
          }
        }
      }
    }
  }

  const handleScroll2 = () => {
    if (lastY) {
      const scrollTopValue = (lastY / 4) as number

      console.log('scroll top value: ', scrollTopValue)

      const angle = refWheeler.current?.style.transform

      // if (angle) {
      //   const angleValue = angle.substring(angle.length - 4, 8)
      //   const rotationAngle = Number(angleValue) + scrollTopValue

      //   setRotateAngle(rotationAngle)

      //   console.log('angle news: ', angleValue)

      //   overLap()
      // }

      if (angle) {
        const angleValue = angle.substring(angle.length - 4, 8)
        const rotationAngle = Number(angleValue) + scrollTopValue
        const degPerValue = 360 / data.length
        const subtractHalfItemHeight = degPerValue / 2

        setRotateAngle(rotationAngle)
        overLap()

        if (rotateAngle <= 0) {
          const angleMod = Math.abs((Number(angleValue) / 360) >> 0)
          const normalizedAngle = rotateAngle + 360 * angleMod - subtractHalfItemHeight
          const testV = Number(normalizedAngle) / degPerValue
          const finalIndex = testV < 0 ? testV * -1 : testV
          const finalInt = Math.abs(parseInt(finalIndex.toString(), 10))
          const testVInt = Math.abs(parseInt(testV.toString(), 10))

          const snapAngle = degPerValue * testVInt * -1
          setSnapAngle(snapAngle - 360 * angleMod)

          console.log('angleMod: ', angleMod)

          const cellItem = refWheeler.current.querySelectorAll(`.cell-item-${finalInt}`)

          if (cellItem[0]) {
            const angleValueFinal = cellItem[0].textContent
            setAngleValue(angleValueFinal?.toString())
          }
        }

        if (rotateAngle > 0) {
          const angleMod = Math.abs((Number(angleValue) / 360) >> 0)
          const normalizedAngle = rotateAngle - 360 * angleMod - subtractHalfItemHeight
          const testV = Number(normalizedAngle) / degPerValue
          const finalIndex = data.length - testV
          const finalInt = Math.abs(parseInt(finalIndex.toString(), 10))
          const testVInt = Math.abs(parseInt(testV.toString(), 10))

          const snapAngle = degPerValue * (testVInt + 1)
          setSnapAngle(snapAngle + 360 * angleMod)

          console.log(snapAngle, ' <------> angleMod: ', angleMod)

          const cellItem = refWheeler.current.querySelectorAll(`.cell-item-${finalInt}`)

          if (cellItem[0]) {
            const angleValueFinal = cellItem[0].textContent
            setAngleValue(angleValueFinal?.toString())
          }
        }
      }
    }
  }

  const getTransformValue = (wheel: HTMLDivElement | null) => {
    if (wheel) {
      const items = data.length
      const diameter = DIAMETER || wheel?.scrollHeight
      const circumference = Math.PI * diameter
      const height = circumference / items
      const heightInt = parseInt(height.toString(), 10)

      console.log('wheeler height: ', wheel?.scrollHeight, heightInt)

      return {
        transformOrigin: `50% calc(50% + ${heightInt / 2}px)`,
        marginTop: `-${heightInt}px`,
      }
    }

    return null
  }

  const getTransformValueItems = (index: number) => {
    const wheel = refWheeler?.current

    if (wheel) {
      const items = data.length
      const diameter = DIAMETER || wheel?.scrollHeight
      const radius = diameter / 2
      const angle = 360 / items
      const circumference = Math.PI * diameter
      const height = circumference / items
      const heightInt = parseInt(height.toString(), 10)

      wheel.style.transformOrigin = `50% calc(50% + ${heightInt / 2}px)`
      wheel.style.marginTop = `-${heightInt}px`

      return {
        transform: `rotateX(${angle * index}deg) translateZ(${radius}px)`,
        height,
      }
    }

    return null
  }

  const overLap = () => {
    const elem1 = refSelector.current
    const foundItems = [] as AnyType[]

    if (elem1 && refWheeler.current) {
      const items = refWheeler.current.querySelectorAll('.cell-item')

      if (items.length > 0) {
        items.forEach(elem2 => {
          if (refSelector.current) {
            const rect1 = elem1.getBoundingClientRect()
            const rect2 = elem2.getBoundingClientRect()

            const overlap = !(
              rect1.right < rect2.left ||
              rect1.left > rect2.right ||
              rect1.bottom < rect2.top ||
              rect1.top > rect2.bottom
            )

            if (overlap === true) {
              foundItems.push({ elem: elem2, rect: rect2 })
            }
          }
        })
      }
    }

    console.log('overlap?', foundItems)

    const valueItem = foundItems.reduce((max, curren) => (max.rect.width > curren.rect.width ? max : curren))

    console.log('overlap? 2', valueItem?.elem?.textContent)

    if (valueItem?.elem?.textContent) {
      setValue(valueItem?.elem?.textContent as string)
    }

    // console.log('overlap?', valueItem[0].textContent)
  }

  return (
    <>
      <h1>Picker</h1>
      <div className={scss.wheel}>
        <div className={scss.selector} ref={refSelector}></div>

        <div
          className={scss.wheel__inner}
          ref={refWheeler}
          onMouseDown={event => onMouseDown(event)}
          onMouseMove={event => onMouseMove(event)}
          onMouseUp={event => onMouseUp(event)}
          onMouseLeave={event => onMouseUp(event)}
          onTouchStart={event => onTouchStart(event)}
          onTouchMove={event => onTouchMove(event)}
          onTouchEnd={event => onTouchEnd(event)}
          onWheel={event => handleScroll(event)}
          style={{
            ...getTransformValue(refWheeler?.current),
            transform: `rotateX(${rotateAngle}deg)`,
          }}
        >
          {itemStyles &&
            data.map((d, index) => (
              <div
                className={`${scss.wheel__segment} cell-item cell-item-${index}`}
                key={Math.random()}
                style={{ ...getTransformValueItems(index), pointerEvents: `${isMobile() ? 'none' : 'auto'}` }}
              >
                <span className={`${scss.value} cell-value-${index}`}>{d}</span>
              </div>
            ))}
        </div>
      </div>

      <div>Value: {value}</div>
      <div>Angle value: {angleValue}</div>
      <div>Angle: {rotateAngle} deg</div>
      <div>Touch: {touch}</div>
      <div>TouchY: {touches} px</div>
      <Ui_Button onClick={() => scrollIntoView(10)}>scroll into view</Ui_Button>
    </>
  )
}

export default React.memo(WheelPicker2)
