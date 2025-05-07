import { pdfMake } from "pdfmake/build/pdfmake";

interface LabelConfig {
    label: string;           // Texto para el label
    inicioColum: number;     // Columna de inicio para el merge
    finColum: number;        // Columna de fin para el merge
    border?: { bottom: boolean };  // Opciones de bordes, como el borde inferior
}

interface ColumnDef {
    title: string;      // Título de la columna.
    key: string;        // La clave para acceder al valor de los datos.
    total?: boolean;    // Si esta columna necesita una fila de totales.
    width?: number;     // Ancho de la columna.
    isPercentage?: boolean; // Si el valor debe mostrarse como porcentaje (opcional).
}

// Estilos para el encabezado
export const stylesPdf = {
    tableHeader: {
        bold: true,
        fontSize: 9,
        fillColor: "#FFCCE5FF"
    },
    sectionTitle: {
        fontSize: 14,
        bold: true,
        margin: [0, 5, 0, 5]
    },
    tableStyle: {
        fontSize: 9
    }
};

export const defaultStylesPdf = {
    fontSize: 8
}

// Función para crear el encabezado del PDF
export const createPdfHeader = (
    filter: string,
    title: string,
    startRow: number = 2,
    totalColumns: number = 8
) => {
    return {
        columns: [
            {}, // Espacio vacío para alinear a la derecha
            {
                width: "auto",
                stack: [
                    { text: `Página: 1 de 1`, alignment: "right" },  // Página
                    {
                        text: `Fecha de emisión: ${new Date().toLocaleString()}`,  // Fecha de emisión
                        alignment: "right",
                    },
                    {
                        text: title,  // Título del reporte
                        style: "sectionTitle",
                        alignment: "right",
                    },
                    {
                        text: filter,  // Información de la granja
                        alignment: "right",
                    },
                ],
            },
        ],
        style: "header",
    };
};

// Función para crear el encabezado de la tabla del PDF
export const createPdfTableHeaderDetail = (
    columns: ColumnDef[],
    labels?: LabelConfig[]  // Opcional para agregar etiquetas personalizadas en el encabezado
): any => {
    const boldFont = { bold: true };
    const centerAlign = { alignment: "center" };
    const fillHeader = { fillColor: "#FFCCE5FF" };

    let body: any[] = [];

    // Si hay etiquetas personalizadas, agregar la fila encima de la tabla
    if (labels) {
        labels.forEach(labelConfig => {
            const mergedCells = {
                text: labelConfig.label,
                colSpan: labelConfig.finColum - labelConfig.inicioColum + 1,
                style: "tableHeader",
                alignment: "center",
                border: [false, false, false, true] // Solo borde inferior
            };

            body.push([mergedCells]);
        });
    }

    // Ahora, crear los títulos de la tabla
    const headerTitles = columns.map(col => col.title);

    // Insertar la cabecera de la tabla
    body.push(headerTitles.map(title => ({
        text: title,
        style: "tableHeader",
        alignment: "center",
        fillColor: "#004586",  // Azul oscuro
        color: "white",        // Color del texto blanco
    })));

    return {
        table: {
            headerRows: 1,
            widths: columns.map(col => col.width ? col.width : "auto"), // Ajuste automático o el ancho especificado
            body: body
        },
        layout: {
            hLineWidth: (i: any) => (i === 0 ? 2 : 1),  // Línea gruesa solo para la primera fila
            vLineWidth: (i: any) => 1,  // Líneas verticales
            hLineColor: () => "#000000",
            vLineColor: () => "#000000",
        }
    };
};

export const createPdfTableData = (data: any[], columns: ColumnDef[]) => {
    const body: any[] = [];

    let totals: Record<string, number> = {};

    // Mapeamos los datos y agregamos las filas
    data.forEach(item => {
        const row = columns.map((col) => {
            let value = item[col.key];
            if (col.isPercentage && typeof value === "number") {
                value = `${(value * 100).toFixed(2)} %`; // Convertir a porcentaje
            }
            // Si es una columna de total, sumamos
            if (col.total) {
                totals[col.key] = (totals[col.key] || 0) + (typeof value === "number" ? value : 0);
            }
            return value;
        });
        body.push(row);
    });

    // Insertamos la fila de totales
    const totalRow = columns.map((col, i) => {
        if (i === 0) return "TOTAL:";  // Primer columna es "TOTAL"
        if (col.total) return totals[col.key] ?? "";
        return "";
    });

    body.push(totalRow); // Añadimos la fila de totales

    return {
        table: {
            body: body,
            widths: columns.map(col => col.width || "*"), // Asignamos "auto" o el ancho personalizado de las columnas
        },
        layout: "lightHorizontalLines",
    };
};

export const generatePdfTableHeaderDetail = (
    columns: ColumnDef[],
    labels: LabelConfig[]
  ): any[][] => {
    const headerRow1: any[] = [];
    const headerRow2: any[] = [];
  
    // Convertimos la columna a base-0
    for (let i = 0; i < columns.length; i++) {
      // ¿Hay una etiqueta que comience aquí?
      const label = labels.find(
        l => l.inicioColum - 1 === i
      );
  
      if (label) {
        const colSpan = label.finColum - label.inicioColum + 1;
        headerRow1.push({
          text: label.label,
          colSpan,
          style: "tableHeader",
          alignment: "center",
          fillColor: "#004586",
          color: "white"
        });
  
        // Rellenar celdas vacías para colSpan
        for (let j = 1; j < colSpan; j++) {
          headerRow1.push({});
        }
  
        // Segunda fila: columnas individuales dentro del grupo
        for (let j = label.inicioColum - 1; j < label.finColum; j++) {
          const col = columns[j];
          headerRow2.push({
            text: col.title,
            style: "tableHeader",
            alignment: "center",
            fillColor: "#004586",
            color: "white"
          });
        }
  
        // Saltar al final del label
        i = label.finColum - 1;
      } else {
        // Si no está en una agrupación, mostrar como rowSpan: 2
        const col = columns[i];
        headerRow1.push({
          text: col.title,
          rowSpan: 2,
          style: "tableHeader",
          alignment: "center",
          fillColor: "#004586",
          color: "white"
        });
        headerRow2.push({});
      }
    }
  
    return [headerRow1, headerRow2];
};

export const generatePdfTableDataAndTotals = (
    data: any[],
    columns: ColumnDef[],
    labelTotal: string = "TOTAL:",
):{ tableBody: any[][], totalRow: any[] } => {
    const totals: Record<string, number> = {};
    const body: any[][] = [];
  
    data.forEach(item => {
      const row: any[] = [];
      columns.forEach(col => {
        const value = item[col.key];
        if (col.total) {
          totals[col.key] = (totals[col.key] || 0) + (Number(value) || 0);
        }
        row.push({
          text: value ?? "",
          alignment: typeof value === "number" ? "right" : "left"
        });
      });
      body.push(row);
    });
  
    const totalRow = columns.map((col, i) => {
      if (i === 0) return { text: labelTotal, bold: true, fillColor: "#CCE5FF" };
      if (col.total) return {
        text: totals[col.key]?.toLocaleString("es-PE") ?? "",
        alignment: "right",
        bold: true,
        fillColor: "#CCE5FF"
      };
      return { text: "", fillColor: "#CCE5FF" };
    });
  
    return { tableBody: body, totalRow };
  }
  
  