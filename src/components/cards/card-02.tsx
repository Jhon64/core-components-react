
import react,{Fragment} from "react";

interface ICard1Props{
  header?:JSX.Element
  children:JSX.Element
  footer?:JSX.Element
  headerClass?:string
  footerClass?:string
  headerCss?:react.CSSProperties
  footerCss?:react.CSSProperties
  styles?:react.CSSProperties
  class?:string
  title?:string
  textFooter?:string

}

export interface ICard01{
children:JSX.Element
class?:string
  styles?:react.CSSProperties
}
export const Card02=(props:ICard01)=>{
  return <Fragment>
     <div style={props?.styles} className={'border boder-1 p-1 border-b-gray-300 rounded-md shadow dark:bg-blue-gray-900 dark:border-purple-500 dark:border'
    +'dark:rounded-2xl ' +(props.class)}>
      {props.children}
    </div>
  </Fragment>
}
export const Card1=(props:ICard1Props):JSX.Element=>{
  return <Fragment>
    <div className={'border border-gray-300 border-solid '+props.class}
         style={props.styles? props.styles:{}}>
      {props?.title &&<div className={'pt-2.5  px-3 '+props.headerClass}  style={props.headerCss?props.headerCss:{}}>
        <h6 className={'font-medium mb-2'}>{props.title||'Header' }</h6>
        <hr className={'mb-0'}/> </div>
      }{ props?.header }
      <div className={'mt-1 p-3'}>
        {props.children}
      </div>

       {props?.textFooter &&<div className={'p-3 text-center '+props.footerClass}  style={props.footerCss?props.footerCss:{}}>
        <h6 className={'font-medium'}>{props?.textFooter||'Footer'}</h6>
        <hr/> </div>
      }{ props?.footer }

    </div>
  </Fragment>
}