export namespace StringHelper {
	export function stringToListInt(
		strData: string,
		separator: string = ','
	): Array<number> {
		return (strData || '').split(separator).map((x) => +x).filter(x=>x)
	}

	export const normalizeString = (
		str: string,
		removerEspacios?: boolean | null,
		sinNormalizar?: boolean | null
	) => {
		let cleanString = str
		if (!str) {
			return ''
		}
		if (removerEspacios) cleanString = str.replace(' ', '')
		cleanString = cleanString.replace(' ', '_').toLowerCase()
		// Utilizamos la función `normalize` para descomponer caracteres con acentos o diacríticos

		if (!sinNormalizar) {
			var cadenaNormalizada = cleanString.normalize('NFD')

			// Usamos una expresión regular para eliminar los caracteres especiales (acentos) y los que no sean letras o números
			cadenaNormalizada = cadenaNormalizada.replace(/[\u0300-\u036f]/g, '')
			cadenaNormalizada = cadenaNormalizada.replace(/[^a-zA-Z0-9\s]/g, '')
			// Convertimos la cadena a minúsculas y eliminamos espacios en blanco adicionales
			cadenaNormalizada = cadenaNormalizada.toLowerCase().trim()
			return cadenaNormalizada
		} else {
			return cleanString
		}
	}
}
