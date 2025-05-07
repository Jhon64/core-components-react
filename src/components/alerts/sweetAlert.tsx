import { memo } from "react";
import { Modal } from "../modal";


 const ConfirmDeleteAlert = memo(() => {
 return <>
  <Modal
   show={true} >
   <div>
    <div><h2 className='text-red-500 font-normal'>Eliminar Registros !!!</h2></div>
    <hr />
   </div>
  </Modal>
 </>
})

export default ConfirmDeleteAlert