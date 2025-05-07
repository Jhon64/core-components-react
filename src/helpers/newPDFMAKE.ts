
import pdfMake from 'pdfmake/build/pdfmake';
import { saveAs } from 'file-saver';
const ruta = ''//import.meta.env.VITE_BASE_URL

export const newPDFMAKE = async (resFile: { title: string, nameFile: string, options: any, docDefinition: any }, type: "download" | "open" | "auto-download") => {
  let fonts = {
    Roboto: {
      normal: ruta + '/assets/fonts/roboto/Roboto-Regular.ttf',
      bold: ruta + '/assets/fonts/roboto/Roboto-Bold.ttf',
      italics: ruta + '/assets/fonts/roboto/Roboto-Italic.ttf',
      bolditalics: ruta + '/assets/fonts/roboto/Roboto-BoldItalic.ttf'
    }
  }

  pdfMake.fonts = fonts
  const newRes = { title: resFile?.title, fileName: resFile?.nameFile }

  const pdfCreate = pdfMake.createPdf(resFile?.docDefinition)
  if (type == "open") pdfCreate.open();
  else if (type == "download") pdfCreate.download(newRes.fileName);
  else if (type == "auto-download") pdfCreate.getBlob(async (blob) => {
    saveAs(blob, '/storage/' + resFile.nameFile);
  });

  return resFile.nameFile;

}
