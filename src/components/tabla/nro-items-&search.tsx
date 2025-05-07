import { ChangeEvent, Component, Fragment, ReactNode } from "react";

import Select2  from "../selects";



interface IPropsLengthItems {
 length: number
 setLength: (value: number) => void
}

interface IStateLengthItems {
 length: number
 listNumbers: { id: number, name: string | number }[]
}

export class LengthItems extends Component<IPropsLengthItems,
 IStateLengthItems>{
 constructor(props: IPropsLengthItems) {
  super(props)
  this.state = {
   length: props.length,
   listNumbers: [
    { id: 10, name: 10 },
    { id: 25, name: 25 },
    { id: 50, name: 50 },
    { id: 100, name: 100 },
    { id: -100, name: 'all' }
   ]
  }
 }

 render(): ReactNode {
  const state = this.state
  return <Fragment>
   <div className="pb-1">
    <label className="dark:text-white">
     Mostrar&nbsp;<Select2 classSelect="w-16 dark:text-black" options={() => { return state.listNumbers }}
      onSelect={({ id, name }) => {
       if (this.props.setLength) this.props.setLength(id)
       this.setState({ length: id })
      }} />&nbsp;
     Entradas
    </label>
   </div>
  </Fragment>
 }
}


interface IPropSearchTable {
//  ctx: Tabla
}

interface IstateSearch {
 search: string
}
// export class SearchTable extends Component<IPropSearchTable, IstateSearch>{
//  constructor(props: IPropSearchTable) {
//   super(props)
//   this.state = {
//    search: ''
//   }
//  }

//  filtrarInformacion(search: string) {
//   const dataParseada = { ...this.props.ctx.state.dataParseada }
//   const rows = dataParseada.rows
//   const bodyRows = rows.find(x => x.isBody == true)
//   const FilasParseadas = bodyRows?.rowsBody || []
//   const datosFiltrados = []
//   for (const row of FilasParseadas) {
  
//    const values = Object.values(row)||[]
//    const newValue = values.map(x => { return (x + '').toLowerCase().trim() })
//    const setSearch=search.toLowerCase().trim()
//    for (let col of newValue) {
//     if (col.includes(setSearch)) {
//      datosFiltrados.push(row);
//      break
//     }
//    }
//   }
//   console.log('datos filtrados::',datosFiltrados)
//   this.props.ctx.setState({
//    currentPage: 1, tempData: datosFiltrados,
//    initItem: 1,
//    finItem:1
//   })
//  }
//  render(): ReactNode {
//   return <Fragment>
//    <div className="">
//     <label className="dark:text-white">Buscar&nbsp;:&nbsp;</label>
//     <InputSearch onBlur={(value: string) => { this.filtrarInformacion(value) }} />
//    </div>
//   </Fragment>
//  }
// }