import { Device, DeviceInfo } from '@capacitor/device'
import { Ui_Button } from '@vermorxt/pandora_ui'
import { Helper } from '@vermorxt/pandora_utils'
import React, { FC, useEffect, useReducer, useRef, useState } from 'react'
import { setTimeout } from 'timers'
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

interface EventValues {
  touch: boolean
  action: boolean
  diffX: number
  diffY: number
  endX: number
  endY: number
  scroll: boolean
  sort: boolean
  startX: number
  startY: number
  swipe: boolean
  tap: boolean
  sortTimer: null | ReturnType<typeof setTimeout>
}

const eventValues: EventValues = {
  touch: false,
  action: false,
  diffX: 0,
  diffY: 0,
  endX: 0,
  endY: 0,
  scroll: false,
  sort: false,
  startX: 0,
  startY: 0,
  swipe: false,
  tap: false,
  sortTimer: null,
}

let isScrolling: null | ReturnType<typeof setTimeout> = null

const DIAMETER = 340

const WheelPicker3: FC<any> = () => {
  const hasTouch = window ? 'ontouchstart' in window : false
  const START_EVENT = hasTouch ? 'touchstart' : 'mousedown'
  const MOVE_EVENT = hasTouch ? 'touchmove' : 'mousemove'
  const END_EVENT = hasTouch ? 'touchend' : 'mouseup'

  const testDataSet = testNumbers

  const [data, setData] = useState(testDataSet)
  const [rotateAngle, setRotateAngle] = useState<number>(0)
  const [snapAngle, setSnapAngle] = useState<number>()
  const [value, setValue] = useState<string>()
  const [startTime, setStartTime] = useState<Date>()
  const [events, setEvents] = useState<EventValues>(eventValues)
  const [touchEvt, setTouchEvt] = useState<string>('nope')
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

  useEffect(() => {
    if (!events) return

    // handleScroll3()
  }, [events])

  let lastY: number

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

  const testTouch = (event: { type: string }) => {
    let touch = false

    if (event.type == 'touchstart') {
      touch = true
    } else if (touch) {
      touch = false
      return false
    }

    setEvents({ ...events, touch })
    return true
  }

  function getCoord(event: { type: string; originalEvent: any } | any, coords: string) {
    return /touch/.test(event.type as string)
      ? (event.originalEvent || event).changedTouches[0]['page' + coords]
      : event['page' + coords]
  }

  const onStart_OLD = (event: { type: any }) => {
    let action = false
    let startX = 0
    let startY = 0
    let diffX = 0
    let diffY = 0
    let sortTimer
    let sort = false

    disablePageScrolling()

    if (testTouch(event) && !events.action) {
      action = true
      startX = getCoord(event, 'X')
      startY = getCoord(event, 'Y')
      diffX = 0
      diffY = 0
      sortTimer = setTimeout(() => {
        sort = true
      }, 200)

      setEvents({ ...events, action, startX, startY, diffX, diffY, sort, sortTimer })

      if (event.type == 'mousedown') {
        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onEnd)
        // $(document).on('mousemove', onMove).on('mouseup', onEnd)
      }
    }
  }

  const onStart = (event: { type: any }) => {
    if (!events.action) {
      disablePageScrolling()
      const touch = true
      const action = true
      const startX = getCoord(event, 'X')
      const startY = getCoord(event, 'Y')
      const diffX = 0
      const diffY = 0

      setStartTime(new Date())

      setEvents({ ...events, action, startX, startY, diffX, diffY, touch })

      if (event.type == 'mousedown') {
        // document.addEventListener('mousemove', onMove)
        // document.addEventListener('mouseup', onEnd)
        // $(document).on('mousemove', onMove).on('mouseup', onEnd)
      }

      if (refWheeler.current) {
        refWheeler.current.style.transition = 'none'
      }

      const startIndex = value || 0

      console.log('start value: ', value || 0)
    }
  }

  const onMove = (event: any) => {
    if (events.action) {
      const touch = true
      const endX = getCoord(event, 'X')
      const endY = getCoord(event, 'Y')
      const diffX = endX - events.startX
      const diffY = endY - events.startY
      setEvents({ ...events, endX, endY, diffX, diffY, touch })

      console.log(rotateAngle, '----> angleValue: ', angleValue, Number(angleValue) + diffY)

      const ang = rotateAngle || 0
      const rotationAngle = diffY < 0 ? ang + 1 : ang - 1
      setRotateAngle(rotationAngle)

      // forceUpdate()
    }
  }

  const onMove_OLD = (event: any) => {
    let endX
    let endY
    let diffX
    let diffY
    let scroll
    let swipe
    let sort
    let sortTimer = events.sortTimer

    if (events.action) {
      endX = getCoord(event, 'X')
      endY = getCoord(event, 'Y')
      diffX = endX - events.startX
      diffY = endY - events.startY
      if (!events.sort && !events.swipe && !scroll) {
        if (Math.abs(diffY) > 10) {
          // It's a scroll
          scroll = true
          // Android 4.0 will not fire touchend event
          // event.target.trigger('touchend')
          // $(this).trigger('touchend')
        } else if (Math.abs(diffX) > 7) {
          // It's a swipe
          swipe = true
        }
      }
      if (swipe) {
        event.preventDefault() // Kill page scroll
        // Handle swipe
        // ...
      }
      if (sort) {
        event.preventDefault() // Kill page scroll
        // Handle sort
        // ....
      }
      if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
        if (events.sortTimer) {
          clearTimeout(events.sortTimer)
          sortTimer = null
        }
      }

      setEvents({ ...events, endX, endY, diffX, diffY, sortTimer })
    }
  }

  const onEnd_OLD = (event: any) => {
    let action = false
    let swipe = false
    let sort = false
    let scroll = false
    let sortTimer = events.sortTimer

    if (events.action) {
      action = false
      if (events.swipe) {
        // Handle swipe end
        // ...
      } else if (events.sort) {
        // Handle sort end
        // ...
      } else if (!scroll && Math.abs(events.diffX) < 5 && Math.abs(events.diffY) < 5) {
        // Tap
        if (event.type === 'touchend') {
          // Prevent phantom clicks
          event.preventDefault()
        }
        // Handle tap
        // ...
      }
      swipe = false
      sort = false
      scroll = false

      if (sortTimer) {
        clearTimeout(sortTimer)
        sortTimer = null
      }

      enablePageScrolling()

      setEvents({ ...events, action, swipe, sort, scroll, sortTimer })

      if (event.type == 'mouseup') {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)
        // $(document).off('mousemove', onMove).off('mouseup', onEnd)
      }
    }
  }

  const onEnd = (event: any) => {
    if (refWheeler.current) {
      const direction = events.startY < events.endY ? 'up' : 'down'
      const time = (Number(new Date()) - Number(startTime)) / 100

      let speed = 0
      let dist = 0

      if (time < 300) {
        speed = (events.endY - events.startY) / time
        dist = (speed * speed) / (2 * 0.0006)
        if (events.endY - events.startY < 0) dist = -dist
      } else {
        dist = events.endY - events.startY
      }

      console.log('TIME/DIST::::::', speed, time, dist)

      // scrollIt({ t: refWheeler.current, val: rotateAngle, time, orig: rotateAngle, direction })
    }

    let action = false
    let swipe = false
    let sort = false
    let scroll = false
    let sortTimer = events.sortTimer
    let touch = false

    if (events.action) {
      action = false
      swipe = false
      sort = false
      scroll = false
      touch = false

      if (sortTimer) {
        clearTimeout(sortTimer)
        sortTimer = null
      }

      // enablePageScrolling()

      // setEvents({ ...events, action, swipe, sort, scroll, sortTimer, touch })

      if (event.type == 'mouseup') {
        // document.removeEventListener('mousemove', onMove)
        // document.removeEventListener('mouseup', onEnd)
        // $(document).off('mousemove', onMove).off('mouseup', onEnd)
      }
    }

    setTimeout(() => {
      enablePageScrolling()
    }, 10)
  }

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault()

    setTouchEvt('end')

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

  const prefix = 'webkit'
  const has3d = true
  const h = 40

  const iv = [] as ReturnType<typeof setInterval>[]

  interface ScrollProps {
    t: HTMLDivElement
    val: number
    time: number
    orig: number
    direction: 'up' | 'down'
  }

  const scrollIt = (fProps: ScrollProps) => {
    const { time, orig, direction } = fProps

    //t.data('pos', val)

    // const rotationAngle = Number(angleValue || 0) - diffY
    // setRotateAngle(rotationAngle)

    console.log('----> rotationAngle: ', rotateAngle)

    if (refWheeler.current) {
      refWheeler.current.style.transition = 'all 1s ease-out'
      //   refWheeler.current.style.transform = has3d
      //     ? 'translate3d(0,' + `${val * h}` + 'px,0);'
      //     : 'top:' + `${val * h}` + 'px;'
    }

    //   console.log("style 1: ", time ? prefix + "-transition:all " + time.toFixed(1) + "s ease-out;" : "");
    //   console.log(
    //     "style 2: ",
    //     has3d ? prefix + "-transform:translate3d(0," + val * h + "px,0);" : "top:" + val * h + "px;"
    //   );
    console.log('+++++ direction: ', direction)

    if (time) {
      console.log('time: ', time)
    }
    if (has3d) {
      console.log('has3d: ', has3d)
    }

    const getVal = (t: number, b: number, c: number, d: number) => {
      const value = c * Math.sin((t / d) * (Math.PI / 2)) + b

      console.log('t, b, c, d: ', t, b, c, d)
      console.log('value: ', value)

      return value
    }

    if (time) {
      let i = 0
      clearInterval(iv[1])

      const velocity = 25

      const rotationAngle =
        direction === 'down' ? Math.abs(rotateAngle) + time * velocity : Math.abs(rotateAngle) - time * velocity

      setRotateAngle(rotationAngle)

      return

      iv[1] = setInterval(() => {
        i += 0.1

        console.log(
          Math.sin((i / time) * (Math.PI / 2)),
          '---> i, orig, rotateAngle - orig, time: ',
          i,
          orig,
          rotateAngle - orig,
          time
        )

        const vvv = Number(rotateAngle) + i * Math.sin((i / time) * (Math.PI / 2))

        const finalValue = Math.round(getVal(i, orig, rotateAngle - orig, time))

        console.log('---> finalValue: ', vvv)

        const rotationAngle = vvv
        setRotateAngle(rotationAngle)

        // t.data('pos', Math.round(getVal(i, orig, val - orig, time)))

        if (i >= time) {
          clearInterval(iv[1])
          // t.data('pos', val)
        }
      }, 100)
      // Show +/- buttons
      // clearTimeout(tv[index])

      // tv[index] = setTimeout(() => {
      //   if (!t.hasClass('dwa')) t.closest('.dwwl').find('.dwwb').fadeIn('fast')
      // }, time * 1000)
    } else {
      // t.data('pos', val)
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
    disablePageScrolling()
    // Clear our timeout throughout the scroll
    clearTimeout(isScrolling as unknown as number)
    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(() => {
      // Run the callback
      console.log('-------- > Scrolling has stopped.', isScrolling)

      enablePageScrolling()

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

  const handleScroll3 = () => {
    if (events.diffY) {
      const scrollTopValue = (events.diffY / 4) as number

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
          onMouseDown={event => onStart(event)}
          onTouchStart={event => onStart(event)}
          onMouseMove={event => onMove(event)}
          onTouchMove={event => onMove(event)}
          onTouchEnd={event => onEnd(event)}
          onMouseUp={event => onEnd(event)}
          onTouchCancel={event => onEnd(event)}
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

      <div>Angle: {rotateAngle} deg</div>
      <div>Value: {value}</div>
      <div>Angle value: {angleValue}</div>

      <h4 className="text-2xl mb-2">Events</h4>
      <table style={{ width: '100%', marginBottom: 20, textAlign: 'left' }}>
        <thead>
          <tr>
            <th style={{ width: 150 }}>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {events &&
            Object.entries(events).map((entry, index) => (
              <tr key={index}>
                <td>{entry?.[0]}</td>
                <td>{`${entry?.[1] as string}`}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div>Touch: {touchEvt}</div>
      <div>TouchY: {touches} px</div>
      <Ui_Button onClick={() => scrollIntoView(10)}>scroll into view</Ui_Button>
    </>
  )
}

export default React.memo(WheelPicker3)
