import React, { CSSProperties, Fragment } from 'react'

import './scss/modal.scss'
interface IModalProps {
	show?: boolean
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	css?: CSSProperties
	cssModal?: CSSProperties
	backdrop?: boolean
	showHeader?: boolean
	textHeader?: string
	setHeader?: () => JSX.Element | JSX.Element
	children?: JSX.Element
	setFooter?: () => JSX.Element
}
export const Modal = React.memo((props: IModalProps) => {
	const width =
		props?.size == 'lg' ? '70rem' : props?.size == 'xl' ? '90rem' : '50rem'
	const left =
		props?.size == 'lg'
			? 'calc(50% - 32rem)'
			: props?.size == 'xl'
			? 'calc(50% - 45rem)'
			: 'calc(50% - 25rem)'
	// const left='calc(50% - 25rem)'
	return (
		<Fragment>
			{!props.show && <></>}
			{props.show && (
				<>
					<div
						className="fixed w-full h-full bg-black opacity-30 top-0 left-0 "
						style={{ zIndex: 10005, ...props.css }}
					></div>

					<div
						className="modal pb-2"
						style={{ zIndex: 10006, width, left, ...props.cssModal }}
					>
						{(props.showHeader || props.textHeader || props.setHeader) && (
							<>
								<div className="px-5 py-3 flex justify-between">
									{!props.setHeader && (
										<h1 className="text-muted">
											{props.textHeader || 'Header'}
										</h1>
									)}
									{props.setHeader && (
										<>
											{typeof props.setHeader == 'string'
												? props.setHeader
												: props.setHeader()}
										</>
									)}
									{/* <Button icon="fa fa-close" secondary outline /> */}
								</div>
								<hr />
							</>
						)}
						<div
							className={
								'body px-5 mb-2  ' +
								(props.setHeader || props.textHeader || props.showHeader
									? 'py-2'
									: 'py-6')
							}
						>
							{props.children}
						</div>
						{typeof props.setFooter == 'function' && (
							<>
								<hr />
								<div className="px-5 pt-3 pb-3">{props.setFooter()}</div>
							</>
						)}
					</div>
				</>
			)}
		</Fragment>
	)
})
