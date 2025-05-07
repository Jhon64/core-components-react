
interface IContainerProps{
  children?:JSX.Element
  class?:string
}

export const Container = (props: IContainerProps)=>{
 return <div className={"px-2 py-1 "+(props.class)}>
  { props.children}
 </div>
}