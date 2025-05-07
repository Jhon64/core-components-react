import React from "react"
interface IPropsCheckbox2{
 onChange?: (value?: boolean) => void
 checked?:(()=>boolean)|boolean
 class?:string
 _key?:any
}



 const CheckBox2 = (props:IPropsCheckbox2) => {
 const onchangeHandle = (evt: React.ChangeEvent<HTMLInputElement>) => {
  const value=evt.target.checked
  if (props.onChange) {
   props.onChange(value)
  }
 }
 return <>
  <input key={props._key} type='checkbox' className={"cursor-pointer w-5 h-5 "+(props.class)}
   checked={typeof props.checked=='function'?props.checked():props.checked}
   onChange={(e) => onchangeHandle(e)} />
 </>
}

export default CheckBox2