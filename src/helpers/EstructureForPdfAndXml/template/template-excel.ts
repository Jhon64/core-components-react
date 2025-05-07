import * as Excel from "exceljs";
import { Alignment, Border, Fill, Font } from "../../structureXMLComponents";

export interface ColumnDef {
    title: string;      // Título de la columna.
    key: string;        // La clave para acceder al valor de los datos.
    total?: boolean;    // Si esta columna necesita una fila de totales.
    width?: number;     // Ancho de la columna.
    isPercentage?: boolean; // Si el valor debe mostrarse como porcentaje (opcional).
    bold?: boolean; // Si el texto debe ser negrita (opcional).
}

export interface LabelConfig {
    label: string;           // Texto para el label
    inicioColum: number;     // Columna de inicio para el merge
    finColum: number;        // Columna de fin para el merge
    border?: { bottom: boolean };  // Opciones de bordes, como el borde inferior
}

export const createExcelHeader = (
    worksheet: Excel.Worksheet,
    filter: string,
    title: string,
    startRow: number = 2,
    totalColumns: number = 8
): number => {
    const rightAlign = Alignment({ horizontal: "right", vertical: "middle" });
    const titleFont = Font({ bold: true, size: 16, fgColor: "FF000000" });
    const borderThin = Border({ bottom: true, fgColor: "FF000000" });

    // Calcula la última columna dinámica
    const lastColIndex = totalColumns;
    const lastCol = worksheet.getColumn(lastColIndex).letter || "H";

    // Hacer merge de 3 celdas para "Página", "Fecha", "Título"
    const mergedStartCol = worksheet.getColumn(lastColIndex - 2).letter; // 2 columnas atrás
    const mergedEndCol = lastCol;

    worksheet.mergeCells(`${mergedStartCol}${startRow}:${mergedEndCol}${startRow}`);
    worksheet.getCell(`${mergedStartCol}${startRow}`).value = "Página: 1 de 1";
    worksheet.getCell(`${mergedStartCol}${startRow}`).alignment = rightAlign;

    worksheet.mergeCells(`${mergedStartCol}${startRow + 1}:${mergedEndCol}${startRow + 1}`);
    worksheet.getCell(`${mergedStartCol}${startRow + 1}`).value = `Fecha de emisión: ${new Date().toLocaleString()}`;
    worksheet.getCell(`${mergedStartCol}${startRow + 1}`).alignment = rightAlign;

    worksheet.mergeCells(`${mergedStartCol}${startRow + 2}:${mergedEndCol}${startRow + 2}`);
    worksheet.getCell(`${mergedStartCol}${startRow + 2}`).value = title;
    worksheet.getCell(`${mergedStartCol}${startRow + 2}`).font = titleFont;
    worksheet.getCell(`${mergedStartCol}${startRow + 2}`).alignment = rightAlign;

    // Usar solo 2 columnas para el merge en "filter"
    const mergedStartColFilter = worksheet.getColumn(lastColIndex - 1).letter; // 1 columna atrás para "filter"
    const mergedEndColFilter = worksheet.getColumn(lastColIndex).letter; // Última columna para "filter"

    worksheet.mergeCells(`${mergedStartColFilter}${startRow + 3}:${mergedEndColFilter}${startRow + 3}`);
    worksheet.getCell(`${mergedStartColFilter}${startRow + 3}`).value = filter;
    worksheet.getCell(`${mergedStartColFilter}${startRow + 3}`).alignment = rightAlign;
    worksheet.getCell(`${mergedStartColFilter}${startRow + 3}`).border = borderThin;

    return startRow + 5; // Devuelve la siguiente fila disponible
};


export const createExcelTableHeader = (
    worksheet: Excel.Worksheet,
    columns: ColumnDef[],
    startRow: number
): number => {
    const boldFont = Font({ bold: true, fgColor: "FF000000" });
    const centerAlign = Alignment({ horizontal: "center", vertical: "middle" });
    const borderThin = Border({ top: true, fgColor: "FF000000" });
    const fillHeader = Fill({ fgColor: "FFCCE5FF" });

    // Crea los títulos del encabezado de la tabla
    const headerTitles = columns.map(col => col.title);

    worksheet.insertRow(startRow, headerTitles);

    const headerRow = worksheet.getRow(startRow);
    headerRow.eachCell((cell, colNumber) => {
        cell.font = boldFont;
        cell.alignment = centerAlign;
        cell.fill = fillHeader;
        cell.border = borderThin;

        // Ajuste de ancho de columna si se especifica en las columnas
        const width = columns[colNumber - 1].width;
        if (width) worksheet.getColumn(colNumber).width = width;
    });

    return startRow + 1;  // Regresa la siguiente fila disponible después de insertar el encabezado
};



export const createExcelTableDataAndTotals = (
    worksheet: Excel.Worksheet,
    data: any[],
    columns: ColumnDef[],
    startRow: number,
    labelTotal: string = "TOTAL:",
    startColumn: number = 1  // Nuevo parámetro startColumn
): { totals: Record<string, number>; endRow: number } => {
    const boldFont = Font({ bold: true, fgColor: "FF000000" });
    const centerAlign = Alignment({ horizontal: "center", vertical: "middle" });
    const borderThin = Border({ bottom: true, fgColor: "FF000000" });
    const fillHeader = Fill({ fgColor: "FFCCE5FF" });

    const totals: Record<string, number> = {};
    let currentRow = startRow;

    // Insertar los datos
    data.forEach(item => {
        const row = columns.map((col, idx) => {
            const val = item[col.key];
            if (col.total) {
                totals[col.key] = (totals[col.key] || 0) + (typeof val === "number" ? val : 0);
            }

            // Si la columna es un porcentaje, aplicamos el formato
            if (col.isPercentage && typeof val === "number") {
                return `${(val * 100).toFixed(2)} %`; // Convertir a porcentaje
            }
            return val; // Si no es porcentaje, solo retornamos el valor normal
        });
        worksheet.insertRow(currentRow, row);
        const excelRow = worksheet.getRow(currentRow);

        // Aplicar estilos por columna (bold por ahora)
        excelRow.eachCell((cell, colNumber) => {
            const colIndex = colNumber - 1; // colNumber empieza en 1
            const colDef = columns[colIndex];

            if (colDef?.bold) {
                cell.font = boldFont;
            }

            // Puedes aplicar más estilos aquí si lo deseas (alineación, borders, etc.)
        });

        currentRow++;

    });

    // Insertar la fila de totales
    const totalRow = columns.map((col, i) => {
        if (i === 0) return labelTotal;
        if (col.total) return totals[col.key] ?? "";
        return "";
    });

    worksheet.insertRow(currentRow, totalRow);
    const totalExcelRow = worksheet.getRow(currentRow);
    totalExcelRow.eachCell(cell => {
        cell.font = boldFont;
        cell.alignment = centerAlign;
        cell.fill = fillHeader;
        cell.border = borderThin;
    });

    // Ajuste del ancho de columna, con startColumn
    columns.forEach((col, index) => {
        const colIndex = startColumn + index;  // Calcular la columna real para cada campo
        const width = col.width || 15;  // Asigna un valor por defecto si no se define el ancho
        worksheet.getColumn(colIndex).width = width;
    });

    return { totals, endRow: currentRow + 1 }; // Devuelve los totales y la siguiente fila disponible
};


export const createExcelTableHeaderDetail = (
    worksheet: Excel.Worksheet,
    columns: ColumnDef[],
    startRow: number,
    labels?: LabelConfig[]  // Nuevo parámetro opcional para los labels
): number => {
    const boldFont = Font({ bold: true, fgColor: "FF000000" });
    const centerAlign = Alignment({ horizontal: "center", vertical: "middle" });
    const borderThin = Border({ top: true, fgColor: "FF000000" });
    const fillHeader = Fill({ fgColor: "FFCCE5FF" });

    // Si se pasan los labels personalizados, insertarlos primero
    if (labels) {

        // Aplicar el fondo y borde superior desde la primera hasta la última columna sin usar merge
        const lastColIndex = columns.length; // Última columna
        const firstCol = worksheet.getColumn(1).letter; // Letra de la primera columna
        const lastCol = worksheet.getColumn(lastColIndex).letter || "H"; // Letra de la última columna

        // Aplicar color de fondo y borde superior para todas las celdas de la primera fila
        for (let colIndex = 1; colIndex <= lastColIndex; colIndex++) {
            const cell = worksheet.getCell(`${worksheet.getColumn(colIndex).letter}${startRow}`);
            cell.fill = fillHeader;  // Aplica color de fondo
            cell.border = borderThin;  // Aplica borde superior
        }

        labels.forEach(labelConfig => {
            worksheet.mergeCells(
                `${worksheet.getColumn(labelConfig.inicioColum).letter}${startRow}:${worksheet.getColumn(labelConfig.finColum).letter}${startRow}`
            );
            worksheet.getCell(`${worksheet.getColumn(labelConfig.inicioColum).letter}${startRow}`).value = labelConfig.label;
            worksheet.getCell(`${worksheet.getColumn(labelConfig.inicioColum).letter}${startRow}`).alignment = centerAlign;
            worksheet.getCell(`${worksheet.getColumn(labelConfig.inicioColum).letter}${startRow}`).font = boldFont;

            // Si se pasa un borde, agregarlo al label (aplicar antes de aplicar el borde superior a toda la fila)
            if (labelConfig.border?.bottom) {
                worksheet.getCell(`${worksheet.getColumn(labelConfig.inicioColum).letter}${startRow}`).border = Border({ bottom: true, top: true, fgColor: "FF000000" });
            }
        });

        worksheet.getRow(startRow).height = 30;

        startRow++; // Avanzamos a la siguiente fila después de los labels
    }

    // Crear los títulos del encabezado de la tabla
    const headerTitles = columns.map(col => col.title);

    // Insertar la fila de encabezado
    worksheet.insertRow(startRow, headerTitles);

    const headerRow = worksheet.getRow(startRow);
    headerRow.eachCell((cell, colNumber) => {
        cell.font = boldFont;
        cell.alignment = centerAlign;
        cell.fill = fillHeader;

        // Ajuste de ancho de columna si se especifica en las columnas
        const width = columns[colNumber - 1].width;
        if (width) worksheet.getColumn(colNumber).width = width;
    });

    return startRow + 1;  // Devuelve la siguiente fila disponible después de insertar el encabezado
};