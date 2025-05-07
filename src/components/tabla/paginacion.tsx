import { Fragment } from 'react'
// import { IRowDataParseada, Tabla } from './tabla'
interface IPropsPaginacion {
	data: any[]
	lengthItems: number
	currentPage: number
	prevCurrentPage: number
	initItem: number
	finItem: number
	hideLabel?: boolean
	setState: (state: any) => void
}
export const Paginacion = (props: IPropsPaginacion) => {
	const totalData = props.data.length
	const length = props.lengthItems
	const totalPaginas = Math.ceil(totalData / length)

	const currentPage = props.currentPage
	let itemPagTotal: number[] = []
	for (let i = 1; i <= totalPaginas; i++) {
		itemPagTotal.push(i)
	}
	// console.log('total paginas::', itemPagTotal)
	return (
		<div
			className={
				'paginacion flex w-full  mt-3 ' +
				(!props?.hideLabel ? 'justify-between' : 'justify-center')
			}
		>
			{!props?.hideLabel && (
				<div className="info-label ">
					<label className="text-gray-600 dark:text-white items-center block w-full">
						Mostrando {props.initItem + 1} a {props.finItem} de &nbsp;
						{props.data.length} Entradas
					</label>
				</div>
			)}
			<div className="items-paginas  ">
				<ul className="flex justify-center w-full">
					{itemPagTotal.map((x, i) => {
						return (
							<li
								key={x}
								onClick={(e) => {
									props.setState({
										prevCurrentPage: currentPage,
										currentPage: x,
									})
								}}
								className={
									'flex items-center dark:border dark:border-blue-900 dark:bg-transparent justify-center p-1 w-7 h-7' +
									'cursor-pointer hover:bg-slate-400 hover:cursor-pointer text-white  rounded-lg active:bg-blue-900' +
									(x == props.currentPage
										? ' bg-blue-900'
										: ' bg-blue-gray-300')
								}
							>
								{x}
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}
interface IPropsTextPaginacion {
	// ctx: Tabla
}
export const TextPaginacion = (props: IPropsTextPaginacion) => {
	return <Fragment></Fragment>
}
