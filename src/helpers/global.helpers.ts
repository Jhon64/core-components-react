export namespace GlobalHelper{
	export const charLetters = [
		'', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
	
	export const getLetter = (idx): string => {
		let baseIdx = 0
		if (idx >= charLetters.length) {
			baseIdx = 1; idx = idx - (charLetters.length - 1)
		}
		return baseIdx ? (charLetters[baseIdx] + charLetters[idx]) : charLetters[idx]
	}
	
  export function colorLog(message, color) {
		color = color || 'black'

		switch (color) {
			case 'success':
				color = 'Green'
				break
			case 'info':
				color = 'DodgerBlue'
				break
			case 'error':
				color = 'Red'
				break
			case 'warning':
				color = 'Orange'
				break
			default:
				color = color
		}

		// console.log('%c' + message, 'background:' + color)
	}
}