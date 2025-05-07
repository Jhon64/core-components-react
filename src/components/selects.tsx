import {
	ChangeEvent,
	Component,
	CSSProperties,
	Fragment,
	PureComponent,
	ReactNode,
} from 'react'
import './scss/select.scss'
interface itemOption {
	id: any
	name: string | number
}

interface IStateSelect {
	listOptions: any[]
	itemSelected: any
	validRequired?: boolean
	defaultValue?: any
	form?: any
	stylesInput: string
	showOptions: boolean
}

/**
 * @KeyLabel :propiedad para mostrar el texto en el componente
 * @KeyValue :propiedad para mostrar el campo del valor en el componente
 * @noSelectedText :texto por default cuando no se ha seleccionado algun elemento de la lista
 */
interface IPropSelect {
	options: () => Array<any>
	label?: string
	keyValue?: string
	keyLabel?: string
	required?: boolean
	onSelect?: (value: any, item?: any) => void
	saveKey?: string
	saveForm?: any
	inputCss?: CSSProperties
	classSelect?: string
	class?: string
	rounded?: boolean
	noSelectedText?: string
	disabled?:boolean
	style?: string
}

 class Select2 extends Component<IPropSelect, IStateSelect> {
	constructor(props: IPropSelect) {
		super(props)
		const list=this.parseListoptions()
		const defaultValue =
			props.saveForm && props.saveKey ? props.saveForm[props.saveKey] || '' : ''
		this.state = {
			listOptions: list,
			validRequired: props.required ? false : true,
			defaultValue: defaultValue,
			itemSelected:
				(defaultValue + '').trim().length > 0
					? list.find((x) => x[props.keyValue] == defaultValue) || {}
					: {},
			form: props.saveForm || {},
			stylesInput: '',
			showOptions: false,
		}
	}

	parseListoptions(){
		const optionList =this.props.options
		let list: itemOption[] = []
		if (Array.isArray(optionList)) {
			list = optionList
		}
		if (typeof optionList == 'function') {
			list = optionList()
		}
		return list
	}

	componentDidMount(): void {
		let stylesInput = this.getColorInput()
		this.setState({ stylesInput })
	}

	componentDidUpdate(prevProps: Readonly<IPropSelect>, prevState: Readonly<IStateSelect>, snapshot?: any): void {
		const newState={} as any
		if(prevProps.options!=this.props.options){
			newState.listOptions=this.parseListoptions()
		}
		if(prevProps.saveForm!=this.props.saveForm){
			newState.form=this.props.saveForm
		}
		if(Object.keys(newState).length>0){
			this.setState({...this.state,...newState})
		}
	}



	getColorInput = () => {
		const state = this.state
		const props = this.props
		return !state.validRequired && props.required
			? 'border-red-500 active:border-red-500  active:outline active:outline-1 active:outline-red-500 focus:border-red-500  focus:ring-red-500 focus:ring-offset-0 focus:ring-offset-red-500 focus:shadow focus:shadow-red-500"'
			: ' border-gray-400  active:border-purple-500 focus:border-purple-500  active:outline active:outline-1 active:outline-purple-500'
	}
	handleSelected(itemSel?: any) {
		const state = this.state
		const props = this.props
		const value = itemSel ? itemSel[this.props.keyValue] : state.defaultValue
		const list = this.state.listOptions
		let item: any = {}
		const validValue = ((value ||'')+ '').trim().length
		
		if (props.saveKey) state.form[props.saveKey] = validValue > 0 ? value : null
		const find = list.find((x) => x[props.keyValue] == value)
		let stylesInput = this.getColorInput()

		if (find) item = find
		if (props.onSelect) props.onSelect(validValue, item)
		this.setState({
			itemSelected: item,
			// form:state.form,
			validRequired: validValue > 0 ? true : false,
		})
	}

	createOption(item: any,index:number) {
		return (
			<div
				key={Date.now() + '' + (item[this.props.keyValue]||index)}
				className="border rounded-md option border-solid px-2 py-1 cursor-pointer bg-white 
        hover:bg-select-secondary-color hover:text-select-text-color-list"
				onClick={(_) => {
					// if(this.props.saveKey && this.props.formSave){
					//   this.props.formSave[this.props.saveKey] = item[this.props.keyValue||'id']
					// }
					// if(this.props.onSelect)
					this.handleSelected(item)
					this.setState({ showOptions: false })
				}}
			>
				<span style={{ fontSize: '11px' }}>
					{item[this.props.keyLabel || 'name']}
				</span>
			</div>
		)
	}

	generateOptions() {
		return this.state.showOptions ? (
			<div style={{zIndex: 100}}
				className="select-options absolute
      w-full bg-white shadow-md border border-solid 
      border-gray-400 rounded-md "
			>
				{this.props.options().map((x,i) => this.createOption(x,i))}
			</div>
		) : (
			<></>
		)
	}

	render(): ReactNode {
		const state = this.state
		return (
			<div
				className={
					(!this.props.label
						? 'inline-flex w-full '
						: '  align-center items-center  px-0.5 py0.5 ' + 'w-full ') +
					this.props.class
				}
				style={{zIndex: '99999'}}
			>
				{this.props.label && (
					<div className="flex justify-between">
						<label
							className="font-light text-muted "
							style={{ fontSize: '12px' }}
						>
							{this.props.label}
						</label>
						{this.props.required && (
							<span
								className={
									'mr-1 ' +
									(state.validRequired
										? ' text-blue-500  fa fa-check-circle'
										: 'text-red-600 fa fa-warning')
								}
								style={{ fontSize: '11px' }}
							></span>
						)}
					</div>
				)}
				<div className="relative w-full">
					<div
						className={
							`y-0.5 w-full select rounded-md text-muted border border-solid border-gray-400  
              ${this.props.rounded ? 'rounded' : null}   ${
								(!this.props.disabled && this.state.showOptions) ? 'active' : null
							} ${this.props.disabled?'bg-gray-100 border-gray-200':null} ` + this.props.classSelect
						}
						style={{
							...(typeof this.props.inputCss == 'object'
								? this.props.inputCss
								: {}),
							padding: '0.45rem',
						}}
						onClick={(_) =>
							this.setState({ showOptions: !this.state.showOptions })
						}
					>
						<span style={{ fontSize: '11px' }}>
							{state.itemSelected[this.props.keyLabel] ||
								this.props.noSelectedText ||
								'Seleccione Item'}
						</span>
					</div>
					{!this.props.disabled && this.generateOptions()}
				</div>
			</div>
		)
	}
}

export default Select2
