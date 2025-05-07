export namespace DateHelper {
	/**funcion para obtener un date por default o parseando la data*/
	export const date = (setDate?: string | number | Date) => {
		if (typeof setDate === 'string') {
			const parseDateArray = setDate.split('T')
			if (parseDateArray.length == 2) {
				return new Date(setDate)
			}
			console.warn('no se pudo convertir fecha', setDate)
			return
		}
		if (setDate instanceof Date) {
			return setDate
		}
		return new Date()
	}

	/**Tiempo en segundos*/
	export const dateNow = () => Date.now()

	/**convertir una fecha en un formato determinado*/
	export const parseIsoStringToFormat = (
		format: number,
		date?: string | number | Date
	) => {
		if (!date) return
		
		const fecha = DateHelper.date(date)
		if (!fecha) return

		let HH =
			fecha.getHours() < 10 ? `0${fecha.getHours()}` : String(fecha.getHours())
		let DD =
			fecha.getDate() < 10 ? `0${fecha.getDate()}` : String(fecha.getDate())
		let MM =
			fecha.getMonth() + 1 < 10
				? `0${fecha.getMonth() + 1}`
				: String(fecha.getMonth() + 1)
		let YYYY =
			fecha.getFullYear() < 10
				? `0${fecha.getFullYear()}`
				: String(fecha.getFullYear())
		let mm =
			fecha.getMinutes() < 10
				? `0${fecha.getMinutes()}`
				: String(fecha.getMinutes())
		let ss =
			fecha.getSeconds() < 10
				? `0${fecha.getSeconds()}`
				: String(fecha.getSeconds())
		// console.log("fecha input::",date)
		// console.log("fecha process::",fecha.toDateString())
		// console.log("fecha procesada:",{DD,MM,YYYY})
		let formatResult = `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}`
		if (format === 1) formatResult = `${DD}/${MM}/${YYYY}`
		if (format === 2) formatResult = `${DD}-${MM}-${YYYY}`
		if (format === 3) formatResult = `${YYYY}/${MM}/${DD}`
		if (format === 4) formatResult = `${YYYY}-${MM}-${DD}`
		if (format === 5) formatResult = `${YYYY}-${DD}-${MM}`
		if (format === 6) formatResult = `${DD}/${MM}/${YYYY} ${HH}:${mm}:${ss}`
		return formatResult
	}

	export const parseIsoStringToDate = (
		date: string,
		datetimeFormat?: boolean
	) => {
		if (!date) return
		if (datetimeFormat) {
			const parseDateArray = date.split('T')
			if (parseDateArray.length == 2) {
				return new Date(date)
			}
		}

		const dateFormat1 = /^\d{2}\/\d{2}\/\d{4}$/
		const isValidFormat = dateFormat1.test(date)
		let fecha = null
		if (isValidFormat) {
			const parts = date.split('/')
			fecha = new Date(`${parts[2]}, ${parts[1]}, ${parts[0]}`)
		} else {
			fecha = DateHelper.date(date)
		}
		if (!fecha) return
		return fecha
	}

	export const DateToNumber = (date: Date | string) => {
		if (!date) return

		const fecha = DateHelper.date(date)
		if (!fecha) return

		const datetime = fecha.getTime()
		const timestamp = 24 * 60 * 60 * 1000
		const parseNum = Math.floor(datetime / timestamp)
		return parseNum
	}

export	const parseStrinfDateTo000 = (dateIsoString: string) => {
		let spit = dateIsoString.split('T')
		let base = spit[0]
		return base + 'T00:00:00'
	}
}
