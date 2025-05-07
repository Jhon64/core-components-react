import dateFns, { differenceInMinutes, differenceInSeconds } from 'date-fns'

export namespace TimeHelper {
	type FormatType = 'horas' | 'minutos' | 'segundos'

  /**
   * 
   * @param time : en segundos
   * @param format : formato de conversion
   * @returns 
   */
	export const timeAgo = (time: number, format: FormatType) => {
		if(!time)return 0
    const timeNow = new Date()
    const currentTime=new Date(time)
		let timestamp = differenceInSeconds(timeNow,currentTime)
		if (format === 'minutos') {
			timestamp = differenceInMinutes(timeNow,currentTime )
		} else if (format === 'horas') {
		}
		return timestamp
	}
}
