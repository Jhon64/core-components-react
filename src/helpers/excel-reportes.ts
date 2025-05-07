import { IColumnType, IExcel } from "./excel.helper"
import * as ExcelJS from 'exceljs/dist/exceljs.min.js'
import { StringHelper } from "./string.helper"
import { saveAs } from 'file-saver'
export class ExcelReporte{

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
	constructor(props: IExcel) {
		this.columns = [...(props.columns || [])]
		this._workbook = new ExcelJS.Workbook()
		this._workbook.title = props.title
		this._workbook.company = props.company || 'Grupo Rocio'
		this._workbook.creator = props.creator || 'Grupo Rocio'
		this._workbook.created = props.created || new Date()
		this._workbook.modified = props.modified || new Date()
        this.Workbook();
		
        if (props.sheet) {
          this.addWorkSheet(props.sheet.name, props.sheet.options || {});
        }
    
		if (props.workSheet) {
			//*para cuando cargamos un excel
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
  getSheet() {
		return this.sheet
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
		sheet.columns = this.columns.map((x) => {
			return { ...x, header: x.label }
		})
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

		sheet.columns = sheetColumns
		this.sheet = sheet
		this.generateHeaderExcel()
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
  getRow(idxRow: number) {
		return this.sheet.getRow(idxRow)
	}
  getCellOfRow(rowIdx: number, cellIdx: number) {
		return this.sheet.getRow(rowIdx).getCell(cellIdx)
	}
  download(fileName: string) {
		const blobType =
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		this._workbook.xlsx.writeBuffer().then((data) => {
			const blob = new Blob([data], { type: blobType })
			// console.log('guardando archivo::')
			saveAs(blob, fileName)
		})
	}
  private generateHeaderExcel() {
		const columns = this.columns || []
		let cssCell = {}
    
		const sheet = this.sheet
		let i = 1
		if (!sheet) return
		for (let col of columns) {
			let mergedCells = 0
			if (col?.subcolumns?.length) {
				mergedCells = col.subcolumns.length - 1
				let initIdx = col.subcolumns[0].idx || 0

				sheet.mergeCells(1, 1, initIdx, initIdx + mergedCells)
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
				sheet.getCell(1, i).style = this.getCssHeaderCell(col.style)
				if (col?.propsExcel?.width) {
					sheet.getColumn(i).width = col?.propsExcel?.width
					sheet.getColumn(i).key = col.key
				}
				// if (col?.propsExcel?.height) {
				//   sheet.getColumn(i).height = col?.propsExcel?.height;
				//   sheet.getColumn(i).height = col.key;
				// }
			}

			i++
		}
	}
}