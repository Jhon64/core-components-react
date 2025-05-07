import './index.scss'
export interface IMyNotiy {
	labels?: string[]
}
 const MyNotify = (props: IMyNotiy) => {
	if (!props.labels) return
	const length = props.labels.length - 1
	const parseLabels = props.labels.map((x, i) => {
		return (
			<>
				<span>{x}</span> {i < length && <>|</>}
			</>
		)
	})
	return (
		<>
			<div
				id="my-notify"
				className="my-notify progress progress-striped active"
			>
				<div
					role="progressbar "
					className="progress-bar progress-bar-default"
					style={{ width: '100%' }}
				>
					<label id="table-names">{parseLabels}</label>
				</div>
			</div>
		</>
	)
}
export default MyNotify