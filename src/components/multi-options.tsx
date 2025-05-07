import React, { Component, useState } from 'react'

interface State {
	selectedOptions: any[]
	showOptions: boolean
}

class MultiOptions extends Component<any, State> {
	constructor(props: any) {
		super(props)
		this.state = {
			selectedOptions: [],
			showOptions: false,
		}
	}

	handleSelectChange = (value: any) => {
		const { selectedOptions } = this.state

		let updatedOptions = [...selectedOptions]

		if (selectedOptions.includes(value)) {
			updatedOptions = selectedOptions.filter((option) => option !== value)
		} else {
			updatedOptions.push(value)
		}

		this.setState({ selectedOptions: updatedOptions }, () => {
			if (this.props?.saveForm && this.props?.saveKey)
				this.props.saveForm[this.props.saveKey] = updatedOptions
		})
	}

	render() {
		const { options, label, keyValue, keyLabel, required, disabled } = this.props
		const { selectedOptions, showOptions } = this.state

		const handleOption = () => {
			this.setState({ showOptions: !showOptions })
		}

		const isEmpty = () => selectedOptions.length === 0

		return (
			<>
				<div
					onClick={handleOption}
					className={`border ${
						isEmpty() && required
							? 'border-red-400 text-red-400'
							: 'border-gray-400 text-gray-400'
					}`}
					style={{
						borderRadius: '6px',
						height: '30px',
						display: 'flex',
						alignItems: 'center',
						paddingLeft: '10px',
						paddingRight: '10px',
						position: 'relative',
						fontSize: '11.5px',
					}}
				>
					<div className="w-full flex justify-between">
						<span>
							{selectedOptions.length === 0
								? label
								: selectedOptions
										.map((x) => {
											const opt = options.find((y: any) => y[keyValue] === x)
											return opt[keyLabel]
										})
										.toString()}
						</span>
						<span onClick={handleOption}>
							{showOptions && !disabled ? (
								<i className="bx bxs-chevron-up"></i>
							) : (
								<i className="bx bxs-chevron-down"></i>
							)}
						</span>
					</div>
					{showOptions && !disabled && (
						<div
							onClick={(e) => e.stopPropagation()}
							style={{
								width: '156px',
								minHeight: '42px',
								position: 'absolute',
								top: '35px',
								left: '0px',
								zIndex: '999',
								background: '#fff',
								borderRadius: '4px',
								padding: '9px',
							}}
						>
							{options.map((opt: any, i: number) => {
								return (
									<div
										className="hover:bg-gray-200"
										style={{
											height: '28.13px',
											padding: '9px 9px 6px',
											color: '#607D8B',
											fontSize: '10.5px',
											width: '100%',
											borderRadius: '4px',
											display: 'flex',
											justifyContent: 'space-between',
										}}
										onClick={() => {
											if (
												options[i].isSelected === false ||
												!options[i].isSelected
											) {
												options[i].isSelected = true
												this.handleSelectChange(opt[keyValue])
											}
										}}
									>
										<span>{opt[keyLabel]}</span>
										<span
											className="cursor-pointer"
											onClick={(e) => {
												e.stopPropagation()
												if (options[i].isSelected === true) {
													options[i].isSelected = false
													this.handleSelectChange(opt[keyValue])
												}
											}}
										>
											{opt.isSelected === true ? <span className="fa fa-close"></span> : null}
										</span>
									</div>
								)
							})}
						</div>
					)}
				</div>
				{isEmpty() && required && <span className='text-red-400'>Este campo es requerido</span>}
			</>
		)
	}
}

export default MultiOptions
