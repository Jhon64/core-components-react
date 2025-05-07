// ! hancho 502 total  y sin border 507

import axios from "axios";

export const TitlePDF = (text:string, fillColor: string, color:string, fontSize: number, bold: boolean = false, alignment: "left"|"center"| "right" | "justify", margin: number[]=null) => {
    return {
        text,
        alignment,
        fillColor,
        color,
        fontSize,
        bold,
        margin
    }
}

export  const WithLineBorder = (vertial: number = 0, horizontal: number = 0) => {
    return {
        hLineWidth: function () {
            return horizontal;
        },
        vLineWidth: function () {
            return vertial;
        }
    }
} 

export  const WithLinePadding = (left: number = 0, top: number = 0, right: number = 0, bottom: number = 0) => {
  return {
      paddingLeft: function () {
          return left;
      },
      paddingRight: function () {
          return top;
      },
      paddingTop: function () {
        return right;
      },
      paddingBottom: function () {
          return bottom;
      }
  }
} 

export  const ColorLineBorder = (vertial: string = "", horizontal: string = "") => {
    return {
        hLineColor: function () {
            return horizontal;
        },
        vLineColor: function () {
            return vertial;
        }
    }
}

export const SpaceLine = (height: number) => {
  return {
    margin:[0, height, 0, 0],
    text: ''
  }
}

export const LineColorTable = (color:string) => {
  return {
    hLineColor: color, 
    vLineColor: color,
  }
}

export const LineTest = () => {
  return {
    table: {
        widths:['*'],
        body: [
            [
               {
                   fillColor: "#ff0000",
                   text: '' 
               } 
            ]
        ]
    },
    layout: {
        defaultBorder: false,
    }
  }
}

export const base64_encode = async (ruta: string): Promise<string> => {
    try {
      // Obtener la ruta completa de la imagen dentro de la carpeta public
      const rutaCompleta = ''//import.meta.env.VITE_BASE_URL + ruta;
      // Verificar la extensión del archivo
      const extension = ruta.split('.').pop()?.toLowerCase();
      let responseType: "blob" | "text" = 'blob';
      if (extension === 'svg') {
        // Si la extensión es SVG, configurar responseType como 'text'
        responseType = 'text';
      }
      const response = await axios.get(rutaCompleta, {
        headers: {
          'Access-Control-Allow-Origin': '*', // Puedes ajustar esto según tus necesidades
        },
        responseType, // Indicar que esperamos un blob como respuesta
      });
  
      // Convertir la imagen a base64 dependiendo de la extensión
  
      if (extension === 'svg') {
        return await convertirTextToBase64(response.data)
      } else {
        return await convertirBlobToBase64(response.data);
      }
  
  
    } catch (error) {
      console.error('Error al cargar la imagen:', error);
      throw error;
    }
  };
  
  const convertirBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          resolve(reader.result);
        }
      };
      reader.readAsDataURL(blob);
    });
  };
  
  const convertirTextToBase64 = (text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const base64String = `data:image/svg+xml;base64,${btoa(text)}`;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const newBase64ToString = canvas.toDataURL('image/png');
            resolve(newBase64ToString);
          }
        };
        img.src = base64String;
        
      } catch (error) {
        reject(error);
      }
    });
  };

  export const formatearFechaHora = (fechaString: string="", formato: "fecha"| "hora" | "fecha hora"= "fecha", format: string= 'dd-mm-yyyy', custom: boolean = false): string =>  {
    try {
      
      const opcionesFecha: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const opcionesHora: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    
      if((fechaString|| "").length == 0) return "";
      let fechaStringAux = fechaString
      if(fechaStringAux.includes("/")) fechaStringAux = fechaStringAux.replace("/", "-");
     
      if(custom){
        const dateString = fechaStringAux;
        const [day, month, year] = dateString.split('-');
        fechaStringAux = `${year}-${month}-${day}`;
      }

      const fecha = new Date(fechaStringAux);
    
      let fechaFormateada = '';
      let horaFormateada = '';
    
      if (formato.includes('fecha')) {
          fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha).replace(/\//g, '-');
      }
    
      if(format && format === 'yyyy-mm-dd'){
        let partesFecha: string[] = fechaFormateada.split('-');
        let nuevaFechaFormateada: string = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;
        fechaFormateada= nuevaFechaFormateada
      }
    
      if (formato.includes('hora')) {
          horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora);
      }
    
      if (formato.includes('fecha') && formato.includes('hora')) {
          return `${fechaFormateada} ${horaFormateada}`;
      } else if (formato.includes('fecha')) {
          return fechaFormateada;
      } else if (formato.includes('hora')) {
          return horaFormateada;
      }
    
      return '';
    } catch (error) {
      console.log(error); 
      return ''; 
    }
  }
  

  