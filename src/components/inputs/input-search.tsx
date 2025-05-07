import React from "react"


interface IPropsInputSearch {
   onBlur: (value: string) => void
}

 const InputSearch = React.memo((props: IPropsInputSearch) => {
   const handleOnBlur = (e: any) => {
       const value = e.target.value
       if (props.onBlur) props.onBlur(value)
   }
   return <input className="search-input border border-solid
    border-gray-600 pl-2 rounded"
       placeholder="Buscar"
       style={{ padding: '0.38rem 0.45rem' }}
       onBlur={(e) => handleOnBlur(e)}
   />
})

export default InputSearch