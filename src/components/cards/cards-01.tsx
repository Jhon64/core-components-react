

interface ICardProps {
	children: JSX.Element
	className?:string

}
 const Card01 = (props:ICardProps) => {
	return (
		<div className={"relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md p-2 "+ (props.className)}>
			{props.children}
		</div>
	)
}

interface ICardBodyProps extends ICardProps{classNameBody?:string}

 const CardBody01 = (props:ICardBodyProps) => {
  return (
		<div className={"p-1.5 "+(props.classNameBody)}>
			{props.children}
		</div>
	)
}
export default {Card01,CardBody01}