import React, {CSSProperties, Fragment} from "react";

interface ILabelprops {
    value?: any
    label?: string | number
    children?:any
    class?: string
    type?: 'success' | 'danger' | 'info' | 'primary' | 'secondary'
    outline?: boolean
    css?: CSSProperties
}

export const Label = React.memo((props: ILabelprops) => {
    let classLabel = 'border-gray-800 ' + props.outline ? 'border-gray-800' : 'bg-gray-800'
    switch (props.type) {
        case 'success':
            classLabel = props.outline ? 'border-green-600 text-green-600' :
                'border-green-600 bg-green-500 ';
            break
        case 'secondary':
            classLabel = props.outline ? 'border-gray-600 text-gray-600' :
                'border-gray-600 bg-gray-500 ';
            break
        case 'primary':
            classLabel = props.outline ? 'border-blue-600 text-blue-600' :
                'border-blue-600 bg-blue-500 ';
            break
        case 'danger':
            classLabel = props.outline ? 'border-red-600 text-red-600' :
                'border-red-600  bg-red-500 ';
            break
        case 'info':
            classLabel = props.outline ? 'border-sky-600 text-sky-600' :
                'border-sky-600 bg-sky-500 ';
            break
    }
    return <Fragment>
        <label className={'rounded-md px-2 py-1 cursor-pointer ' +
            (classLabel + ' border ' + props.class)} style={props.css}>
            {props.value || props.label || props.children}
        </label>
    </Fragment>
})

export interface ILabel2Props extends ILabelprops {
    iconCancel?: boolean
    handleIconCancel?: () => void
}

export const Label2 = React.memo((props: ILabel2Props) => {
     let bg='';   
    if(props.type=='success')bg='bg-green-500 text-white ';
    if(props.type=='danger')bg='bg-red-500 text-white ';
    if(props.type=='info')bg='bg-blue-500 text-white ';
    if(props.type=='primary')bg='bg-blue-500 text-white ';
    if(props.type=='secondary')bg='bg-gray-500 text-white ';

    return <Fragment>
        <div className={'px-2 py-1.5 border border-solid flex text-center ' +
            'align-center rounded-lg ' + bg}>
            <label className={'pr-2 w-full ' }>{props.label}</label>
            {props.iconCancel && <>
            <span className="rounded-full py-1 px-1.5 bg-red-500 text-white cursor-pointer fa fa-times" onClick={() => {
                if (props.handleIconCancel) {
                    props.handleIconCancel()
                }

            }}></span>
            </>}
        </div>
    </Fragment>
})


export default {Label, Label2}