import { CSSProperties, Fragment, useEffect, useRef, useState } from 'react'

import { Card02 } from '../cards/card-02'
import { LengthItems } from './nro-items-&search'
import { ManageColumns } from './manage-columns'
import { Button2 } from '../buttons/buttons'
import { Paginacion } from './paginacion'
import { Modal } from '../modal'
import ExcelJS from 'exceljs'
import { Label2 } from '../labels'
import { IColumnsTabla, IPropsTabla } from '../interfaces/ITablaComponent'
import { Excel, IColumnType } from '../../helpers/excel.helper'
import { StringHelper } from '../../helpers/string.helper'
import { NotificacionUtils } from '../../utils/notificacion-utils'

interface IPropsBody {
	overflow: boolean
	height: string
}

export interface ITableReportProps extends IPropsTabla {
	keyTable?: string
	keyDet?: string
	labelTable?: string
	//**consgiracion para poder mover las columnas y guardar la configuracion */
	reorderColumns?: boolean
	//**Ordenamiento para todas las columas */
	sortingAll?: boolean
	exportExcel?: boolean
	showLengthItems?: boolean
	btnAddRegistro?: boolean
	propsBody?: IPropsBody
	onClickAddReg?: (e: any) => void
	getRegsExcel?: (registros: any[]) => void
	itemsPerPage?: number
	selected?: any //*para pintar el row de la tabla
	responsive?: boolean
	hideLblPagination?: boolean
	showAll?: boolean
	heightShowAll?: string
	sinBordes?: boolean
	onClickRow?: (row: any) => void
	onGenerateExcel?: (callb: Function) => void // para ejecutar el proceso de descarga
	noPaddingNoMargen?: boolean
}

export interface ITableReportState {
	columns: IColumnsTabla[]
	data: any[]
}

export const TableReport = (props: ITableReportProps) => {
	const [THIS] = useState(() => {
		return {
			dataMap: new Map<any, any[]>(),
			dataDetMap: new Map<any, any[]>(),
			columnsMap: new Map<string, IColumnsTabla>(),
			columnsDetMap: new Map<string, IColumnsTabla>(),
			bodyTable: [] as any[],
			_data: (props.data as any[]) || [],
			_dataAll: [...props.data],
			_columns: (props.columns as IColumnsTabla[]) || [],
			_columnsDetail: (props.columnsDetail as IColumnsTabla[]) || [],
			typeSorting: '' as 'ASC' | 'DESC' | '',
			_colSorting: {} as IColumnsTabla,
			_activeSorting: false as boolean,
			itemsPerPage: props.itemsPerPage || 10,
			initIndex: 0,
			finIndex: 0,
			finData: 0,
			prevCurrentPage: 0,
		}
	})

	useEffect(() => {
		THIS._data = props.data
		return () => {
			;[]
		}
	}, [props.data])

	const [currentPage, setCurrentPage] = useState(1)
	const [showModalExcel, setShowModalExcel] = useState(false)
	const [lengthItems, setLengthItems] = useState(10)
	const [fullData, setFullData] = useState([] as any[])
	const [cellSorting, setCellSorting] = useState({
		up: false,
		down: true,
		_keyCol: '',
	})
	const [rowsTable, setRowsTable] = useState(new Map() as Map<any, any[]>)
	const [rowsTableDet, setRowsTableDet] = useState(new Map() as Map<any, any[]>)

	const generateExcel = () => {
		const columns = THIS._columns
		const columnsExcel: IColumnType[] = []
		const columnPrincipal: IColumnType[] = []
		for (let col of columns) {
			if (col?.excel?.exclude) continue
			let _col: IColumnType = {
				key: col._key,
				label: col.label,
				width: col?.excel?.width || 20,
				style: col?.excel?.style || {},
				propsExcel: {
					excludeCell: col?.excel?.exclude,
					setCell: col.excel?.setCell,
					isDate: col?.excel?.isDate,
					isText: col.excel?.isText,
				},
			}
			columnPrincipal.push(_col)
		}

		const excel = new Excel({
			columns: columnPrincipal,
			title: props.keyTable || 'Index',
			company: 'Jhon64',
			creator: 'Jonathan Amaranto',
			created: new Date(),
			modified: new Date(),
			sheet: {
				name: props.keyTable || 'index',
				options: {
					headerFooter: {
						oddFooter: 'Page &P of &N',
					},
				},
			},
		})

		let idxRow = 2
		for (let reg of THIS._dataAll) {
			const columnsExcel = excel.columnsExcel()
			const getRow = excel.getRow(idxRow)
			for (let _col of columnsExcel) {
				if (_col.subcolumns.length) {
					for (let _subCol of _col.subcolumns) {
						getRow.getCell(_subCol.idx).value = reg[_subCol.key]
					}
					continue
				}
				let _parseValue = _col.propsExcel?.setCell
					? _col.propsExcel.setCell(reg[_col.key], reg)
					: reg[_col.key]
				getRow.getCell(_col.idx).value = _parseValue
			}
			idxRow++
		}

		excel.download(`${props.keyTable || 'index'}.xlsx`)
	}

	const preparseData = () => {
		let dataAll = THIS._dataAll
		const _tempData = []
		const columns = [...(THIS._columns || [])]
		const columnsDet = [...(THIS._columnsDetail || [])]

		for (let _columns of columns) {
			if (_columns.hideColumn) continue
			if (_columns._key) {
				if (!THIS.columnsMap.has(_columns._key)) {
					THIS.columnsMap.set(_columns._key, _columns)
					THIS.dataMap.set(_columns._key, [])
				}
			}
		}

		for (let _columnsDet of columnsDet) {
			if (_columnsDet.hideColumn) continue
			if (_columnsDet._key) {
				if (!THIS.columnsDetMap.has(_columnsDet._key)) {
					THIS.columnsDetMap.set(_columnsDet._key, _columnsDet)
					THIS.dataDetMap.set(_columnsDet._key, [])
				}
			}
		}

		if (THIS._activeSorting) {
			if (THIS.typeSorting === 'ASC') {
				dataAll.sort((a, b) => {
					let res = a[THIS._colSorting._key] > b[THIS._colSorting._key] ? 1 : 0
					return res
				})
				setCellSorting({
					up: false,
					down: true,
					_keyCol: THIS._colSorting._key,
				})
			} else if (THIS.typeSorting === 'DESC') {
				dataAll.sort((a, b) => {
					let res = a[THIS._colSorting._key] < b[THIS._colSorting._key] ? -1 : 0
					return res
				})
				setCellSorting({
					up: true,
					down: false,
					_keyCol: THIS._colSorting._key,
				})
			}
		}

		if (props.showAll) {
			const parseData = dataAll.filter((x) => x)
			for (let i = 0; i < parseData.length; i++) {
				const reg = parseData[i]
				if (!reg) continue

				for (let [key, _col] of THIS.columnsMap.entries()) {
					let _val = reg[key]
					if (_col.hideColumn) continue //todo: SI LA COLUMNA SE OCULTA
					// if (_col.render) {
					//   //* personalizacion de las celdas de la tabla
					//   _col.render(_val, reg, i)
					// }
					if (THIS.dataMap.has(key)) {
						let _dataList = THIS.dataMap.get(key) || []
						_dataList.push(_val)
						THIS.dataMap.set(key, _dataList)
					}
					reg[key] = _val
				}
				_tempData.push(reg)
			}
		} else {
			// console.log('data ::', dataAll)
			const _currentPage = currentPage - 1 < 0 ? 1 : currentPage // *pagina previa
			THIS.initIndex =
				THIS.itemsPerPage != -100 ? (_currentPage - 1) * THIS.itemsPerPage : 0 //* index inicial

			const indexFinal = currentPage * THIS.itemsPerPage //*total index final
			THIS.finIndex = dataAll.length >= indexFinal ? indexFinal : dataAll.length //* valor final de index

			const parseData = dataAll.slice(THIS.initIndex, THIS.finIndex)
			let _pageSaved // todo: envia a la pagina principal cuando hay un registro nuevo
			for (let i = 0; i < parseData.length; i++) {
				const reg = parseData[i]
				if (!reg) continue

				if (reg._pending && reg._id) _pageSaved = 1
				for (let [key, _col] of THIS.columnsMap.entries()) {
					let _val = reg[key]
					if (_col.hideColumn) continue //todo: SI LA COLUMNA SE OCULTA
					// if (_col.render) {
					//   //* personalizacion de las celdas de la tabla
					//   _col.render(_val, reg, i)
					// }
					if (THIS.dataMap.has(key)) {
						let _dataList = THIS.dataMap.get(key) || []
						_dataList.push(_val)
						THIS.dataMap.set(key, _dataList)
					}
					reg[key] = _val
				}
				_tempData.push(reg)
			}
			if (_pageSaved) {
				setCurrentPage(1)
			}
		}

		THIS._data = _tempData
		setFullData(_tempData)
		setRowsTable(THIS.dataMap)
		setRowsTableDet(THIS.dataDetMap)
	}

	const sortingData = (format: 'ASC' | 'DESC', _col: IColumnsTabla) => {
		THIS.typeSorting = format
		THIS._colSorting = _col
		THIS._activeSorting = true
		preparseData()
	}

	const TablaTH = (propsTH: ITablaTHprops) => {
		return (
			<th
				className={
					`px-1.5 py-2 ${
						(propsTH.index === 0 && 'rounded-ss-md') ||
						(propsTH.isFinalCol && 'rounded-se-md ')
					} ` +
					'text-left font-bold dark:bg-transparent dark:border-r-transparent ' +
					' border-b border-b-gray-400 dark:border-b dark:border-b-blue-500 ' +
					' dark:text-brown-50 ' +
					(propsTH.column?.classHeader || propsTH.column?.classHeader)
				}
				style={propsTH.column?.cssHeader || propsTH.column?.css}
				key={`${propsTH.index}_${Date.now()}`}
			>
				<div className="flex justify-between  items-center w-full ">
					<div className="text-white dark:text-white w-full">
						{propsTH.column.label &&
							!propsTH.column?.setColumnHeader &&
							!propsTH.isFinalCol && (
								<label className="text-white">{propsTH.column.label}</label>
							)}
						{propsTH.column?.setColumnHeader &&
							propsTH.column.setColumnHeader()}

						{propsTH.isFinalCol &&
							(props.exportExcel ||
								props.btnAddRegistro ||
								props.importExcel) && (
								<div className="flex flex-row-reverse">
									{props.btnAddRegistro && (
										<Button2
											size="xs"
											primary
											outline
											icon="fa fa-plus"
											title="Agregar Nuevo registro"
											onClick={(ev) => {
												if (props.onClickAddReg) props.onClickAddReg(ev)
											}}
										/>
									)}
									{props.importExcel && (
										<Button2
											size="xs"
											class=""
											icon="fa fa-upload"
											onClick={() => {
												// console.log('show laber::', showModalExcel)
												setShowModalExcel(true)
											}}
											title="Importar registros"
											outline
											success
										/>
									)}
									{props.exportExcel && (
										<Button2
											size="xs"
											class=""
											icon="fa fa-download"
											onClick={() => generateExcel()}
											title="Descargar Formato"
											outline
											primary
										/>
									)}
								</div>
							)}
					</div>
					{propsTH.column.sorting && (
						<div className="flex flex-col text-gray-600 dark:text-white">
							<i
								key={`${propsTH.index}_up`}
								className={
									'bx bxs-up-arrow cursor-pointer text-xs ' +
									(cellSorting.down &&
									cellSorting._keyCol === propsTH.column._key
										? 'text-white'
										: '')
								}
								onClick={(_) => sortingData('ASC', propsTH.column)}
							></i>
							<i
								key={`${propsTH.index}_down`}
								className={
									'bx bxs-down-arrow cursor-pointer text-xs ' +
									(cellSorting.up && cellSorting._keyCol === propsTH.column._key
										? 'text-white'
										: '')
								}
								onClick={(_) => sortingData('DESC', propsTH.column)}
							></i>
						</div>
					)}
				</div>
			</th>
		)
	}

	const TablaHeader = (propsTHEAD: ITablaHeaderProps) => {
		let parseColumns: any[] = []
		let fixed: CSSProperties = {}
		for (let _col of propsTHEAD.columns || []) {
			if (_col.hideColumn) continue
			parseColumns.push(_col)
		}

		return (
			<thead
				className={'w-full bg-blue-600 rounded-sm '}
				style={{ ...fixed }}
			>
				<tr>
					{parseColumns.map((th, i) => {
						return (
							<TablaTH
								isFinalCol={i + 1 == parseColumns.length}
								column={th}
								key={`${th}_${i}`}
								index={i}
								showAll={props?.showAll}
							/>
						)
					})}
				</tr>
			</thead>
		)
	}

	useEffect(() => {
		let change = false
		if (props.columns.length !== THIS._columns.length) {
			THIS._columns = props.columns
			change = true
		}
		if (props.columnsDetail?.length !== THIS._columnsDetail?.length) {
			THIS._columnsDetail = props.columnsDetail
			change = true
		}
		if (props.data.length) {
			THIS._data = props.data
			THIS._dataAll = [...props.data]
			change = true
		}
		if (change) {
			preparseData()
		}
	}, [props.columns, props.data, currentPage])

	if (props?.onGenerateExcel) {
		props.onGenerateExcel(generateExcel)
	}

	const renderTableBody = () => {
		if (props.data.length === 0) {
			return (
				<tbody>
					<tr className="border-collapse border rounded-md border-gray-300  hover:bg-app-50 ">
						<td
							className="text-center py-1.5  text-blue-gray-400 font-medium text-md"
							colSpan={props.columns.length}
						>
							{'No hay registros...'}
						</td>
					</tr>
				</tbody>
			)
		} else {
			return (
				<TBody
					dataMap={rowsTable}
					dataDetMap={rowsTableDet}
					overflow={props.propsBody}
					data={fullData}
					onClickRow={props?.onClickRow}
					selected={props.selected}
					columnsMap={THIS.columnsMap}
					columnsDetMap={THIS.columnsDetMap}
					nroColumns={THIS._columns.length}
					nroRows={THIS._data.length || 0}
					emptyMessage={'Sin Registros ...'}
					nroColumnsDetail={THIS._columnsDetail?.length}
					columnsDetail={THIS._columnsDetail}
					keyDet={props?.keyDet}
					noPaddingNoMargen={props.noPaddingNoMargen ? true : false}
				/>
			)
		}
	}

	const contentTable = () => {
		return (
			<Fragment>
				<div className="flex justify-between">
					<div className="flex items-center">
						{props.showLengthItems && (
							<LengthItems
								length={lengthItems}
								setLength={(value: number) => {
									setLengthItems(value)
								}}
							/>
						)}
					</div>
					<div className="flex items-center">
						{props.manageColumns && <ManageColumns columns={props.columns} />}
					</div>
				</div>
				<div
					className="relative"
					style={{ overflowX: 'auto' }}
				>
					<table className="w-full ">
						<TablaHeader columns={props.columns || []} />
						{renderTableBody()}
						<TablaFooter />
					</table>
				</div>
				{!props.showAll && (
					<Paginacion
						currentPage={currentPage}
						prevCurrentPage={THIS.prevCurrentPage}
						lengthItems={THIS.itemsPerPage}
						initItem={THIS.initIndex}
						hideLabel={props?.hideLblPagination}
						finItem={THIS.finIndex}
						setState={(state) => {
							THIS.prevCurrentPage = state.prevCurrentPage
							setCurrentPage(state.currentPage)
						}}
						data={THIS._dataAll}
					/>
				)}
			</Fragment>
		)
	}

	return (
		<Fragment>
			<div
				style={{
					height: props?.showAll ? props?.heightShowAll || '500px' : undefined,
				}}
			>
				<Card02 class="">{contentTable()}</Card02>
			</div>
		</Fragment>
	)
}

interface ITBody {
	nroColumns: number
	dataMap: Map<any, any[]>
	dataDetMap: Map<any, any[]>
	columnsMap: Map<string, IColumnsTabla>
	columnsDetMap: Map<string, IColumnsTabla>
	emptyMessage?: string
	nroRows: number
	data: any[]
	overflow?: IPropsBody
	selected?: any
	onClickRow?: (row: any) => void
	nroColumnsDetail: number
	columnsDetail: IColumnsTabla[]
	keyDet: string
	noPaddingNoMargen: boolean
}

const TBody = ({
	nroColumns,
	emptyMessage,
	dataMap,
	dataDetMap,
	nroRows,
	data,
	columnsMap,
	columnsDetMap,
	overflow,
	selected,
	onClickRow,
	columnsDetail,
	keyDet,
	noPaddingNoMargen,
}: ITBody) => {
	const _keys = [...(dataMap.keys() || [])]
	const _keysDet = [...(dataDetMap.keys() || [])]
	let empty = nroRows === 0
	let dataParsed: any[][] = []
	let dataParsedDet: any[][] = []
	let indexSelected: number
	const _data = [...data]
	if (_data || data.length) {
		for (let i = 0; i < nroRows; i++) {
			let _reg = _data[i]

			if (selected) {
				const activeSelected = selected && _reg == selected
				if (activeSelected) indexSelected = i
			}

			let _parsedReg = [] as any[]
			for (let _key of _keys) {
				const _vl = _reg[_key]
				_parsedReg.push(_vl)
			}
			if (_reg && 'id_more_detail' in _reg) {
				// ! parsear datos para sub detalle
				const _arrDetParse = [] as any[]
				let _parsedRegDet = [] as any[]
				for (let _key of _keysDet) {
					const _vl = _reg[_key]
					_parsedRegDet.push(_vl)
				}
				_arrDetParse.push(_parsedRegDet)
				dataParsed.push({ ..._reg, moreDetailArray: _arrDetParse })
			} else dataParsed.push(_parsedReg)

			const _arrDetParse = [] as any[]
			const _dataDet = _reg?.[keyDet]
			for (let i = 0; i < _dataDet?.length; i++) {
				let _regDet = _dataDet[i]

				let _parsedRegDet = [] as any[]
				for (let _key of _keysDet) {
					const _vl = _regDet[_key]
					_parsedRegDet.push(_vl)
				}
				_arrDetParse.push(_parsedRegDet)
			}
			dataParsedDet.push(_arrDetParse)
		}
	}

	const _column = (indexCol: number) => {
		const _keyFind = _keys[indexCol]
		return columnsMap.get(_keyFind)
	}
	const _columnDet = (indexCol: number) => {
		const _keyFind = _keysDet[indexCol]
		return columnsDetMap.get(_keyFind)
	}

	const [openIndexes, setOpenIndexes] = useState(new Set())

	const toggleDetail = (index: number) => {
		const newOpenIndexes = new Set(openIndexes)
		if (newOpenIndexes.has(index)) {
			newOpenIndexes.delete(index)
		} else {
			newOpenIndexes.add(index)
		}
		setOpenIndexes(newOpenIndexes)
	}
	let newK = 0
	return (
		<tbody style={{ overflowY: overflow?.overflow ? 'auto' : 'initial' }}>
			{empty && (
				<tr className="border-collapse border rounded-md border-gray-300  hover:bg-app-50 ">
					<td
						className="text-center py-1.5 text-blue-gray-400 font-medium text-md"
						colSpan={nroColumns}
					>
						{emptyMessage || 'Sin registros'}
					</td>
				</tr>
			)}
			{!empty && (
				<>
					{dataParsed.map((_row: any, k) => {
						if (Array.isArray(_row)) newK++
						return (
							<>
								{Array.isArray(_row) ? (
									<tr
										key={k}
										className={
											'border-collapse border ' +
											(indexSelected == k ? ' bg-light-blue-300 ' : ' ') +
											' rounded-md border-gray-300 hover:cursor-pointer hover:bg-app-50 ' +
											((newK + 1) % 2 == 0 ? 'bg-gray-200' : '')
										}
										onClick={() => {
											if (onClickRow) onClickRow(_data[k])
										}}
									>
										{_row.map((_cell, index) => {
											let col = _column(index)
											return (
												<td
													key={`${k}_${index}`}
													className={
														'text-left  text-blue-gray-400 font-medium text-md ' +
														(noPaddingNoMargen ? '' : 'py-1.5 pl-1.5') +
														(col?.classHeader || col?.classHeader)
													}
													style={col?.cssHeader || col?.css}
												>
													{!col?.render && (
														<div className="w-full flex items-center">
															{_cell || ''}
														</div>
													)}
													{col?.render &&
														col.render(_cell, _data[k], k, toggleDetail)}
												</td>
											)
										})}
									</tr>
								) : (
									<tr
										className={
											'border-collapse border ' +
											(indexSelected == k ? ' bg-light-blue-300 ' : ' ') +
											' rounded-md border-gray-300 hover:cursor-pointer hover:bg-app-50 bg-gray-400'
										}
									>
										<td
											colSpan={nroColumns}
											className="p-0"
										>
											<table className="w-full">
												{/* <TablaHeader
													columns={columnsDetail}
													isFixed={true}
												/> */}
												{(_row?.moreDetailArray || []).map((_row, k) => {
													return (
														<tr key={k}>
															{_row.map((_cell, index) => {
																let colDet = _columnDet(index)
																return (
																	<td
																		key={`${k}_${index}`}
																		className={
																			'text-left py-1.5 pl-1.5 text-blue-gray-400 font-medium text-md ' +
																			(colDet?.classHeader ||
																				colDet?.classHeader)
																		}
																		style={colDet?.cssHeader || colDet?.css}
																	>
																		{!colDet?.render && (
																			<div className="w-full flex items-center">
																				{_cell || ''}
																			</div>
																		)}
																		{colDet?.render &&
																			colDet.render(_cell, _data[k], k)}
																	</td>
																)
															})}
														</tr>
													)
												})}
											</table>
										</td>
									</tr>
								)}
								{openIndexes.has(k) && (
									<tr
										className={
											'border-collapse border ' +
											(indexSelected == k ? ' bg-light-blue-300 ' : ' ') +
											' rounded-md border-gray-300 hover:cursor-pointer hover:bg-app-50 '
										}
									>
										<td
											colSpan={nroColumns}
											className="p-0"
										>
											<table className="w-full">
												<TablaHeader
													columns={columnsDetail}
													isFixed={true}
												/>
												{dataParsedDet[k].map((_row, k) => {
													return (
														<tr key={k}>
															{_row.map((_cell, index) => {
																let colDet = _columnDet(index)
																return (
																	<td
																		key={`${k}_${index}`}
																		className={
																			'text-left py-1.5 pl-1.5 text-blue-gray-400 font-medium text-md ' +
																			(colDet?.classHeader ||
																				colDet?.classHeader)
																		}
																		style={colDet?.cssHeader || colDet?.css}
																	>
																		{!colDet?.render && (
																			<div className="w-full flex items-center">
																				{_cell || ''}
																			</div>
																		)}
																		{colDet?.render &&
																			colDet.render(_cell, _data[k], k)}
																	</td>
																)
															})}
														</tr>
													)
												})}
											</table>
										</td>
									</tr>
								)}
							</>
						)
					})}
				</>
			)}
		</tbody>
	)
}

const TablaHeader = (propsTHEAD: ITablaHeaderProps) => {
	let parseColumns: any[] = []
	for (let _col of propsTHEAD.columns || []) {
		if (_col.hideColumn) continue
		parseColumns.push(_col)
	}

	return (
		<tr className={'w-full bg-cyan-500'}>
			{parseColumns.map((th, i) => {
				return (
					<TablaTH
						isFinalCol={i + 1 == parseColumns.length}
						column={th}
						key={`${th}_${i}`}
						index={i}
						showAll={true}
					/>
				)
			})}
		</tr>
	)
}

const TablaTH = (propsTH: ITablaTHprops) => {
	return (
		<th
			className={
				`px-1.5 py-1 ` +
				'text-left font-bold dark:bg-transparent dark:border-r-transparent ' +
				' border-b border-b-gray-400 dark:border-b dark:border-b-blue-500 ' +
				' dark:text-brown-50 ' +
				(propsTH.column?.classHeader || propsTH.column?.classHeader)
			}
			style={propsTH.column?.cssHeader || propsTH.column?.css}
			key={`${propsTH.index}_${Date.now()}`}
		>
			<div className="flex justify-between  items-center w-full ">
				<div className="text-white dark:text-white w-full">
					{propsTH.column.label &&
						!propsTH.column?.setColumnHeader &&
						!propsTH.isFinalCol && (
							<label className="text-white">{propsTH.column.label}</label>
						)}
					{propsTH.column?.setColumnHeader && propsTH.column.setColumnHeader()}
				</div>
			</div>
		</th>
	)
}

interface ITablaHeaderProps {
	columns: IColumnsTabla[]
	isFixed?: boolean
}

interface ITablaTHprops {
	column: IColumnsTabla
	index: number
	isFinalCol: boolean
	showAll: boolean
}

const TablaFooter = () => {
	return <tfoot></tfoot>
}

interface IModalExcel {
	onClose?: (closed?: boolean) => void
	columnsMap: Map<string, IColumnsTabla>
	columns: IColumnsTabla[]
	getRegistros: (regs: any[]) => void
}

export const ModalExcelImport = (props: IModalExcel) => {
	const inputeRef = useRef(null)
	const [registros, setRegistros] = useState([])
	const [archivoCargado, setArchivoCargado] = useState(false)
	const [columns, setColumns] = useState(
		[...props.columnsMap.values()].filter((x) => !x.excel?.exclude)
	)

	const [showModal, setShowModal] = useState(true)
	const [THIS] = useState(() => {
		const fileName = ''
		return {
			fileName,
		}
	})

	const parseExcelInput = (workbook) => {
		const ws = workbook.worksheets[0]
		const excelHelper = new Excel({ workSheet: ws, idxHeader: 1 })
		const columns = [...props.columnsMap.values()].filter(
			(x) => !x.excel?.exclude
		)

		for (let i = 0; i < columns.length; i++) {
			const _col = columns[i]
			_col.label = StringHelper.normalizeString(_col.label)
		}

		const getCell = excelHelper.getCellByCol
		const registrosAImportar = []
		for (let index = 2; index <= ws.rowCount; index++) {
			const row = ws.getRow(index)
			let obj: any = {}
			try {
				for (let _col of columns) {
					const value = getCell(row, _col.label)
					if ((value + '').length > 0) {
						obj[_col._key] = value
					}
				}
				registrosAImportar.push(obj)
			} catch (error) {
				console.log(error)
			}
		}

		return registrosAImportar
	}
	const handleInputFile = (file: any) => {
		const nameFile = file.name
		const ext = nameFile.split('.')[1]
		THIS.fileName = nameFile
		if (ext == 'xlsx' || ext == 'xls') {
			const workbook = new ExcelJS.Workbook() as any
			const reader = new FileReader()
			reader.readAsArrayBuffer(file)
			setArchivoCargado(true)
			reader.onload = () => {
				workbook.xlsx
					.load(reader.result)
					.then((workbook) => {
						let parsedRows
						try {
							// console.log('excel cargado::', workbook.worksheets[0])
							parsedRows = parseExcelInput(workbook)
							setRegistros(parsedRows)
						} catch (error) {
							console.log(error)
						}
					})
					.catch((error) => {
						console.log(error)
					})
			}
		} else {
			NotificacionUtils.error('El formato a importar es incorrecto')
		}
	}

	const handleCancelImport = () => {
		inputeRef.current.value = null
		THIS.fileName = ''
		setArchivoCargado(false)
		setRegistros([])
	}
	return (
		<>
			<Modal
				show={showModal}
				setHeader={() => (
					<>
						<div className="justify-between flex w-full">
							<div className="flex items-center">
								<label className="">
									Registros importados: {registros.length}
								</label>
							</div>
							<div className="flex">
								<div className="">
									{!archivoCargado && (
										<Button2
											success
											outline
											onClick={() => {
												const input = inputeRef.current as HTMLInputElement
												input.click()
											}}
										>
											Importar Datos &nbsp;
											<span className="fa fa-upload"></span>
										</Button2>
									)}
									{archivoCargado && (
										<div className="flex">
											<Label2
												label={THIS.fileName}
												iconCancel
												handleIconCancel={() => {
													handleCancelImport()
												}}
											/>
											&nbsp;
											<Button2
												text="Guardar"
												disabled={!registros.length}
												size="xs"
												iconRight="fa fa-save"
												primary
												class="bg-purple-500"
												onClick={() => {
													if (props.getRegistros) props.getRegistros(registros)
													if (props.onClose) props.onClose(true)
												}}
											></Button2>
										</div>
									)}
									<input
										type="file"
										onChange={(ev) => {
											const { target } = ev
											const files = target.files
											handleInputFile(files[0])
										}}
										className="hidden"
										ref={inputeRef}
									/>
								</div>
								<Button2
									secondary
									size="sm"
									onClick={() => {
										setShowModal(false)
										setArchivoCargado(false)
										setRegistros([])
										props.onClose(true)
									}}
								>
									<span className="fa fa-times"></span>
								</Button2>
							</div>
						</div>
					</>
				)}
			>
				<>
					<div className="">
						<TableReport
							data={registros}
							columns={columns}
							class={'bordered responsive'}
						></TableReport>
					</div>
				</>
			</Modal>
		</>
	)
}
