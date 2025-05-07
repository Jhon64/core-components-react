export namespace ValidadoresHelper{
  export const validNumber=(value:number)=>value>=0
  export const isEmpty=(value:string)=>!value.trim().length
  export const isValidValue=(value?:any)=>{
    if(typeof  value === "string"){
      if(ValidadoresHelper.isEmpty(value))return false
    }
    if(typeof value ==="number" ){
      if(!ValidadoresHelper.validNumber(value))return false
    }
    return !!value;
  }
}


export default ValidadoresHelper