import { CSSProperties, memo, useEffect, useRef, useState } from 'react'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

interface IScrollBar {
	children: JSX.Element
	wheelSpeed?: number
	wheelPropagation?: boolean
	minScrollbarLength?: number
	css?: CSSProperties
	width?: string
	height?: string
}

export const ScrollBar = memo((props: IScrollBar) => {
	const inputRef = useRef(null)
	const [cssScroll, setCssScroll] = useState({} as CSSProperties)

	useEffect(() => {
		const parseCSS: CSSProperties = {
			...props.css,
      position:'relative',
			width: props.width || props.css?.width,
			height: props.height || props.css?.height || '600px',
		}

    setCssScroll(parseCSS)

		const scroll = new PerfectScrollbar(inputRef.current, {
			minScrollbarLength: props.minScrollbarLength||100,
			wheelSpeed: props.wheelSpeed,
			wheelPropagation: props.wheelPropagation,
		})
		console.log('scroll initialized>', scroll)
		

		//cuando se desmonta el componente
		return () => {
			scroll.destroy()
		}
	}, [inputRef, props.css, props.height, props.minScrollbarLength, props.wheelPropagation, props.wheelSpeed, props.width])

	return (
		<>
			<div style={{...cssScroll}} ref={inputRef}>{props.children}</div>
		</>
	)
})
