import { memo, useState } from 'react'

import { Modal } from '../modal'
import { Button2, IButtonProps } from './buttons'
interface IButtonDeleteProps extends IButtonProps {
	_setContentTitle?: () => JSX.Element
	_contentTitleText?: string
	_contentTitleClass?: string
	_showTitle?: boolean
	confirm?: boolean
	deleteID?: number
	deleteRow?: any
	deleteids?: number
	multiple?: boolean
	confirmCancel?: (status: boolean) => void
	confirmDelete?: (status: boolean, id?: number, row?: any) => void
	hideTitle?: boolean
	outlineConfirm?: boolean
	outlineCancel?: boolean
	hideSubtitle?: boolean
	outline?: boolean
	bgIcon?: string
	subtitle?: string
	btnPrincipalClass?: string
	btnConfirmarTitle?: string
	btnCancelarTitle?: string
}
export const ButtonDelete = memo((props: IButtonDeleteProps) => {
	const [showState, setShowState] = useState(
		props.confirm || (false as boolean)
	)
	const buttonsActive =
		props?.primary ||
		props?.secondary ||
		props?.warning ||
		props?.success ||
		props?.info

	return (
		<>
			<Button2
				icon={props.icon || 'fa fa-trash'}
				size={props.size ? props.size : 'xs'}
				outline={props?.outline}
				title={props?.title || 'Eliminar'}
				type={props?.type}
				class={props?.btnPrincipalClass}
				primary={props?.primary || false}
				secondary={props?.secondary || false}
				warning={props?.warning || false}
				success={props?.success || false}
				info={props?.info || false}
				danger={buttonsActive ? false : true}
				onClick={() => {
					setShowState(true)
				}}
				disabled={props?.disabled}
			/>
			<Modal
				show={showState}
				cssModal={{ position: 'fixed', top: '6rem' }}
			>
				<>
					{props._showTitle && (
						<>
							<div>
								{!props._setContentTitle && (
									<h2
										className={
											props._contentTitleClass || 'text-red-500 font-normal'
										}
									>
										{props._contentTitleText || 'Eliminar Registros !!!'}
									</h2>
								)}
								{props._setContentTitle && <>{props._setContentTitle()}</>}
							</div>
							<hr />
						</>
					)}
					<div className="mt-0">
						<div className="flex justify-center items-center content-center text-center w-full">
							<div
								className={
									'rounded-full border   flex items-center justify-center  ' +
									(props?.bgIcon || ' text-orange-500 border-orange-500 ')
								}
								style={{ height: '5rem', width: '5rem', fontSize: '4rem' }}
							>
								!
							</div>
						</div>
						{!props.hideTitle && (
							<div className="content buttons flex w-full justify-center mt-1">
								<h1>{props.title || 'Seguro de eliminar los  registros'}</h1>
							</div>
						)}
						<div className="content buttons flex w-full justify-center mt-1">
							<h2>{props.subtitle || 'Seguro de eliminar los  registros?'}</h2>
						</div>
						<div className="content buttons flex w-full justify-center mt-5">
							<Button2
								success
								size="lg"
								icon="fa fa-check"
								text={props.btnConfirmarTitle ?? 'Aceptar'}
								outline={props.outlineConfirm}
								onClick={() => {
									if (props.confirmDelete)
										props.confirmDelete(true, props.deleteID, props.deleteRow)
									setShowState(false)
								}}
							/>
							<Button2
								danger
								size="lg"
								icon="fa fa-times"
								text={props.btnCancelarTitle ?? 'Cancelar'}
								outline={props.outlineCancel}
								onClick={() => {
									if (props.confirmCancel) props.confirmCancel(false)
									setShowState(false)
								}}
							/>
						</div>
					</div>
				</>
			</Modal>
		</>
	)
})
