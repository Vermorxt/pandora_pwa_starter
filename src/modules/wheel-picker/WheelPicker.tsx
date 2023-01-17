import { Ui_Button } from '@vermorxt/pandora_ui'
import { Helper } from '@vermorxt/pandora_utils'
import React, { FC, useEffect, useReducer, useRef, useState } from 'react'
import { AnyType } from '../../_types/anytype'
import scss from './styles/wheel-picker.module.scss'

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
let timeOutScrolling: null | ReturnType<typeof setTimeout> = null

const WheelPicker: FC<any> = () => {
  const testDataSet = testNumbers

  const [, forceUpdate] = useReducer(x => Number(x) + 1, 0)
  const [data, setData] = useState(testDataSet)
  const [timeOut, setTimeOut] = useState(false)
  const [timeOutScrollIntoView, setTimeOutScrollIntoView] = useState(false)

  const [wheelValue, setWheelValue] = useState<string>()
  const [scrollTop, setScrollTop] = useState<any>()
  const [lastAddedIndex, setLastAddedIndex] = useState<number>(0)
  const [firstElementDimension, setFirstElementDimension] = useState<any>()
  const [selectorElementDimension, setSelectorElementDimension] = useState<any>()

  const refWrapper = useRef<HTMLDivElement>(null)
  const refSelector = useRef<HTMLDivElement>(null)
  const refContainer = useRef<HTMLDivElement>(null)
  const refWheeler = useRef<HTMLDivElement>(null)

  const refWrapper2 = useRef<HTMLDivElement>(null)
  const refSelector2 = useRef<HTMLDivElement>(null)
  const refContainer2 = useRef<HTMLDivElement>(null)
  const refWheeler2 = useRef<HTMLDivElement>(null)

  const itemsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (itemsRef.current.length === testDataSet.length) {
      // setTransformStyles()
    }
  }, [])

  const setTransformStyles = () => {
    console.log('> setTransformStyles: ')
    const elemWrapper = refContainer2.current as HTMLElement
    const elem = refWheeler2.current as HTMLElement

    const cellItems = itemsRef.current
    const items = testNumbers.length
    const diameter = 300
    const radius = diameter / 2
    const angle = 360 / items
    const circumference = Math.PI * diameter
    const height = circumference / items

    console.log('3d: ', items, diameter, radius, angle, circumference, height)

    for (let i = 0; i < cellItems.length; i++) {
      const transform = `rotateX(${angle * i}deg) translateZ(${radius}px)`

      itemsRef.current[i].style.backgroundColor = 'red'
      itemsRef.current[i].style.transform = transform
      itemsRef.current[i].style.height = `${parseInt(height.toString(), 10).toString()}px`

      console.log('cell items: ', itemsRef.current[i])
    }

    // elemWrapper.style.transformOrigin = '50% calc(50% + ' + height / 2 + 'px)'
    elemWrapper.style.transformOrigin = `50% calc(50 + ${parseInt((height / 2).toString(), 10).toString()}px`
    elemWrapper.style.marginTop = `-${parseInt(height.toString(), 10).toString()}px`
  }

  const setHeightManually = (focusIndex: number) => {
    if (!timeOut) {
      console.log('------>> TIME OUT')

      return
    }

    console.log('> focus index: ', focusIndex, data)

    console.log('> NOW after wait: ', focusIndex, data)

    if (refWheeler.current) {
      const elem = refWheeler.current as HTMLElement
      const style = getComputedStyle(elem)
      const cellItems = elem.querySelectorAll(`.cell-item-${focusIndex}`)
      const firstElem = cellItems[0] as HTMLDivElement

      if (firstElem) {
        const dimensions = {
          width: firstElem.offsetWidth,
          height: firstElem.offsetHeight,
          scrollWidth: firstElem.scrollWidth,
          scrollHeight: firstElem.scrollHeight,
          top: firstElem.offsetTop,
          style,
        }

        // console.log('cell item: ', firstElem, dimensions)

        firstElem.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'nearest' })

        if (refWrapper.current) {
          const wrapper = refWrapper.current as HTMLElement
          const dataSetHeight = data.length * 24
          const testDataSetHeight = testDataSet.length * 24
          const setScroll = dataSetHeight - testDataSetHeight + 24 * focusIndex - 70
          // wrapper.scrollTop = setScroll
        }

        console.log('%c scroll done! ', 'background: #00FFFF; color: #bada55')
      } else {
        console.log('%c elem not found! ', 'background: #ff0000; color: #bada55')
      }
    }
  }

  const scrollIntoView = (focusIndex: number) => {
    // console.log('ref wheeler', refWheeler.current)

    if (timeOutScrollIntoView) return
    setTimeOutScrollIntoView(true)

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

      setFirstElementDimension(dimensions)

      // console.log('cell item: ', firstElem, dimensions)

      firstElem.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })

      setTimeout(() => {
        setTimeOutScrollIntoView(false)
      }, 1000)
    }
  }

  const addInfiniteItems = (scrollTop: number, selectorTop: number, currentValue: string) => {
    console.log('infinite: ', scrollTop, selectorTop, currentValue)

    if (refWheeler.current) {
      const wheelerElem = refWheeler.current as HTMLDivElement
      const wheelerHeight = wheelerElem.scrollHeight

      const missingItemsNumber = ((scrollTop - selectorTop) / 24) * -1
      const missingItems = parseInt(missingItemsNumber.toString(), 10)

      console.log(missingItems, missingItemsNumber, 'infinite: ', scrollTop, selectorTop, wheelerHeight)

      if (missingItems > 0) {
        const lastVisibleItem = data[0]

        if (Number(lastVisibleItem) === 0) {
          data.unshift(data[data.length - 1])
          data.pop()
        }
        if (Number(lastVisibleItem) > 0) {
          data.unshift(lastVisibleItem)
          data.pop()
        }

        setData([...data])
      }
    }
  }

  const handleScroll = (event: any) => {
    // Clear our timeout throughout the scroll
    clearTimeout(isScrolling as unknown as number)
    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(() => {
      // Run the callback
      console.log('-------- > Scrolling has stopped.', isScrolling)
    }, 100)

    if (event) {
      const scrollTopValue = event?.target?.scrollTop as number

      const cellHeight = firstElementDimension.scrollHeight
      const selectorStyleTop = selectorElementDimension.style.top as string
      const selectorTop = parseInt(selectorStyleTop, 10) as number
      const selectorRange = scrollTopValue + selectorTop
      const focusIndex = parseInt((selectorRange / cellHeight).toString(), 10)

      if (refWheeler.current) {
        const wheeler = refWheeler.current as HTMLElement
        const focusElements = wheeler.querySelectorAll(`.cell-value-${focusIndex}`)
        const focusElement = focusElements[0]

        setWheelValue(focusElement?.textContent?.toString())

        if (scrollTopValue < scrollTop) {
          // Clear our timeout throughout the scroll
          clearTimeout(timeOutScrolling as unknown as number)
          setTimeOut(true)

          // Set a timeout to run after scrolling ends
          timeOutScrolling = setTimeout(() => {
            // Run the callback
            console.log('-------- > Scrolling has stopped.')

            scrollIntoView(focusIndex)
            setTimeOut(false)
          }, 100)

          if (lastAddedIndex !== focusIndex) {
            // NOTE: within a tick

            if (focusIndex < testDataSet.length / 3) {
              const dataClone = [...data]
              console.log('%c do it up! ', 'background: #ff0000; color: #bada55', lastAddedIndex, focusIndex)

              dataClone.unshift(...testDataSet)

              if (dataClone.length > testDataSet.length * 2) {
                dataClone.splice(dataClone.length - testDataSet.length, testDataSet.length)
              }

              setData([...dataClone])
              setLastAddedIndex(focusIndex)
              setHeightManually(focusIndex + testDataSet.length + 3)
            }
          }
        }

        if (scrollTopValue > scrollTop) {
          // Clear our timeout throughout the scroll
          clearTimeout(timeOutScrolling as unknown as number)
          setTimeOut(true)

          // Set a timeout to run after scrolling ends
          timeOutScrolling = setTimeout(() => {
            // Run the callback
            console.log('-------- > Scrolling has stopped.')

            scrollIntoView(focusIndex)
            setTimeOut(false)
          }, 100)

          const setScroll = wheeler.scrollHeight + scrollTopValue + 6 * 24

          if (lastAddedIndex !== focusIndex) {
            // NOTE: within a tick

            // console.log('%c last index, focus index! ', 'background: #000; color: #bada55', lastAddedIndex, focusIndex)

            if (focusIndex > data.length - testDataSet.length / 3) {
              const dataClone = [...data]

              console.log('%c do it! ', 'background: #ff0000; color: #bada55', lastAddedIndex, focusIndex)

              dataClone.push(...testDataSet)

              if (dataClone.length > testDataSet.length * 2) {
                dataClone.splice(0, testDataSet.length)

                console.log(focusIndex, focusIndex - testDataSet.length + 1, 'data clone spliced d: ', dataClone)
              }

              const ITEMS_SPACE_TOP = 3

              setData([...dataClone])
              setLastAddedIndex(focusIndex)
              setHeightManually(focusIndex - testDataSet.length - 1 + ITEMS_SPACE_TOP)
            }
          }
        }

        setLastAddedIndex(focusIndex)
        setScrollTop(scrollTopValue)

        console.log('data length: ', data.length)
      }
    }
  }

  useEffect(() => {
    if (refWheeler.current) {
      // console.log('ref wheeler', refWheeler.current)

      if (refWheeler.current) {
        const elem = refWheeler.current as HTMLElement
        const style = getComputedStyle(elem)
        const cellItems = elem.querySelectorAll('.cell-item')
        const firstElem = cellItems[0] as HTMLDivElement
        const dimensions = {
          width: firstElem.offsetWidth,
          height: firstElem.offsetHeight,
          scrollWidth: firstElem.scrollWidth,
          scrollHeight: firstElem.scrollHeight,
          top: firstElem.offsetTop,
          style,
        }

        setFirstElementDimension(dimensions)

        // console.log('cell item: ', firstElem, dimensions)
      }
    }

    if (refSelector.current) {
      // console.log('ref selector', refWheeler.current)

      if (refSelector.current) {
        const elem = refSelector.current as HTMLElement
        const style = getComputedStyle(elem)
        const dimensions = {
          width: elem.offsetWidth,
          height: elem.offsetHeight,
          scrollWidth: elem.scrollWidth,
          scrollHeight: elem.scrollHeight,
          top: elem.offsetTop,
          style,
        }

        setSelectorElementDimension(dimensions)

        // console.log('elem selector: ', elem, dimensions)
      }
    }
  }, [refWheeler])

  return (
    <>
      <h1>Picker</h1>
      <div className={scss.wrapper} onScroll={handleScroll} ref={refWrapper}>
        <div className={scss.selector} ref={refSelector}></div>
        <div className={scss.container} ref={refContainer}>
          <div className={scss.wheeler} ref={refWheeler}>
            {data.map((d, index) => (
              <div className={`${scss.item} cell-item cell-item-${index}`} key={Math.random()}>
                <span className={`${scss.value} cell-value-${index}`}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 50 }}>{wheelValue}</div>
      <div style={{ marginTop: 50, marginBottom: 50 }}>
        {' '}
        <Ui_Button onClick={() => setHeightManually(10)}>scroll to</Ui_Button>
        <Ui_Button onClick={() => scrollIntoView(10)}>scroll into view</Ui_Button>
      </div>
    </>
  )
}

export default React.memo(WheelPicker)
