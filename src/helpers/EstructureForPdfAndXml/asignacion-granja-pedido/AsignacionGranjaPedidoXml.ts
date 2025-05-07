import * as Excel from "exceljs";
import { ExportExcel } from "../../ExportExcel";
import { Alignment, Border, Fill, Font } from "../../structureXMLComponents";
import { base64_encode } from "../../structurePDFComponents";
// import { IOrderPedidoCliente } from "../../../models/interfaces/services/IOrderPedidoClienteService";
import { DateHelper } from "../../datetime.helper";



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

const abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export const AsignacionGranjaPedidoXml = async(data:any[]) => {
    // console.log(dataAux);
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Consolidado Pedido Tipo");
    const imgLogo = await base64_encode( '/assets/media-pdf/elrocio/logo.png')
    // Agrega filas vacías para desplazar el encabezado a la fila 5
    worksheet.addRow([]); // Fila 1
    worksheet.addRow([]); // Fila 2
    worksheet.addRow([]); // Fila 3
    worksheet.addRow([]); // Fila 4

     // Elimina todas las filas existentes
    const colorAzul = "FF43708B";
    const colorTabletBorder = "FFB3B4AE"

    abc.map((dt)=> {
        for (let index = 1; index < 100; index++) {
            const cell = worksheet.getCell(`${dt}${index}`);
            cell.border = Border({ left: true, right: true, top: true, bottom: true});
        }
    })
    let row = 2;
    // ! start cabecera
    
    worksheet.getCell(`B${row}`).value = `Impreso: ${getHout()}`;
    let cell = worksheet.getCell(`B${row}`);
    cell.font = Font({ bold: true, fgColor: colorAzul});

    worksheet.getCell(`F${row}`).value = "RESUMEN ZONA";
    worksheet.mergeCells(`F${row}:G${row}`);
    cell = worksheet.getCell(`F${row}`);
    cell.font = Font({ bold: true, fgColor: colorAzul, size: 15});
    cell.alignment = Alignment({horizontal: "center", vertical:"middle" });

    row++;
    // worksheet.getCell(`G${row}`).value = "TARA: 2.60 KGS";
    // worksheet.getCell(`G${row}`).value = "";
    // cell = worksheet.getCell(`G${row}`);
    // cell.font = Font({ bold: true, fgColor: colorAzul});

    worksheet.getCell(`M${row}`).value = getDate();
    cell = worksheet.getCell(`M${row}`);
    cell.font = Font({ bold: true, fgColor: colorAzul});
    
    // ! end cabecera
    

    if (imgLogo) {
        worksheet.mergeCells(`K${row}:L${row}`);
        const imageId = workbook.addImage({
          base64: imgLogo as string,
          extension: 'png' // Cambiar si la extensión es diferente
        });
  
        // Posicionar la imagen en la hoja
        worksheet.addImage(imageId, {
          tl: { col: 11, row: 0 }, // Top-left corner
          ext: { width: 120, height: 44 } // Tamaño de la imagen
        });
    }

    row++;
    const letterColumnsHeader = [
        {id: 1, name: "FECHA", letter: "B", size: 10},
        {id: 2, name: "ZONA", letter: "C", size: 12},
        {id: 3, name: "CLIENTE. ", letter: "D", size: 25},
        {id: 4, name: "DIRECCIÓN", letter: "E", size: 25},
        {id: 5, name: "CAMAL", letter: "F", size: 13},
        {id: 6, name: "SUBCLIENTE", letter: "G", size: 25},
        {id: 7, name: "VENDEDOR", letter: "H", size: 20},
        {id: 8, name: "PRODUCTO", letter: "I", size: 25},
        {id: 9, name: "FORMATO", letter: "J", size: 25},
        {id: 10, name: "JABAS", letter: "K", size: 10},
        {id: 11, name: "POLLOS", letter: "L", size: 10},
        {id: 12, name: "KILOS", letter: "M", size: 10},
        {id: 13, name: "MONTO", letter: "N", size: 10},
    ];
    

    letterColumnsHeader.map((dt)=> {
        worksheet.getCell(`${dt.letter}${row}`).value = dt.name;
        worksheet.getColumn(dt.letter).width = dt.size; // !HANCHO DE LA COLUMA
        const cell = worksheet.getCell(`${dt.letter}${row}`);
        cell.fill = Fill({});
        cell.font = Font({ bold: true, fgColor: colorAzul});
        cell.alignment = Alignment({horizontal: "center", vertical:"middle" });
        cell.border = Border({ fgColor: colorTabletBorder, left: true, right: true, top: true, bottom: true});
        
    })

    row++;

    data.map((dt)=> {
        
        worksheet.getCell(`B${row}`).value = DateHelper.parseIsoStringToFormat(1, dt.pedidoVenta.fechaDocumento);
        worksheet.getCell(`C${row}`).value = dt?.pedidoVenta?.zona?.nombre;
        worksheet.getCell(`D${row}`).value = dt?.pedidoVenta?.cliente?.nombre;
        worksheet.getCell(`E${row}`).value = `${dt?.pedidoVenta?.cliente?.direccionCliente}`, 
        worksheet.getCell(`F${row}`).value = dt?.pedidoVenta?.camal?.descripcion;
        worksheet.getCell(`G${row}`).value = dt?.pedidoVenta?.subCliente;
        worksheet.getCell(`H${row}`).value = dt?.pedidoVenta?.vendedor?.nombre;
        worksheet.getCell(`I${row}`).value = `${dt?.codigoMaterial} - ${dt?.descripcionMaterial}` , 
        worksheet.getCell(`J${row}`).value = `(${dt?.unidadPorJaba}) Unid. X (${dt?.numeroJabas}) Jabas` , 
        worksheet.getCell(`K${row}`).value = dt.numeroJabas;
        worksheet.getCell(`L${row}`).value = dt.cantidadPollos;
        worksheet.getCell(`M${row}`).value = dt.kilosVendidos;
        worksheet.getCell(`N${row}`).value = dt.subtTotal1;

        letterColumnsHeader.map((dt)=> {
            // worksheet.getColumn(dt.letter).width = dt.size; // !HANCHO DE LA COLUMA
            const cell = worksheet.getCell(`${dt.letter}${row}`);
            cell.fill = Fill({});
            cell.font = Font({fgColor: "00000000"});
            cell.alignment = Alignment({horizontal: "center", vertical:"middle" });
            cell.border = Border({ fgColor: colorTabletBorder, left: true, right: true, top: true, bottom: true});
        })
        row++;
    })

    let rowFooter = row + 6;

    // ! start footer
    // worksheet.getCell(`F${rowFooter}`).value = "DATOS";
    // cell = worksheet.getCell(`F${rowFooter}`);
    // worksheet.mergeCells(`F${rowFooter}:G${rowFooter}`);
    // cell.font = Font({ bold: true, fgColor: '00000000'});
    // cell.alignment = Alignment({horizontal: "center", vertical:"middle" });
    
    // rowFooter++;
    // worksheet.getCell(`F${rowFooter}`).value = "Balanza: ________________";

    // rowFooter++;
    // worksheet.getCell(`F${rowFooter}`).value = "Pesador: ________________";

    // rowFooter++;
    // worksheet.getCell(`F${rowFooter}`).value = "Abastecedor: ________________";

    // rowFooter++;
    // worksheet.getCell(`F${rowFooter}`).value = "Hora Inicio: ________________";

    // rowFooter++;
    // worksheet.getCell(`F${rowFooter}`).value = "Hora Final: ________________";

    // rowFooter++;
    // worksheet.getCell(`F${rowFooter}`).value = "Facturador: ________________";

    // rowFooter++;
    // worksheet.getCell(`F${rowFooter}`).value = "Placa: ________________";
    

    // rowFooter = row + 5;
    // worksheet.getCell(`J${rowFooter}`).value = "N° BANDEJAS: ";
    // worksheet.mergeCells(`J${rowFooter}:K${rowFooter}`);

    // worksheet.mergeCells(`L${rowFooter-1}:N${rowFooter+1}`);
    // cell = worksheet.getCell(`L${rowFooter-1}`);
    // cell.border = Border({ fgColor: colorTabletBorder, left: true, right: true, top: true, bottom: true});


    // rowFooter = rowFooter + 4;
    // worksheet.getCell(`J${rowFooter}`).value = "N° BASES: ";
    // worksheet.mergeCells(`J${rowFooter}:K${rowFooter}`);

    // worksheet.mergeCells(`L${rowFooter-1}:N${rowFooter+1}`);
    // cell = worksheet.getCell(`L${rowFooter-1}`);
    // cell.border = Border({ fgColor: colorTabletBorder, left: true, right: true, top: true, bottom: true});
    
    // rowFooter = rowFooter + 3;
    // worksheet.getCell(`J${rowFooter}`).value = "SUPERVISOR: _____________________________";
    
    // rowFooter = rowFooter + 2;
    // worksheet.getCell(`L${rowFooter}`).value = "OBSERVACIONES";
    // worksheet.mergeCells(`L${rowFooter}:M${rowFooter}`);

    // rowFooter = rowFooter + 2;
    // worksheet.mergeCells(`K${rowFooter-1}:N${rowFooter+1}`);
    // cell = worksheet.getCell(`K${rowFooter-1}`);
    // cell.border = Border({ fgColor: colorTabletBorder, left: true, right: true, top: true, bottom: true});
    // ! end footer


    // Guarda el archivo en el sistema de archivos
    return await ExportExcel(workbook);
}
