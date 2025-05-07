import { CSSProperties } from "react"

interface IPropsExcel{
  exclude?:boolean
  width?:number
  style?:any
  isText?:boolean
  isDate?:boolean
  setLabelExcel?:string
  setKeyExcel?:string
  setCell?:(value,row,index)=>any
}
export interface IColumnsTabla {
   _key: string
   label: string
   isLocal?: boolean
   render?: (value: any, row?: any, index?: number, openDetail?: any) => JSX.Element
   hiddenSearch?: boolean
   hiddenPaginacion?: boolean
   hiddenlenght?: boolean
   setColumnHeader?: () => JSX.Element | JSX.Element
   class?: string
   css?: CSSProperties
   classHeader?: string
   cssHeader?: CSSProperties
   hideColumn?: boolean
   //**Ordenamiendo de datos ASC OR DESC */
   sorting?:boolean
   excel?:IPropsExcel
 }
 
 export interface IPropsTabla {
   columns: IColumnsTabla[]
   columnsDetail?: IColumnsTabla[]
   data: any[]
   manageColumns?: boolean
   class?: string
   responsive01?: boolean
   groupKey?: string //* agrupa los datos de la datatable
   iconsExport?: 'excel' | 'pdf'[]
   importExcel?: boolean
   importExcelClick?: (ev?: any) => void
 }
 
 
 
 export interface IDataParseada {
   rows: IRowDataParseada[]
   class?: string
   css?: CSSProperties
 }
 
 export interface IRowDataParseada {
   class?: string
   cells?: IItemDataParseada[]
   rowsBody?: any[]
   css?: CSSProperties
   isBody?: boolean
   isHeaderTable?: boolean
   isFooter?: boolean
 }
 export interface IItemDataParseada {
   _key: string, value: any,
   class?: string
   css?: CSSProperties
   render?: (value: any, row?: any) => JSX.Element
   setColumnHeader?: () => JSX.Element | JSX.Element
   classHeader?: string
   cssHeader?: CSSProperties
   hideColumn?: boolean
 }
 
 