import * as ExcelJS from 'exceljs/dist/exceljs.min.js'
import { saveAs } from 'file-saver'
import { StringHelper } from './string.helper'
import { GlobalHelper } from './global.helpers'
interface ISheet {
	name: string
	options?: Partial<ExcelJS.Worksheet>
}

interface ICreateSheet {
	name: string
	title: string
	columns: any[]
}

interface IListOptionsExcel{
	title:string
	value:any
	row:number
	col:number
}

export interface IExcel {
	initCol?: number
	columns?: IColumnType[]
	title?: string
	company?: string
	creator?: string
	created?: Date
	modified?: Date
	sheet?: ISheet
	sheets?: string[]
	idxHeader?: number
	generateFree?: any
	rowCellMergeHeader?: number
	workSheet?: ExcelJS.Worksheet

	optionsHeaderReport?:{
		useReport?:boolean
		configTitle?:{
			row?:number
			col?:number
			setTitle?:string
			cellMerged?:number
		}
		listaDetails?:IListOptionsExcel[]
	}
}

interface IColumnExcel {
	label?: string
	key: string
	colWidth?: string
	style?: any
	idx?: number
	width?: number
	propsExcel?: {
		excludeCell?: boolean //excluir al generar el excel
		width?: number
		height?: number
		label?: string
		isColumDetalle?: boolean
		isHeaderExcel?: boolean
		rows?: number //para combinar las celdas
		isDate?: boolean /**este parametro para cuando la cell sea de tipo fecha */
		dataValidation?: () => string[]
		isText?: boolean

		setCell?: (value, row?, index?) => any
	}
}
interface IColumnSubocolExcel extends IColumnExcel {
	idx?: number
}
export interface IColumnType extends IColumnExcel {
	subcolumns?: IColumnSubocolExcel[]
}

export class Excel {
	private _workbook: ExcelJS.Workbook
	private columns: IColumnType[]
	private columnsMap: Map<any, IColumnType> = new Map()

	columMap: Map<string, number> = new Map()
	columMergedMap: Map<string, number> = new Map()
	columIdxNameMap: Map<number, string> = new Map()
	private sheetsNames?: string[]
	private sheet?: ExcelJS.Worksheet
	columnIdxToListaMap = new Map()
	sheetMap: Map<number, any> = new Map()

	private _thisProps: IExcel
	generateFree: any
	constructor(props: IExcel) {
		this._thisProps = props
		this.columns = [...(props.columns || [])]
		this._workbook = new ExcelJS.Workbook()
		this._workbook.title = props.title
		this._workbook.company = props.company || 'Grupo Rocio'
		this._workbook.creator = props.creator || 'Grupo Rocio'
		this._workbook.created = props.created || new Date()
		this._workbook.modified = props.modified || new Date()
		this.generateFree = props.generateFree || function() {}

		this.Workbook()

		if (props.sheet) {
			this.addWorkSheet(props.sheet.name, props.sheet.options || {})
		}
		if (props.workSheet) {
			let indexHeader = props.idxHeader || 1
			const ws = props.workSheet

			this.sheet = ws
			const columnsLength = ws.columnCount
			const rowHeader = ws.getRow(indexHeader)
			for (let i = 1; i <= columnsLength; i++) {
				const cellHeader = rowHeader.getCell(i)
				const value = (cellHeader.value as string) || ''
				if (value) {
					const nameN = StringHelper.normalizeString(value)
					if (!this.columMap.has(nameN)) {
						this.columMap.set(nameN, i)
						this.columIdxNameMap.set(i, nameN)
					}
				}
			}
		}
	}
	getHeaderIndex() {
		return this._thisProps.idxHeader || 1
	}
	columnsExcel() {
		return [...this.columns]
	}
	columnsMapExcel() {
		return this.columnsMap
	}

	Workbook(properties?: Partial<ExcelJS.WorkbookModel>) {
		if (properties) {
			if (properties.creator) this._workbook.creator = properties.creator
			if (properties.title) this._workbook.title = properties.title
			if (properties.lastModifiedBy)
				this._workbook.lastModifiedBy = properties.lastModifiedBy
			if (properties.created) this._workbook.created = properties.created
			if (properties.modified) this._workbook.modified = properties.modified
			if (properties.lastPrinted)
				this._workbook.lastPrinted = properties.lastPrinted
			if (properties.description)
				this._workbook.description = properties.description
			if (properties.company) this._workbook.company = properties.company
		}

		return this._workbook
	}
	addWorkSheet(name: string, properties?: Partial<ExcelJS.Worksheet>) {
		const sheet = this._workbook.addWorksheet(name, properties)
		let idx = 1
		let j = 0
		for (let _col of this.columns || []) {
			if (_col?.propsExcel?.excludeCell) {
				this.columns.splice(j, 1)
				continue
			}
			if (_col.subcolumns) {
				let i = 0
				for (let _subCol of _col.subcolumns) {
					if (_subCol?.propsExcel?.excludeCell) {
						_col.subcolumns.splice(i, 1)
						continue
					}
					_subCol.idx = idx
					idx++
					i++
				}
			}
			_col.idx = idx
			this.columnsMap.set(_col.key, _col)
			idx++
			j++
		}

		let sheetColumns = []

		for (let col of this.columns) {
			let parseCol: any = col
			if (col?.propsExcel?.label) {
				parseCol = { ...col, header: col.propsExcel.label }
			} else {
				parseCol = { ...col, header: col.label }
			}
			if (col?.propsExcel?.isDate) {
				parseCol = { ...parseCol, style: { numFmt: 'dd/mm/yyyy' } }
			}
			sheetColumns.push(parseCol)
		}
		//generamos las cabeceras del excel tabla
	
		let indexHeaderInit= this._thisProps.idxHeader || 1
		for(let col of this.columns){
			const row = sheet.getRow(indexHeaderInit)
			const useMerged=this._thisProps?.rowCellMergeHeader
			if(useMerged){
				let endRow=useMerged+indexHeaderInit-1
				sheet.mergeCells(indexHeaderInit, col.idx, endRow, col.idx )
				row.getCell(col.idx).style = this.getCssHeaderCell()
				row.getCell(col.idx).alignment = { vertical: 'middle', };
				const cell = row.getCell(col.idx)
				cell.value = col.label
			
			}else{
				const cell = row.getCell(col.idx)
				cell.value = col.label
			}
		
		}

		//generamos las opciones y el title {}
		const mitad=Math.ceil(this.columns.length/2)-1;
		// let newHeader=indexHeaderInit-4
		let newHeader = 2
		let isValid=(newHeader)>0
		if(isValid && this._thisProps?.optionsHeaderReport?.useReport){
					const row = sheet.getRow(newHeader)
					sheet.mergeCells(newHeader, mitad, newHeader+1, mitad+2 )
					row.getCell(mitad).alignment = { vertical: 'middle', horizontal: 'center'};
					row.getCell(mitad).value = this._thisProps.title;
		}

		this.sheet = sheet
		this.generateHeaderExcel()
		this.generateFree(this.sheet)
	}

	private getCssHeaderCell(style?: any): Partial<ExcelJS.Style> {
		return {
			alignment: { horizontal: 'center', vertical: 'middle' },
			fill: {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'C0C0C0FF' },
			},
			border: {
				bottom: { style: 'thin' },
				left: { style: 'thin' },
				top: { style: 'thin' },
				right: { style: 'thin' },
			},
			...style,
		}
	}
	getCellByCol = (row: any, columnName: string | number, isFecha?: boolean) => {
		const idx =
			typeof columnName === 'number'
				? columnName
				: this.columMap.get(columnName) || this.columMergedMap.get(columnName)

		if (!idx) return undefined

		const cell = row.getCell(idx)

		if (!cell || cell.value === null) return undefined
		else if (typeof cell.value === 'object') {
			return cell.value.result
		} else {
			if (isFecha && typeof cell.value === 'number') {
				if (cell.value && cell.value < 100000) {
					cell.value = cell.value - 25569 // Fecha Excel to Fecha Unix
				}
			}
			return cell.value
		}
	}

	private generateHeaderExcel() {
		const columns = this.columns || []
		let cssCell = {}
		const initHeader = this?._thisProps.idxHeader || 1
		const sheet = this.sheet
		let i = 1
		if (!sheet) return
		for (let col of columns) {
			let mergedCells = 0
			if (col?.subcolumns?.length) {
				mergedCells = col.subcolumns.length - 1
				let initIdx = col.subcolumns[0].idx || 0

				sheet.mergeCells(initHeader, 1, initIdx, initIdx + mergedCells)
				for (let _sub of col.subcolumns || []) {
					const getCell = this.getCellOfRow(2, _sub?.idx || 0)
					if (!getCell) continue
					getCell.value = _sub.label
					sheet.getColumn(_sub?.idx || 0).key = _sub.key
					sheet.getCell(2, _sub.idx).style = this.getCssHeaderCell(_sub.style)
					if (_sub?.propsExcel?.width) {
						sheet.getColumn(_sub?.idx || 0).width = _sub?.propsExcel?.width
					}
					//   if (_sub?.propsExcel?.height) {
					//     sheet.getColumn(_sub?.idx || 0).height = _sub?.propsExcel?.height;
					//   }
				}
			} else {
				sheet.getCell(initHeader, i).style = this.getCssHeaderCell(col.style)
				if (col?.propsExcel?.width) {
					sheet.getColumn(i).width = col?.propsExcel?.width
					sheet.getColumn(i).key = col.key
				}else{
					const PIXELS_PER_EXCEL_WIDTH_UNIT = 7.5
					sheet.getColumn(i).width = (col?.label||'').length + 5
				}
				// if (col?.propsExcel?.height) {
				//   sheet.getColumn(i).height = col?.propsExcel?.height;
				//   sheet.getColumn(i).height = col.key;
				// }
			}

			i++
		}
	}
	createNewSheet(props: ICreateSheet): ExcelJS.Sheet {
		const sheet = this._workbook.addWorksheet(props.name)

		this.sheetMap.set(sheet.key, sheet)
		return sheet
	}
	/**Mostrar la informacion de una lista en un excel mapeado por keys de columnas */
	displayData(data: any[]) {
		const headerColumns = [...this.columns]
		let listaColN = 1
		for (let col of headerColumns) {
			if (!col?.propsExcel?.dataValidation) continue
			const values = col?.propsExcel?.dataValidation()

			if (!this.sheetMap.has(-1)) {
				const sheet2 = this.createNewSheet({
					name: 'listas',
					title: 'LISTAS',
					columns: [],
				})
				sheet2.state = 'hidden' //ocultamos la hoja de
				this.sheetMap.set(-1, sheet2)
			}
			const sheet = this.sheetMap.get(-1)
			const row2 = sheet.getRow(1)
			row2.getCell(listaColN).value = col.label //nombre de la cabecera de la hoja para validacion
			for (let i = 0; i < values.length; i++) {
				const row = sheet.getRow(i + 2)
				const cell = row.getCell(listaColN)
				cell.value = values[i]
			}

			const letter = GlobalHelper.charLetters[listaColN]
			this.columnIdxToListaMap.set(col.idx, {
				colN: listaColN,
				listaColN,
				letter,
				len: values.length,
				formulae: `listas!$${letter}$2:$${letter}$${values.length + 1}`,
			})
			listaColN++
		}

		let rowN = this._thisProps?.initCol || 1 + 1  //inicia de la columna 2 a mostrar los datos
		let listaColK = 1
		for (let col of headerColumns) {
			//lenamos todos los valores en todo el excel

			const letter = GlobalHelper.charLetters[listaColK]
			if (this.columnIdxToListaMap.has(col.idx)) {
				this.sheet.dataValidations.add(`${letter}2:${letter}9999`, {
					type: 'list',
					allowBlank: true,
					showErrorMessage: true,
					error: 'El valor ingresado no es válido',
					formulae: [this.columnIdxToListaMap.get(col.idx).formulae],
				})
			}
			listaColK++
		}

		for (let record of data) {
			const row = this.sheet.getRow(rowN)

			for (let col of headerColumns) {
				const cell = row.getCell(col.idx)
				cell.value = col.key ? record[col.key] : null
			}
			rowN++
		}
	}

	getRow(idxRow: number) {
		return this.sheet.getRow(idxRow)
	}
	getCellOfRow(rowIdx: number, cellIdx: number) {
		return this.sheet.getRow(rowIdx).getCell(cellIdx)
	}
	getCellIdx(row: ExcelJS.Row, idx: number) {
		return row.getCell(idx)
	}
	getSheet() {
		return this.sheet
	}
	removeSheet(sheet: ExcelJS.Worksheet) {
		if (!sheet.id) {
			console.warn('sin id de worksheet' + sheet)
			return
		}
		this._workbook.removeWorksheet(sheet.id)
	}
	download(fileName: string) {
		const blobType =
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		this._workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], { type: blobType })
			saveAs(blob, fileName)
		})
	}
}
