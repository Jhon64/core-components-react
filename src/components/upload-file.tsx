import { CSSProperties, useEffect, useRef, useState } from 'react'
import ImageDefault from '../assets/img/default-img.gif'
import { Signal } from '@preact/signals-react'
interface IUploadFile {
	multiple?: boolean
	extensionesValidas?: string[]
	css?: CSSProperties
	getFiles: (files: File[]) => void
	urlFile?: string
	resetSignal?: Signal<any>
	disabled?: boolean
}
export const UploadFile = (props: IUploadFile) => {
	const baseFILES = ''//window.baseUrlAPI
	const urlDefault = '/images/default-img.gif'
	const prevImgRef = useRef(null as HTMLImageElement)
	const inputFileRef = useRef(null as HTMLInputElement)

	const previewImg = (isDefault?: boolean) => {
		if (!prevImgRef.current) return
		if (isDefault) {
			prevImgRef.current.src = urlDefault
		} else {
			if (!props.multiple) {
				const file = inputFileRef.current.files[0]
				prevFileSingle(file)
			} else {
			}
		}
	}

	const [THIS, setTHIS] = useState(() => {
		const listFiles: File[] = []
		previewImg(true)
		return {
			listFiles,
		}
	})

	const handleClickPrev = () => {
		console.log('prev icono')
		console.log(inputFileRef)
		inputFileRef.current.click()
	}
	const onchangeFile = () => {
		const files = inputFileRef.current.files
		if (!props.multiple) {
			prevFileSingle(files[0])
		}
		let listaFiles: File[] = []
		//@ts-ignore
		for (let file of files) {
			listaFiles.push(file)
		}
		THIS.listFiles = listaFiles
		if (props.getFiles) props.getFiles(listaFiles)
	}

	const prevFileSingle = (file: File) => {
		const fileName = file.name as string
		const ext = '.' + fileName.split('.')[1]
		let extensionesValidas: string[] = []
		if (!props.extensionesValidas) {
			extensionesValidas = [
				'.gif',
				'.GIF',
				'.png',
				',PNG',
				'.jpeg',
				'.JPEG',
				'.jpg',
				'.JPG',
			]
		}
		if (!extensionesValidas.includes(ext)) return

		const reader = new FileReader()
		reader.onload = (event) => {
			prevImgRef.current.src = event.target.result as string
		}
		reader.readAsDataURL(file)
	}

	// Efecto para escuchar los cambios en la señal `resetSignal`
	useEffect(() => {
		if (props.resetSignal?.value != undefined) {
			// Reiniciar la previsualización de la imagen cuando la señal cambie
			previewImg(true)
			setTHIS({ listFiles: [] })
			prevImgRef.current.src = ImageDefault
			inputFileRef.current.value = '' // Reiniciar el input de archivo
		}
	}, [props.resetSignal?.value])

	return (
		<>
			<div className="w-full bg-blue-gray-50 h-full">
				<div className="flex  items-center justify-center content-center ">
					<img
						src={props.urlFile ? baseFILES + '/' + props.urlFile : ImageDefault}
						onClick={() => handleClickPrev()}
						ref={prevImgRef}
						className="hover:shadow-sm hover:bg-blue-gray-600 hover:cursor-pointer"
						style={{ border: '1px solid #ddd', ...props.css }}
					/>
				</div>
			</div>
			<input
				type="file"
				className="hidden"
				ref={inputFileRef}
				onChange={() => onchangeFile()}
				disabled={props?.disabled}
			></input>
		</>
	)
}
