import React, {
	CSSProperties,
	Fragment,
	MouseEventHandler,

} from 'react'
import '../scss/buttons.scss'
export interface IButtonProps {
	type?: 'success' | 'danger' | 'info' | 'primary' | 'secondary' | 'warning'
	icon?: string
	iconRight?: string
	text?: string
	class?: string
	css?: CSSProperties
	outline?: boolean
	title?: string
	primary?: boolean
	secondary?: boolean
	info?: boolean
	success?: boolean
	upperCase?: boolean
	lowerCase?: boolean
	color?: string
	danger?: boolean
	warning?: boolean
	children?: any
	disabled?: boolean
	style?: CSSProperties
	btnGroup?: boolean
	onClick?: MouseEventHandler<HTMLButtonElement>
	size?: 'xs' | 'sm' | 'md' | 'lg'
	rounded?: boolean
}
export const ButtonAdd = React.memo((props: IButtonProps) => {
	const handleClick = (e: any) => {
		if (props.onClick) props.onClick(e)
	}
	return (
		<Fragment>
			<button
				className={
					'border border-gray-300 rounded py-1.5 px-3  hover:bg-blue-700' +
					'hover:text-white active:bg-blue-700 active:text-white focus:outline-none ' +
					'focus:ring focus:ring-blue-100' +
					props.class
				}
				onClick={(e) => {
					handleClick(e)
				}}
				style={props.style}
			>
				{props.icon && (
					<span className={'lbl-icon-button ' + props.icon}> </span>
				)}
				{props.text || 'button'}
				{props.iconRight && (
					<span className={'lbl-icon-button ' + props.iconRight}> </span>
				)}
			</button>
		</Fragment>
	)
})

export const Button2 = React.memo((props: IButtonProps) => {
	let styles = 'cursor-pointer hover:cursor-pointer border rounded py-1 px-2 '
	let _css = props.css || props.style
	if (props.primary || props.type == 'primary')
		styles +=
			(props.outline
				? 'border-blue-600 text-blue-600 hover:bg-blue-500 hover:text-white active:outline-blue-600 active:bg-blue-500 '
				: 'border-blue-600 bg-blue-500 text-white hover:bg-blue-500 active:bg-blue-500 active:text-white   active:bg-blue-500 active:outline-blue-600 active:outline active:outline-1 ') +
			'hover:shadow-blue-500'
	if (props.success || props.type == 'success')
		styles +=
			(props.outline
				? 'border-green-600 text-green-600 hover:bg-green-500 hover:text-white active:outline-green-600 active:bg-green-500 '
				: 'border-green-600 bg-green-500 text-white hover:bg-green-500 active:bg-green-500 active:text-white active:outline active:outline-1 active:outline-green-600') +
			' hover:shadow-green-500'
	if (props.secondary || props.type == 'secondary')
		styles +=
			(props.outline
				? 'border-gray-600 text-gray-600 hover:bg-gray-500 hover:text-white active:outline-gray-600 active:bg-gray-500'
				: 'border-gray-600 bg-gray-500 text-white hover:bg-gray-500 active:bg-gray-500 active:text-white active:outline active:outline-1 active:outline-gray-600') +
			' hover:shadow-gray-500'
	if (props.danger || props.type == 'danger')
		styles +=
			(props.outline
				? 'border-red-600 text-red-600 hover:bg-red-500 hover:text-white active:outline-red-600 active:bg-red-500 '
				: 'border-red-600  bg-red-500 text-white hover:bg-red-500 active:bg-red-500 active:text-white active:outline active:outline-1 active:outline-red-600') +
			' hover:shadow-red-500'
	if (props.info || props.type == 'info')
		styles +=
			(props.outline
				? 'border-sky-600 text-sky-600 hover:bg-sky-500 hover:text-white active:outline-sky-600 active:bg-sky-500 '
				: 'border-sky-600  bg-sky-500 text-white hover:bg-sky-500 active:bg-sky-500 active:text-white active:outline active:outline-1 active:outline-sky-600') +
			' hover:shadow-sky-500'
	if (props.warning || props.type == 'warning')
		styles += props.outline
			? 'border-orange-600 text-orange-600'
			: 'border-orange-600 bg-orange-500 '
	if (
		!props.primary &&
		!props.secondary &&
		!props.info &&
		!props.danger &&
		!props.warning &&
		!props.success &&
		!props.type
	)

		styles += (props.outline ? 'border  ' : '') + 'hover:shadow-white-500'

	
	styles += ' hover:shadow-inner hover:opacity-90  '
	switch (props.size) {
		case 'xs':
			styles += 'py-0.5 px-0.5 '
			break
		case 'sm':
			styles += 'py-1 px-1 '
			break
		case 'md':
			styles += 'py-1.5 px-1.5 '
			break
		case 'lg':
			styles += 'py-2 px-3 '
			break
	}
	
	styles += props.btnGroup ? 'mx-0' : 'mx-0.5'
	if (props.rounded) styles += ' rounded-full ' /* padding: 1px; */
	if (props.rounded)
		_css = {
			..._css,
			fontSize: '10px',
			height: '1.5rem',
			width: '1.5rem',
			padding: '3px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		} /* padding: 1px; */

	const handleClick = (e: any) => {
		if (props.onClick) props.onClick(e)
	}

	if(props.disabled){
		styles=' border rounded py-1 px-2 '+(props.outline
			? 'border-gray-400 text-gray-400  '
			: 'border-gray-400 bg-gray-400 text-white  ') +
		' hover:shadow-gray-400'		
	}

	return (
		<Fragment>
			<button
				className={'flex justify-center items-center gap-1 ' + styles + ' ' + (props.class ? props.class : '')}
				disabled={props?.disabled}
				onClick={(e) => {
					handleClick(e)
				}}
				title={props.title}
				style={_css}
			>
				{props.icon && (
					<>
						<span className={'lbl-icon-button ' + props.icon}> </span>
					</>
				)}
				{props.text && (
					<>
						
						<span>
							{props.upperCase
								? props.text.toUpperCase()
								: props.lowerCase
								? props.text.toLowerCase()
								: props.text}
						</span>
					</>
				)}
				{props.children && props.children}
				{props.iconRight && (
					<span className={'lbl-icon-button ' + props.iconRight}> </span>
				)}
			</button>
		</Fragment>
	)
})
