import { InputProps } from '@material-tailwind/react'
import React, { CSSProperties, memo, useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { Input2 } from '../input2'
import { DateHelper } from '../../../helpers/datetime.helper'
import "./inputCalendar.scss"
export interface IInputCalendar
	extends Omit<InputProps, 'onBlur' | 'onKeyUp' | 'onChange'> {
	minWidth?: string
	labelClass?: string
	inputClass?: string
	placeholder?: string
	icon?: string
	textPreviewIcon?: string
	labelRequired?: string
	class?: string
	style?: CSSProperties
	saveForm?: {
		[props: string]: any
	}
	saveKey?: string
	required?: boolean
	formatDate?: string
	_errors?: any[]
	_getErrors?: (_errors: any[]) => void
	onBlur?: (value: string | number) => void
	onEnter?: (value?: string | number) => void
	onKeyUp?: (value?: string | number) => void
	initializeNull?: boolean
	onChange?: (value: Date | null) => void
	maxDate?: Date
	minDate?: Date
	defaultValue?: any
}

 const InputCalendar = memo((props: IInputCalendar) => {
	const [formSave, setFormSave] = useState(props.saveForm || {})
	const [showCalendar, setShowCalendar] = useState<boolean>(false)
	const [dateSelected, setDateSelected] = useState<Date>(
		formSave[props?.saveKey] || null
	)
	const [dateBefore, setDateBefore] = useState<Date>(props?.minDate)
	const [labelRequired, setLabelRequired] = useState(
		props?.labelRequired || 'Este campo es requerido'
	)
	const [errorFormat, setErrorFormat] = useState(false)
	const [dateFmtSelected, setDateFmtSelected] = useState<string>(
		DateHelper.parseIsoStringToFormat(1, formSave[props?.saveKey]) || ''
	)

	useEffect(() => {
		if (props.saveForm) {
			setFormSave(props.saveForm)
			setDateFmtSelected(
				DateHelper.parseIsoStringToFormat(1, formSave[props?.saveKey]) || ''
			)
		}
		return () => {}
	}, [props.saveForm])

	const handleChange = (value: Date) => {
		let formTemp = formSave
		setDateSelected(value)
		// console.log('onchange Date', value)
		const dateStr = DateHelper.parseIsoStringToFormat(1, value)
		setDateFmtSelected(dateStr)
		formTemp[props.saveKey] = value
		// setFormSave(formTemp)
		console.log('form change', formSave)
		setShowCalendar(false)
		setDateBefore(value)
		if (props?.onChange) {
			props?.onChange(value)
		}
	}

	const handlerFocus = (_: React.FocusEvent<HTMLInputElement>) => {
		setShowCalendar(true)
	}

	const handleContainerClick = (e: MouseEvent) => {
		if (!(e.target as HTMLElement).closest('.input-calendar-container')) {
			setShowCalendar(false)
		}
	}

	useEffect(() => {
		document.addEventListener('click', handleContainerClick)
		return () => {
			document.removeEventListener('click', handleContainerClick)
		}
	}, [])

	const clearDate = () => {
		formSave[props?.saveKey] = null
		setDateFmtSelected('')
		if (props.onChange) props?.onChange(null)
	}

	return (
		<div
			className={'relative w-full input-calendar-container ' + props?.className}
		>
			{props?.disabled ? (
				<div className="w-full flex justify-end absolute top-1 right-0">
					<span
						onClick={() => clearDate()}
						className={
							'mr-1 text-gray-500 block z-50 p-2 rounded-lg hover:cursor-pointer hover:bg-gray-400 hover:text-white  fa fa-close'
						}
						style={{ fontSize: '13px' }}
					></span>{' '}
				</div>
			) : null}
			<Input2
				isDate={true}
				minWidth={props?.minWidth}
				width={props?.width}
				autoFocus={showCalendar}
				onFocus={(e) => handlerFocus(e)}
				onBlur={(val: string) => {
					let parseVal = val.split('/')
					let _date = new Date()
					const getMonth = _date.getMonth()
					const getYear = _date.getFullYear()

					// const  dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
					// const regex=dateRegex.test(val)

					// if(!regex && val.length!=10){
					// 	setLabelRequired("El formato Fecha es incorrecto")
					// 	formSave[props.saveKey]=null
					// 	setDateFmtSelected(null)
					// 	setDateSelected(null)
					// 	setErrorFormat(true)
					// 	return
					// }
					//dias
					if (parseVal.length > 0) {
						const parseDias = +parseVal[0]
						if (!isNaN(parseDias)) {
							if (parseDias > 31 || parseDias < 1) return
							if (parseDias == 0) return
							_date = new Date(getYear, getMonth, parseDias)
						}
					}
					//dias
					if (parseVal.length > 1) {
						const parseDias = +parseVal[0]
						const parseMonth = +parseVal[1]

						if (!isNaN(parseDias) && !isNaN(parseMonth)) {
							if (parseDias > 31 || parseDias < 1) return
							if (parseMonth > 12 || parseMonth < 1) return
							if (parseDias == 0) return
							if (parseMonth == 0) return
							_date = new Date(getYear, parseMonth - 1, parseDias)
						}
					}

					// COMPLETO
					if (parseVal.length > 2) {
						const parseDias = +parseVal[0]
						const parseMonth = +parseVal[1]
						const parseYear = +parseVal[2]

						if (!isNaN(parseDias) && !isNaN(parseMonth)) {
							if (parseDias > 31 || parseDias < 1) return
							if (parseMonth > 12 || parseMonth < 1) return
							if ((parseYear + '').length != 4) return
							if (parseDias == 0) return
							if (parseMonth == 0) return
							if (parseYear == 0) return
							_date = new Date(parseYear, parseMonth - 1, parseDias)
						}

						formSave[props.saveKey] = _date
						setDateSelected(_date)
						const dateStr = DateHelper.parseIsoStringToFormat(1, _date)
						setDateFmtSelected(dateStr)
						setErrorFormat(false)
						setFormSave(formSave)

						if (
							props?.minDate &&
							props?.minDate instanceof Date &&
							_date instanceof Date &&
							_date.getTime() < props.minDate.getTime()
						) {
							// setear con la ultima fecha
							if (dateBefore) {
								formSave[props.saveKey] = dateBefore
								setDateSelected(dateBefore)
								const dateStr = DateHelper.parseIsoStringToFormat(1, dateBefore)
								setDateFmtSelected(dateStr)
								setFormSave(formSave)
							}
						}
						// console.log('form change', formSave)
					}
				}}
				placeholder="dd/mm/yyyy"
				label={props.label || 'Seleccione Fecha'}
				defaultValue={dateFmtSelected}
				saveForm={formSave}
				saveKey={props?.saveKey}
				key={Date.now() + '' + props.key}
				disabled={props.disabled}
				required={errorFormat || (props?.required && !dateFmtSelected)}
				labelRequired={labelRequired}
			></Input2>

			{showCalendar && !props?.disabled && (
				<div
					className="absolute w-full"
					style={{ zIndex: '99999999' }}
				>
					<Calendar
						minDate={props?.minDate}
						maxDate={props?.maxDate}
						className="w-full"
						onChange={handleChange}
						value={dateSelected}
					/>
				</div>
			)}
		</div>
	)
})

export default InputCalendar