/* eslint-disable @typescript-eslint/no-unused-vars */
import { Signal } from '@preact/signals-react'
import { useEffect } from 'react'

interface ICheckbox {
	label: string
	classNameLabel?: string

	value?: undefined | boolean
	form?: any
	name: string

	onKeyUp?: (e: any) => any
	onChange?: (e: any) => any
	onBlur?: (e: any) => any

	update?: Signal<boolean>
	disabled?: boolean
}
let countInstance = 1
const Checkbox = (props: ICheckbox) => {
	const { label, classNameLabel, disabled = false } = props
	const { value = false, form, onKeyUp, onChange, onBlur, update, name } = props
	const iCheck = `icon-checkbox-${new Date().getTime() + countInstance}`
	const iCheckS = `icon-checkbox-square-${new Date().getTime() + countInstance}`
	const iCheckSIncomplete = `icon-incomplete-${
		new Date().getTime() + countInstance
	}`
	countInstance++

	const handleChangeVerifyCheck = (value: boolean) => {
		const nodeICheck = document.getElementById(iCheck) as HTMLInputElement
		const nodeICheckS = document.getElementById(iCheckS) as HTMLInputElement
		// const nodeICheckSIncomplete = document.getElementById(
		// 	iCheckSIncomplete
		// ) as HTMLInputElement

		// if (value) {
		// 	nodeICheck.classList.add('hidden')
		// 	nodeICheckS.classList.remove('hidden')
		// 	// nodeICheckSIncomplete.classList.add('hidden')
		// } else {
		// 	nodeICheck.classList.remove('hidden')
		// 	nodeICheckS.classList.add('hidden')
		// 	// nodeICheckSIncomplete.classList.remove('hidden')
		// }
		// else {
		// 	nodeICheck.classList.remove('hidden')
		// 	nodeICheckS.classList.add('hidden')
		// 	nodeICheckSIncomplete.classList.add('hidden')
		// }
	}

	const handleChangeCheckbox = () => {
		if (disabled) return
		const check = form[name] ? false : true

		const event = {
			target: {
				name,
				value: check,
			},
		}
		if (onChange) onChange(event)
		if (onKeyUp) onKeyUp(event)
		if (onBlur) onBlur(event)
		handleChangeVerifyCheck(check)
	}

	useEffect(() => {
		if (form) {
			handleChangeVerifyCheck(form[name] ?? false)
		} else {
			handleChangeVerifyCheck(value)
		}
	}, [update?.value])

	useEffect(() => {
		if (form) handleChangeVerifyCheck(form[name] ?? false)
	}, [form])

	return (
		<div className="flex items-center h-6 ">
			<i
				id={iCheck}
				className={`bx bx-checkbox text-[21px] cursor-pointer ${
					disabled ? 'text-gray-400' : 'text-primary-color'
				}`}
				onClick={() => handleChangeCheckbox()}
			></i>
			<i
				id={iCheckS}
				className={`bx bx-checkbox-square text-[21px] cursor-pointer hidden ${
					disabled ? 'text-gray-400' : 'text-primary-color'
				}`}
				onClick={() => handleChangeCheckbox()}
			></i>
			{/* <i
				id={iCheckSIncomplete}
				className="bx bxs-minus-square text-gray-400 cursor-pointer hidden text-[20.8px]"
				onClick={() => handleChangeCheckbox()}
			></i>
			<span className="text-[10px] cursor-pointer text-text-color">
				<span
					className={`${classNameLabel}`}
					onClick={() => handleChangeCheckbox()}
				>
					{label}
				</span>
			</span> */}
		</div>
	)
}

export default Checkbox
