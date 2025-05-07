interface IProps {
	colorBorder?: string
	colorTitle?: string
	children: JSX.Element
	title: string
	className?:string
	style?: object
}

 const Card3 = (props: IProps) => {
	const {
		colorBorder = 'border-gray-400',
		colorTitle = '',
		children,
		title,
	} = props

	return (
		<fieldset className={`${colorBorder} border border-solid p-3 rounded-md ${props?.className}`} style={props?.style}>
			<legend className={`${colorTitle} text-sm`}>{title}</legend>
			<section>{children}</section>
		</fieldset>
	)
}
export default Card3