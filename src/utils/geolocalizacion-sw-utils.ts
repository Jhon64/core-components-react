import { NotificacionUtils } from './notificacion-utils'

export interface ICoords {
	lat: number
	lng: number
}

interface GeolocalizacionSWProps{
	getPositonCallback?:(position:ICoords) => void
}

export class GeolocalizacionSW {
	private static _instance: GeolocalizacionSW
	private coords: ICoords
	private position:GeolocationPosition
	private positionError:GeolocationPositionError
	private getPositonCallback?:(position:ICoords) => void
	constructor(props?:GeolocalizacionSWProps) {
		this.validateServiceActiveInBrowser()
      this.coords={lat:0,lng:0}
		if(props.getPositonCallback) this.getPositonCallback=props.getPositonCallback
	}

	private validateServiceActiveInBrowser() {
      
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position)=>{
               this.position = position
               this.getCurrentPosition()
					if(this.getPositonCallback)this.getPositonCallback(this.coords)               
            },
				(errors)=>{
               this.positionError = errors
               this.manageErrors()
            }
			)
		} else {
			NotificacionUtils.warning(
				'La geolocalización no es compatible en este navegador.'
			)
		}
	}

	public static getInstance(props?:GeolocalizacionSWProps) {
     
		if (this._instance) {
			return this._instance
		} else {
			this._instance= new GeolocalizacionSW(props)
		}
      return this._instance
	}

	private manageErrors() {
		const error = this.positionError as any
		
		switch (error.code) {
			case error.PERMISSION_DENIED:
				NotificacionUtils.warning(
					'El usuario denegó la solicitud de geolocalización.'
				)
				break
			case error.POSITION_UNAVAILABLE:
				NotificacionUtils.warning(
					'La información de geolocalización no está disponible.'
				)
				break
			case error.TIMEOUT:
				NotificacionUtils.warning(
					'La solicitud para obtener la geolocalización del usuario ha caducado.'
				)
				break
			case error.UNKNOWN_ERROR:
				NotificacionUtils.warning(
					'Se produjo un error desconocido al intentar obtener la geolocalización.'
				)
				break
		}
	}

	//*callback para recibir la informacion desde el servicio de geolocalización
	private getCurrentPosition() {
		const posicion=this.position
		var latitud = posicion.coords.latitude
		var longitud = posicion.coords.longitude
		const coords: ICoords = { lat: latitud, lng: longitud }
		this.coords = coords
		
		
	}
}
