
import { OperacionType } from '../models/types/operation-type'
import { ArrayToHelper } from './array-to.helper'

export namespace SavedRegisterHelper {
	export const procesoGuardar = (
		operacion: OperacionType,
		form: any,
		registros: any[],
		registrosMap: Map<string, any>,
		_id?: string
	) => {
		form._pending = true
		if (operacion == 'DEL') {
			const findIndex = registros.findIndex(
				(x) =>
					(x._id && x._id == _id) ||
					(x._id && x._id == form._id) ||
					(x.tempID && x.tempID == form.tempID)
			)
			const objectValue = registrosMap.get(_id)
			if (!objectValue) {
				//* es un registro nuevo
				registros.splice(findIndex, 1)
			} else {
				form.status = false
				form.isDeleted = true
				Object.assign(objectValue, form)
				registros[findIndex] = objectValue
			}
		}
		if (operacion == 'EDIT') {
			const findIndex = registros.findIndex(
				(x) =>
					(x._id && x._id == form._id) || (x.tempID && x.tempID == form.tempID)
			)
			const objectValue =
				registros.find(
					(x) =>
						(x._id && x._id == form._id) ||
						(x.tempID && x.tempID == form.tempID)
				) || {}

			Object.assign(objectValue, form)
			registros[findIndex] = objectValue
		}

		if (operacion == 'ADD') {
			form.tempID = Date.now()
			form.status = true
			registros.unshift(form)
		}

		return [...registros]
	}
	export const MergeProcesoGuardar = (
		registros: any[],
		registrosUpdated: any[]
	) => {
		let mergeRegs = []
		const registrosUpdatedMap = ArrayToHelper._Map<any>(registrosUpdated, '_id')
		for (let regis of registros) {
			//editando o eliminando
         if(!regis._id)continue//esto sucede si es un registro nuevo
         
			if (registrosUpdatedMap.has(regis._id)) {
            const regEvalu=registrosUpdatedMap.get(regis._id)
            
				//revisar si esta eliminado, no se inserta en el array merged
				if (regEvalu?.isDeleted) {
					registrosUpdatedMap.delete(regis._id)
					continue
				}
				mergeRegs.push(regEvalu)
				registrosUpdatedMap.delete(regis._id) //eliminado del mapa de nuevos datos
			}else{
            mergeRegs.push(regis)
         }
		}
		//los que quedan en el mapa son registros nuevos
		if (registrosUpdatedMap.size > 0) {
			mergeRegs = mergeRegs.concat([...registrosUpdatedMap.values()])
		}
		//revisar si en los datos obtenidos hay registros con IDs nuevos
		
		return mergeRegs
	}
}
