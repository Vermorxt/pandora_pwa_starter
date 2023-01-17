import React, { CSSProperties, FC, memo, useEffect, useReducer, useRef, useState } from 'react'
import scss from './styles/wheel-picker4.module.scss'
import { PickerOptions } from './WheelPickerWrapper'

interface EventValues {
  action: boolean
  diffY: number
  endY: number
  tempAngle: number
  startY: number
  startTime: Date
  index: number
}
const eventValues: EventValues = {
  action: false,
  diffY: 1,
  endY: 1,
  tempAngle: 1,
  startY: 1,
  startTime: new Date(),
  index: 0,
}

const DIAMETER = 350
const ITEMS_COUNT = 31
const ITEM_HEIGHT = 40

const WheelPicker4: FC<PickerOptions> = (props: PickerOptions) => {
  const { data, index = 0, open } = props

  const [, forceUpdate] = useReducer(x => Number(x) + 1, 0)

  const refWheeler = useRef<HTMLDivElement>(null)
  const [pickerData, setPickerData] = useState<any[]>([...data].reverse())
  const [rotation, setRotation] = useState<number>(0)
  const [value, setValue] = useState<string>()
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [events, setEvents] = useState<EventValues>({ ...eventValues })
  const [itemStyles, setItemStyles] = useState<boolean>(false)
  const [wheelStyles, setWheelStyles] = useState<CSSProperties>({})

  const eventStateRef = useRef(events)
  const setEventStateRef = (data: EventValues) => {
    eventStateRef.current = { ...data }
    setEvents({ ...data })
  }

  const rotationStateRef = useRef(rotation)
  const setRotationStateRef = (data: number) => {
    rotationStateRef.current = data
    setRotation(data)
  }

  const getCoord = (event: { type: string; originalEvent: any } | any, coords: string) =>
    /touch/.test(event.type as string)
      ? (event.originalEvent || event).changedTouches[0]['page' + coords]
      : event['page' + coords]

  useEffect(() => {
    if (!data || data.length === ITEMS_COUNT) return

    if (data.length < ITEMS_COUNT) {
      const newData = Array.from(Array(ITEMS_COUNT)).map((d, i) => {
        const index = i

        if (data[index]) {
          return data[index]
        } else {
          const mod = index % data.length
          return data[mod]
        }
      })

      setPickerData([...newData])
      setItemStyles(true)
    }
  }, [data])

  useEffect(() => {
    if (itemStyles) return

    if (refWheeler.current) {
      setItemStyles(true)
    }
  }, [refWheeler])

  useEffect(() => {
    if (!rotation.toString() || !eventStateRef.current.action) return

    if (eventStateRef.current.index === index) {
      const diameter = DIAMETER || refWheeler.current?.scrollHeight
      const circumference = Math.PI * diameter
      const height = circumference / ITEMS_COUNT
      const heightInt = parseInt(height.toString(), 10)

      setWheelStyles({
        ...wheelStyles,
        transform: `rotateX(${rotation}deg)`,
        transformOrigin: `50% calc(50% + ${heightInt}px)`,
        marginTop: `-${heightInt}px`,
      })
    }
  }, [rotation])

  useEffect(() => {
    const div = refWheeler.current
    const doc = document

    if (div && doc && open === true && div?.id === `wheel_inner_${index}`) {
      doc.addEventListener('mousedown', onStart)
      doc.addEventListener('touchstart', onStart)
      doc.addEventListener('mousemove', onMove)
      doc.addEventListener('touchmove', onMove)
      doc.addEventListener('mouseup', onEnd)
      doc.addEventListener('touchend', onEnd)
      doc.addEventListener('wheel', handleScroll)
    }

    return () => {
      if (div) {
        doc.removeEventListener('mousedown', onStart)
        doc.removeEventListener('touchstart', onStart)
        doc.removeEventListener('mousemove', onMove)
        doc.removeEventListener('touchmove', onMove)
        doc.removeEventListener('mouseup', onEnd)
        doc.removeEventListener('touchend', onEnd)
        doc.removeEventListener('wheel', handleScroll)
      }
    }
  }, [open])

  const isInElement = (id: string, elem: HTMLDivElement) =>
    elem?.id.toString() === `wheel_${index.toString()}` || elem?.id.toString() === `wheel_inner_${index.toString()}`

  const enablePageScrolling = () => {
    const mainContainer = document.getElementById('main-container')
    if (mainContainer) {
      mainContainer.style.overflowY = 'auto'
    }
  }

  const disablePageScrolling = () => {
    const mainContainer = document.getElementById('main-container')
    if (mainContainer) {
      mainContainer.style.overflowY = 'hidden'
    }
  }

  const getValue = (angle: number) => {
    let itemIndex = undefined
    let itemValue = undefined
    let snapAngle = undefined

    const degPerValue = 360 / ITEMS_COUNT
    const mod = Math.abs((Number(angle) / 360) >> 0)
    const reducedAngle = Math.abs(angle) - 360 * mod
    itemIndex = reducedAngle / degPerValue

    if (angle <= 0) {
      itemIndex = Math.abs(itemIndex - ITEMS_COUNT)
    }

    const indexStr = Math.abs(parseInt(itemIndex.toString(), 10) - ITEMS_COUNT)
    snapAngle = Math.abs(parseInt(itemIndex.toString(), 10)) * degPerValue + 360 * mod

    if (refWheeler.current) {
      const cellItem = refWheeler.current.querySelectorAll(`.cell-value-${indexStr}`)

      if (cellItem[0]) {
        itemValue = cellItem[0].textContent
      }
    }

    return {
      itemIndex,
      itemValue,
      snapAngle,
    }
  }

  const scrollToPosition = (snapAngle: number) => {
    if (index === eventStateRef.current.index) {
      const diameter = DIAMETER || refWheeler.current?.scrollHeight
      const circumference = Math.PI * diameter
      const height = circumference / ITEMS_COUNT
      const heightInt = parseInt(height.toString(), 10)

      setWheelStyles({
        ...wheelStyles,
        transform: `rotateX(${snapAngle}deg)`,
        transformOrigin: `50% calc(50% + ${heightInt}px)`,
        marginTop: `-${heightInt}px`,
      })
    }
  }

  const scrollOnEnd = (speed: number) => {
    if (index !== eventStateRef.current.index) return

    if (refWheeler.current) {
      refWheeler.current.style.transition = 'all 1s ease-out'
    }

    if (speed.toString()) {
      const rotateMore = rotationStateRef.current - speed * 100

      const { itemValue, snapAngle } = getValue(rotateMore)

      setValue(itemValue?.toString())
      setRotationStateRef(snapAngle)
      scrollToPosition(snapAngle)
    }
  }

  const handleScroll = (event: any) => {
    if (!isTargetElement(event?.target as HTMLDivElement)) return

    disablePageScrolling()

    if (refWheeler.current) {
      refWheeler.current.style.transition = 'none'
    }

    if (event) {
      const scrollTopValue = ((event.deltaY / 4) as number) || 0

      const angle = refWheeler.current?.style.transform || 'rotateX(0deg)'

      if (angle) {
        const angleValue = angle.substring(angle.length - 4, 8)
        const rotationAngle = Number(angleValue) + scrollTopValue
        const degPerValue = 360 / data.length
        const subtractHalfItemHeight = degPerValue / 2

        setRotationStateRef(rotationAngle)
        scrollToPosition(rotationAngle)

        console.log('scroll top value: ', rotationAngle)

        if (rotation <= 0) {
          const angleMod = Math.abs((Number(angleValue) / 360) >> 0)
          const normalizedAngle = rotation + 360 * angleMod - subtractHalfItemHeight
          const testV = Number(normalizedAngle) / degPerValue
          const finalIndex = testV < 0 ? testV * -1 : testV
          const finalInt = Math.abs(parseInt(finalIndex.toString(), 10))
          const testVInt = Math.abs(parseInt(testV.toString(), 10))

          const snapAngle = degPerValue * testVInt * -1
          setRotation(snapAngle - 360 * angleMod)

          console.log('angleMod: ', angleMod)

          const cellItem = refWheeler?.current.querySelectorAll(`.cell-item-${finalInt}`)

          if (cellItem[0]) {
            const angleValueFinal = cellItem[0].textContent
            setValue(angleValueFinal?.toString())
          }
        }

        if (rotation > 0) {
          const angleMod = Math.abs((Number(angleValue) / 360) >> 0)
          const normalizedAngle = rotation - 360 * angleMod - subtractHalfItemHeight
          const testV = Number(normalizedAngle) / degPerValue
          const finalIndex = data.length - testV
          const finalInt = Math.abs(parseInt(finalIndex.toString(), 10))
          const testVInt = Math.abs(parseInt(testV.toString(), 10))

          const snapAngle = degPerValue * (testVInt + 1)

          setRotation(snapAngle + 360 * angleMod)

          console.log(snapAngle, ' <------> angleMod: ', angleMod)

          const cellItem = refWheeler?.current.querySelectorAll(`.cell-item-${finalInt}`)

          if (cellItem[0]) {
            const angleValueFinal = cellItem[0].textContent
            setValue(angleValueFinal?.toString())
          }
        }
      }
    }
  }

  const isTargetElement = (target: HTMLDivElement) => {
    if (target) {
      const elem = target
      if (isInElement(index.toString(), elem)) {
        console.log(`%c found target: ${elem.id}`, 'background: red')
        return true
      }
    }

    return false
  }

  const onStart = (event: any) => {
    if (!isTargetElement(event?.target as HTMLDivElement)) return

    disablePageScrolling()

    if (refWheeler.current) {
      refWheeler.current.style.transition = 'none'
    }

    eventValues.action = true
    eventValues.startY = getCoord(event, 'Y')
    eventValues.diffY = 0
    eventValues.startTime = new Date()
    eventValues.tempAngle = rotationStateRef.current
    eventValues.index = index

    setEventStateRef({ ...eventValues })
  }

  const onMove = (event: any) => {
    if (eventStateRef.current.action === true) {
      eventValues.endY = getCoord(event, 'Y')
      eventValues.diffY = (eventValues.endY - eventStateRef.current.startY) / 4
      setEventStateRef({ ...eventValues })

      const rotationAngle = eventStateRef.current.tempAngle - eventValues.diffY
      setRotationStateRef(rotationAngle)
    } else {
      // if (event.target.id === `wheel_${index}` || event.target.is === `wheel_inner_${index}`)
      //   if (refWheeler.current) {
      //     refWheeler.current.style.transition = 'none'
      //     eventValues.action = true
      //     eventValues.startY = getCoord(event, 'Y')
      //     eventValues.diffY = 0
      //     eventValues.startTime = new Date()
      //     eventValues.tempAngle = rotationStateRef.current
      //     eventValues.index = index
      //     setEventStateRef({ ...eventValues })
      //     console.log('started ', index)
      //     setTimeout(() => {
      //       eventValues.action = false
      //       console.log('locked ', index)
      //     }, 100)
      //   }
    }
  }

  const onEnd = (_event: any) => {
    eventValues.action = false
    setEventStateRef({ ...eventValues })

    const evt = eventStateRef.current
    const time = Number(new Date()) - Number(evt.startTime)

    let speed = (evt.endY - evt.startY) / time
    const distance = eventStateRef.current.diffY

    if (Math.abs(distance) < 4) speed = 0

    scrollOnEnd(speed)
    disablePageScrolling()
  }

  const getTransformValueItems = (index: number) => {
    const wheel = refWheeler?.current

    if (wheel) {
      const items = ITEMS_COUNT || pickerData.length
      const diameter = DIAMETER || wheel?.scrollHeight
      const radius = diameter / 2
      const angle = 360 / items
      const height = ITEM_HEIGHT
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

  return (
    <>
      <p className="_no-select">Val: {value}</p>
      <div className={scss.wheel} id={`wheel_${index}`}>
        <div
          id={`wheel_inner_${index}`}
          className={scss.wheel__inner}
          ref={refWheeler}
          style={{ ...wheelStyles }}
          // onWheel={event => handleScroll(event)}
        >
          {pickerData.map((d, i) => (
            <div
              className={`${scss.wheel__segment} cell-item cell-item-${i} _no-select`}
              key={i}
              style={{ ...getTransformValueItems(i) }}
            >
              <span className={`${scss.value} cell-value-${i}`}>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default memo(WheelPicker4)
