// import pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from "pdfmake/build/vfs_fonts";

// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// pdfMake.fonts = {
//   'Roboto': {
//     normal: 'Roboto-Regular.ttf',
//     bold: 'Roboto-Medium.ttf',
//     italics: 'Roboto-Italic.ttf',
//     bolditalics: 'Roboto-Italic.ttf'
//   }
// };

// interface IPDFProps {
// 	content?: any
// 	styles?: any
// 	defaultStyle?: any
// 	title?: string
//   pageMargins?:number[]
// }

// export class PDFHelper {
// 	private _pdf: pdfMake
//   private _props?:IPDFProps
//   // contentBody:any
// 	constructor(props?: IPDFProps) {
//     this._props=props
// 		this._pdf = {
//       pageMargins:props?.pageMargins||[40, 60, 40, 60],
// 			content: this.getHeader(),
// 			defaultStyle: props?.defaultStyle || {
// 				fontSize: 15,
// 				bold: true,
// 			},
// 			styles: props?.styles || {
// 				header: {
// 					fontSize: 15,
// 					bold: true,
// 					alignment: 'center',
// 				},
// 				anotherStyle: {
// 					italics: true,
// 					alignment: 'right',
// 				},
// 			},
// 		}
//     // this.contentBody=this._pdf.content
// 	}

//   getHeader(){
//     let props=this._props
//     let header = {}
// 		if (props?.title) {
// 			header = { text: props.title || '', style: 'header' }
// 		}
// 		let content = []
// 		if (props.title) {
// 			content.push(header)
// 		}
// 		if (props?.content) {
// 			content = [...content, ...props.content]
// 		}
//     return content

//   }
// 	get Instance() {
// 		return this._pdf
// 	}

// 	setContent(content) {
// 		this._pdf.content=[...this.getHeader(),
//       content
//     ]
// 	}
// 	openWindow() {
// 		pdfMake.createPdf(this._pdf).open()
// 	}
// 	download(fileName: string) {
// 		pdfMake.createPdf(this._pdf).download(fileName)
// 	}
// }
