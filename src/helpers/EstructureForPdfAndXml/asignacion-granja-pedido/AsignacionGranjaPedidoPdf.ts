

// import { IOrderPedidoCliente } from "../../../models/interfaces/services/IOrderPedidoClienteService";
import { DateHelper } from "../../datetime.helper";
import { base64_encode, LineColorTable, LineTest, SpaceLine, TitlePDF, WithLineBorder } from "../../structurePDFComponents";






export const AsignacionGranjaPedidoPdf = async(data:any[]) => {
    const title = `` 
    // console.log( JSON.parse(data[0].Producto))
    const imgLogo = await base64_encode( '/assets/media-pdf/elrocio/logo.png')


    const colorAzul = "#43708B";
    const colorTabletBorder = "#B3B4AE"

    const headerTable = [
        {id: 1, name: "FECHA", fillColor: "", border: [true, true, true, true], size: 25},
        {id: 2, name: "ZONA", fillColor: "", border: [false, true, true, true], size: 35},
        {id: 3, name: "CLIENTE", fillColor: "", border: [false, true, true, true], size: 50},
        {id: 4, name: "DIRECCIÓN", fillColor: "", border: [false, true, true, true], size: 50},
        {id: 5, name: "CAMAL ", fillColor: "", border: [false, true, true, true], size: 30},
        {id: 6, name: "SUBCLIENTE", fillColor: "", border: [false, true, true, true], size: 40},
        {id: 7, name: "VENDEDOR", fillColor: "", border: [false, true, true, true], size: 35},
        {id: 8, name: "PRODUCTO", fillColor: "", border: [false, true, true, true], size: 45},
        {id: 9, name: "FORMATO", fillColor: "", border: [false, true, true, true], size: 45},
        {id: 10, name: "JABAS", fillColor: "", border: [false, true, true, true], size: 20},
        {id: 11, name: "POLLOS", fillColor: "", border: [false, true, true, true], size: 23},
        {id: 12, name: "KILOS", fillColor: "", border: [false, true, true, true], size: 20},
        {id: 13, name: "MONTO", fillColor: "", border: [false, true, true, true], size: 20},

    ]


    const arrayBody = [];
    data.map((dt)=> {
        arrayBody.push([
            {
                border:[true, true, true, true],
                alignment: 'center',
                text: DateHelper.parseIsoStringToFormat(1, dt.pedidoVenta.fechaDocumento), 
            },
            {
                border:[true, true, true, true],
                alignment: 'center',
                text: dt?.pedidoVenta?.zona?.nombre, 
            },
            {
                border:[true, true, true, true],
                alignment: 'center',
                // text: "", 
                text: dt?.pedidoVenta?.cliente?.nombre, 
            },
            {
                border:[true, true, true, true],
                alignment: 'center',
                text: `${dt?.pedidoVenta?.cliente?.direccionCliente}`, 
            },
            {
                border:[true, true, true, true],
                alignment: 'center',
                // text: "", 
                text: dt?.pedidoVenta?.camal?.descripcion, 
            },
            {
                border:[true, true, true, true],
                alignment: 'center',
                // text: "", 
                text: dt?.pedidoVenta?.subCliente, 
            },
            {
                border:[true, true, true, true],
                alignment: 'center',
                // text: "", 
                text: dt?.pedidoVenta?.vendedor?.nombre, 
            },
            {
                border:[true, true, true, true],
                alignment: 'center',
                // text: "", 
                text:`${dt?.codigoMaterial} - ${dt?.descripcionMaterial}` , 
            },
            {
                border:[true, true, true, true],
                alignment: 'center',
                // text: "", 
                text:`(${dt?.unidadPorJaba}) Unid. X (${dt?.numeroJabas}) Jabas` , 
            },
            {
                border:[true, true, true, true],
                alignment: 'center',
                // text: "", 
                text: dt.numeroJabas, 
            },
            {
                border:[true, true, true, true],
                alignment: 'center',
                // text: "", 
                text: dt.cantidadPollos, 
            },
            {
                border:[true, true, true, true],
                alignment: 'center',
                // text: "", 
                text: dt.kilosVendidos, 
            },
            {
                border:[true, true, true, true],
                alignment: 'center',
                // text: "", 
                text: dt.subtTotal1, 
            }
        ])
    })

    const getHout = ():string => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    }

    const getDate = () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
        const year = now.getFullYear();

        return `${day}/${month}/${year}`;
    }

    let docDefinition = {
        pageMargins: [25, 10, 25, 10],
        content: [
            {
                fontSize: 7,
                table: {
                    widths: [68, 70, 240, 130],
                    heights:['*'],
                    body:[
                        [
                            TitlePDF(`Impreso: ${getHout()}`, '', colorAzul, 8, true, "left", [-5, 25, 0, 0]),
                            TitlePDF('', '', colorAzul, 8, true, "left", [0, 47, 0, 0]),
                            // TitlePDF('TARA: 2.60 KGS', '', colorAzul, 8, true, "left", [0, 47, 0, 0]),
                            TitlePDF('RESUMEN ZONA', '', colorAzul, 16, true, "center", [0, 10, 0, 0]),
                            {
                                margin:[0, 0, 0, 0],
                                table:{
                                    widths: ['*'],
                                    body:[
                                        [
                                            {
                                                border: [false, false, false, false],
                                                image: imgLogo,
                                                width: 60,
                                                margin: [0, 0, -4, 0],
                                                alignment : "right"
                                            }
                                        ],
                                        [
                                            {
                                                ...TitlePDF(getDate(), '', colorAzul, 8, true, "right"),
                                                margin:[0, 0, 30, 0]
                                            }
                                        ],
                                    ]
                                },
                                layout: 'noBorders'
                            },
                        ]
                    ]
                },
                layout: {
                    defaultBorder: false,
                }
            },
            SpaceLine(5),
            {
                fontSize: 5.5,
                table:{
                    widths:headerTable.map((dt)=> dt.size),
                    body:[
                        headerTable.map((dt)=> {
                            return {
                                border:dt.border,
                                ... TitlePDF(dt.name, dt.fillColor, colorAzul, 6, true, "center"),
                            }
                        }),
                        ...arrayBody
                    ]
                },
                layout:{
                    ...LineColorTable(colorTabletBorder)
                }
            },
            // {
            //     margin:[0, 60, 0, 0],
            //     fontSize: 9,
            //     table:{
            //         widths:['*', '*'],
            //         body: [
            //             [
            //                 {
            //                     table:{
            //                         widths:[120], 
            //                         body:[
            //                             [
            //                                 {
                                                
            //                                     alignment:'center',
            //                                     text: 'DATOS'
            //                                 }
            //                             ],
            //                             [
            //                                 {
            //                                     table:{
            //                                         widths:[35, 85],
            //                                         body:[
            //                                             [
            //                                                 {
                                                                
            //                                                     border:[false, false, false, false],
            //                                                     text: 'Balanza:',
            //                                                 },
            //                                                 {
            //                                                     margin:[-5,3,0,0],
            //                                                     table:{
            //                                                         widths:['*'],
            //                                                         body:[
            //                                                             [
            //                                                                 {
                                                                                
            //                                                                     border:[false, false, false, true],
            //                                                                     text: '' 
            //                                                                 }
            //                                                             ]
            //                                                         ]
            //                                                     },
            //                                                     layout:{
            //                                                         ...LineColorTable(colorTabletBorder)
            //                                                     }
            //                                                 }
            //                                             ]
            //                                         ]
            //                                     },
            //                                    layout: 'noBorders'
            //                                 }
            //                             ],
            //                             [
            //                                 {
            //                                     table:{
            //                                         widths:[36, 84],
            //                                         body:[
            //                                             [
            //                                                 {
                                                                
            //                                                     border:[false, false, false, false],
            //                                                     text: 'Pesador:',
            //                                                 },
            //                                                 {
            //                                                     margin:[-5,3,0,0],
            //                                                     table:{
            //                                                         widths:['*'],
            //                                                         body:[
            //                                                             [
            //                                                                 {
                                                                                
            //                                                                     border:[false, false, false, true],
            //                                                                     text: '' 
            //                                                                 }
            //                                                             ]
            //                                                         ]
            //                                                     },
            //                                                     layout:{
            //                                                         ...LineColorTable(colorTabletBorder)
            //                                                     }
            //                                                 }
            //                                             ]
            //                                         ]
            //                                     },
            //                                    layout: 'noBorders'
            //                                 }
            //                             ],
            //                             [
            //                                 {
            //                                     table:{
            //                                         widths:[54, 66],
            //                                         body:[
            //                                             [
            //                                                 {
                                                                
            //                                                     border:[false, false, false, false],
            //                                                     text: 'Abastecedor:',
            //                                                 },
            //                                                 {
            //                                                     margin:[-5,3,0,0],
            //                                                     table:{
            //                                                         widths:['*'],
            //                                                         body:[
            //                                                             [
            //                                                                 {
                                                                                
            //                                                                     border:[false, false, false, true],
            //                                                                     text: '' 
            //                                                                 }
            //                                                             ]
            //                                                         ]
            //                                                     },
            //                                                     layout:{
            //                                                         ...LineColorTable(colorTabletBorder)
            //                                                     }
            //                                                 }
            //                                             ]
            //                                         ]
            //                                     },
            //                                    layout: 'noBorders'
            //                                 }
            //                             ],
            //                             [
            //                                 {
            //                                     table:{
            //                                         widths:[47, 73],
            //                                         body:[
            //                                             [
            //                                                 {
                                                                
            //                                                     border:[false, false, false, false],
            //                                                     text: 'Hora Inicio:',
            //                                                 },
            //                                                 {
            //                                                     margin:[-5,3,0,0],
            //                                                     table:{
            //                                                         widths:['*'],
            //                                                         body:[
            //                                                             [
            //                                                                 {
                                                                                
            //                                                                     border:[false, false, false, true],
            //                                                                     text: '' 
            //                                                                 }
            //                                                             ]
            //                                                         ]
            //                                                     },
            //                                                     layout:{
            //                                                         ...LineColorTable(colorTabletBorder)
            //                                                     }
            //                                                 }
            //                                             ]
            //                                         ]
            //                                     },
            //                                    layout: 'noBorders'
            //                                 }
            //                             ],
            //                             [
            //                                 {
            //                                     table:{
            //                                         widths:[45, 75],
            //                                         body:[
            //                                             [
            //                                                 {
                                                                
            //                                                     border:[false, false, false, false],
            //                                                     text: 'Hora Final:',
            //                                                 },
            //                                                 {
            //                                                     margin:[-5,3,0,0],
            //                                                     table:{
            //                                                         widths:['*'],
            //                                                         body:[
            //                                                             [
            //                                                                 {
                                                                                
            //                                                                     border:[false, false, false, true],
            //                                                                     text: '' 
            //                                                                 }
            //                                                             ]
            //                                                         ]
            //                                                     },
            //                                                     layout:{
            //                                                         ...LineColorTable(colorTabletBorder)
            //                                                     }
            //                                                 }
            //                                             ]
            //                                         ]
            //                                     },
            //                                    layout: 'noBorders'
            //                                 }
            //                             ],
            //                             [
            //                                 {
            //                                     margin:[0, 15, 0, 0],
            //                                     table:{
            //                                         widths:[48, 72],
            //                                         body:[
            //                                             [
            //                                                 {
                                                                
            //                                                     border:[false, false, false, false],
            //                                                     text: 'Facturador:',
            //                                                 },
            //                                                 {
            //                                                     margin:[-5,3,0,0],
            //                                                     table:{
            //                                                         widths:['*'],
            //                                                         body:[
            //                                                             [
            //                                                                 {
                                                                                
            //                                                                     border:[false, false, false, true],
            //                                                                     text: '' 
            //                                                                 }
            //                                                             ]
            //                                                         ]
            //                                                     },
            //                                                     layout:{
            //                                                         ...LineColorTable(colorTabletBorder)
            //                                                     }
            //                                                 }
            //                                             ]
            //                                         ]
            //                                     },
            //                                    layout: 'noBorders'
            //                                 }
            //                             ],
            //                             [
            //                                 {
            //                                     margin:[0, 15, 0, 0],
            //                                     table:{
            //                                         widths:[25, 95],
            //                                         body:[
            //                                             [
            //                                                 {
                                                                
            //                                                     border:[false, false, false, false],
            //                                                     text: 'Placa:',
            //                                                 },
            //                                                 {
            //                                                     margin:[-5,3,0,0],
            //                                                     table:{
            //                                                         widths:['*'],
            //                                                         body:[
            //                                                             [
            //                                                                 {
                                                                                
            //                                                                     border:[false, false, false, true],
            //                                                                     text: '' 
            //                                                                 }
            //                                                             ]
            //                                                         ]
            //                                                     },
            //                                                     layout:{
            //                                                         ...LineColorTable(colorTabletBorder)
            //                                                     }
            //                                                 }
            //                                             ]
            //                                         ]
            //                                     },
            //                                    layout: 'noBorders'
            //                                 }
            //                             ],
            //                         ]
            //                     },
            //                     layout: 'noBorders'
            //                 },
            //                 {
            //                     table:{
            //                         widths:['*'], 
            //                         body:[
            //                             [
            //                                 {   
                                                
            //                                     table:{
            //                                         widths:[140, 120],
            //                                         body:[
            //                                             [
            //                                                 {
            //                                                     alignment : "right",
            //                                                     margin:[0, 15, 0, 0],
            //                                                     border:[false, false, false, false],
            //                                                     text: 'N° BANDEJAS:',
            //                                                 },
            //                                                 {
            //                                                     margin:[0, 0, 0, 0],
            //                                                     table:{
            //                                                         widths:['*'],
            //                                                         body:[
            //                                                             [
            //                                                                 {
                                                                                
            //                                                                     margin:[0, 40, 0, 0],
            //                                                                     border:[true, true, true, true],
            //                                                                     text: '' 
            //                                                                 }
            //                                                             ]
            //                                                         ]
            //                                                     },
            //                                                     layout:{
            //                                                         ...LineColorTable(colorTabletBorder)
            //                                                     }
            //                                                 }
            //                                             ]
            //                                         ]
            //                                     },
            //                                    layout: 'noBorders'
            //                                 }
            //                             ],
            //                             [
            //                                 {   
                                                
            //                                     table:{
            //                                         widths:[140, 120],
            //                                         body:[
            //                                             [
            //                                                 {
            //                                                     alignment : "right",
            //                                                     margin:[0, 8, 0, 0],
            //                                                     border:[false, false, false, false],
            //                                                     text: 'N° BASES:',
            //                                                 },
            //                                                 {
            //                                                     margin:[0, 0, 0, 0],
            //                                                     table:{
            //                                                         widths:['*'],
            //                                                         body:[
            //                                                             [
            //                                                                 {
                                                                                
            //                                                                     margin:[0, 23, 0, 0],
            //                                                                     border:[true, true, true, true],
            //                                                                     text: '' 
            //                                                                 }
            //                                                             ]
            //                                                         ]
            //                                                     },
            //                                                     layout:{
            //                                                         ...LineColorTable(colorTabletBorder)
            //                                                     }
            //                                                 }
            //                                             ]
            //                                         ]
            //                                     },
            //                                    layout: 'noBorders'
            //                                 }
            //                             ],
            //                             [
            //                                 {   
                                                
            //                                     table:{
            //                                         widths:[140, 120],
            //                                         body:[
            //                                             [
            //                                                 {
            //                                                     alignment : "right",
            //                                                     margin:[0, 8, 0, 0],
            //                                                     border:[false, false, false, false],
            //                                                     text: 'SUPERVISOR:',
            //                                                 },
            //                                                 {
            //                                                     margin:[-5,11,0,0],
            //                                                     table:{
            //                                                         widths:['*'],
            //                                                         body:[
            //                                                             [
            //                                                                 {
                                                                                
            //                                                                     border:[false, false, false, true],
            //                                                                     text: '' 
            //                                                                 }
            //                                                             ]
            //                                                         ]
            //                                                     },
            //                                                     layout:{
            //                                                         ...LineColorTable(colorTabletBorder)
            //                                                     }
            //                                                 }
            //                                             ]
            //                                         ]
            //                                     },
            //                                    layout: 'noBorders'
            //                                 }
            //                             ],
            //                             [
            //                                 {   
            //                                     table:{
            //                                         widths:['*'],
            //                                         body:[
            //                                             [
            //                                                 {
            //                                                     margin:[80, 0, 0, 0],
            //                                                     alignment : "center",
            //                                                     border:[false, false, false, false],
            //                                                     text: 'OBSERVACIONES',
            //                                                 },
            //                                             ],
            //                                         ]
            //                                     },
            //                                    layout: 'noBorders'
            //                                 }
            //                             ],
            //                             [
            //                                 {   
            //                                     table:{
            //                                         widths:[80, 180],
            //                                         body:[
            //                                             [
            //                                                 {},
            //                                                 {
            //                                                     alignment : "right",
            //                                                     table:{
            //                                                         widths:['*'],
            //                                                         body:[
            //                                                             [
            //                                                                 {
            //                                                                     margin: [0, 30, 0, 0],
            //                                                                     border:[true, true, true, true],
            //                                                                     text: '' 
            //                                                                 }
            //                                                             ]
            //                                                         ]
            //                                                     },
            //                                                     layout:{
            //                                                         ...LineColorTable(colorTabletBorder)
            //                                                     }
            //                                                 }
            //                                             ],
            //                                         ]
            //                                     },
            //                                    layout: 'noBorders'
            //                                 }
            //                             ],
            //                         ]
            //                     },
            //                     layout: 'noBorders'
            //                 },
            //             ]
            //         ]
            //     },
            //     layout: 'noBorders'
            // },
            SpaceLine(5),
            // LineTest(),
        ],
        header: {
            fontSize: 7,
            text: "",
            margin: [0, 0, 0, 0],
            // table:{
            //     widths: [90, 450],
        
            //     body: [
            //         [
            //             {
            //                 margin: [10, 0, 0, 0],
            //                 text: "",
                     
            //             },
            //             {
            //                 text:title,
            //                 alignment: 'right'
            //             }
            //         ]
            //     ]
            // },
            // layout: {
            //     defaultBorder:false,
            // },
        },
    }
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const nameFile = `documento-proyecto-${uniqueSuffix}.pdf`

    const options = {};
    return {
        docDefinition,
        options,
        nameFile,
        title
    }
    
}