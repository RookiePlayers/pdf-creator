import { PDFDocument, rgb, StandardFonts} from "pdf-lib";
import { useEffect, useState } from "react";
import Column from "./components/Column";
import { CircularProgress } from "@mui/material";

const convertHexToColorPercentage = (hex)=>{
        if(!hex) return [0,0,0];
        if(hex.length === 4){
            const r = parseInt(hex.slice(1,2), 16)/255;
            const g = parseInt(hex.slice(2,3), 16)/255;
            const b = parseInt(hex.slice(3,4), 16)/255;
            return [r, g, b];
        }
        const r = parseInt(hex.slice(1,3), 16)/255;
        const g = parseInt(hex.slice(3,5), 16)/255;
        const b = parseInt(hex.slice(5,7), 16)/255;
        return [r, g, b];
    }
const convertStringToFont = (font)=>{
        switch(font){
            case "Courier": return StandardFonts.Courier;
            case "Courier-Bold": return StandardFonts.CourierBold;
            case "Courier-Oblique": return StandardFonts.CourierOblique;
            case "Courier-BoldOblique": return StandardFonts.CourierBoldOblique;
            case "Helvetica": return StandardFonts.Helvetica;
            case "Helvetica-Bold": return StandardFonts.HelveticaBold;
            case "Helvetica-Oblique": return StandardFonts.HelveticaOblique;
            case "Helvetica-BoldOblique": return StandardFonts.HelveticaBoldOblique;
            case "Times-Roman": return StandardFonts.TimesRoman;
            case "Times-Bold": return StandardFonts.TimesRomanBold;
            case "Times-Italic": return StandardFonts.TimesRomanItalic;
            case "Times-BoldItalic": return StandardFonts.TimesRomanBoldItalic;
            default: return StandardFonts.CourierBold;
        }
    }
const drawCell = async (page, text, x, y, width, height,borderWidth,tableMargin, borderColor = rgb(0, 0, 0), color, size, font,pdf) => {
        page.drawRectangle({
          x: x,
          y: y,
          width: width,
          height: height,
          color: rgb(1, 1, 1), // White background
          borderColor: borderColor,
          borderWidth: borderWidth,
        });
        page.drawText(text, { x: x + tableMargin, y: y + tableMargin, color: color,size:size, font: await pdf.embedFont(font) });
      };
const drawGrid =  (grid, page, x, y, cellWidth, cellHeight, borderWidth, tableMargin, borderColor,pdf ) => {
      
        
        for (let i = 0; i < grid.length; i++) {
          const row = grid[i];
          let cx = 0;
          for (let j = 0; j < row.length; j++) {
            const cell = row[j];
            const text = cell.text;
            const color = convertHexToColorPercentage(cell.color);
            const size = Number(cell.size);
            const font = convertStringToFont(cell.font);
            const cw = Number(cell.cellWidth ?? cellWidth);
            const sx = cx + x;
            //
            drawCell(
              page,
              text,
              sx,
              y - i * cellHeight,
              cw,
              cellHeight,
              borderWidth,
              tableMargin,
              borderColor,
              rgb(color[0], color[1], color[2]),
              size,
              font,
              pdf
            );
            cx += (row[Math.max(0,j)]?.cellWidth??0);
          }
        }
      
    } 
  export const createPDF = async ({components,pageSetting})=>{
        
        const pdf = await PDFDocument.create();
        const page = pdf.addPage([(Number(pageSetting?.width??600)), (Number(pageSetting?.height??600))]);
        const {height} = page.getSize();
        for(const component of components){
            if(!component.data?.id) continue;
            
            switch(component.type){
                case "line":
                    const start = {x: Number((component.data.x??10)+(pageSetting?.padding??0)), y: height - Number((component.data.y??20)+(pageSetting?.padding??0))};
                    const end = {x: start.x + Number(component.data.length), y: start.y};
                    const lineColor = convertHexToColorPercentage(component.data.color);
                    const thickness = Number(component.data.strokeThickness);
                    const opacity = Number(component.data.opacity);
                    page.drawLine({
                        start,
                        end,
                        thickness,
                        color: rgb(lineColor[0], lineColor[1], lineColor[2]),
                        opacity
                    });
                break;
                case "image":
                    if(component.data.image === "") break;
                    const imageX = Number((component.data.x??0)+(pageSetting?.padding??0));
                    const imageY = height - Number((component.data.y??0)+(pageSetting?.padding??0));
                    const imageWidth = Number(component.data.width);
                    const imageHeight = Number(component.data.height);
                    let imageArrayBuffer;
                    if(typeof component.data.image === "string"){
                        const response = await fetch(component.data.image);
                        imageArrayBuffer = await response.arrayBuffer();
                    }
                    else{
                        imageArrayBuffer = await component.data.image;
                    }
                    const image = component.data?.type?.includes("png") ? await pdf.embedPng(imageArrayBuffer) : await pdf.embedJpg(imageArrayBuffer);
                    const scaled = image.scaleToFit(imageWidth, imageHeight)
                    page.drawImage(image, {
                        x: imageX,
                        y: imageY,
                        width: scaled.width,
                        height: scaled.height,
                    });
                break;
                case "table":
                    const tableX = Number((component.data.x??0)+(pageSetting?.padding??0));
                    const tableY = height - Number((component.data.y??0)+(pageSetting?.padding??0));
                    const cellWidth = Number(component.data.table.cellWidth);
                    const cellHeight = Number(component.data.table.cellHeight);
                    const borderWidth = Number(component.data.table.borderWidth);
                    const borderColor = convertHexToColorPercentage(component.data.table.borderColor);
                    const tableMargin = Number(component.data.table.tableMargin);
                    drawGrid(component.data?.table?.grid??[], page, tableX, tableY, cellWidth, cellHeight, borderWidth,  tableMargin, rgb(borderColor[0], borderColor[1], borderColor[2]),pdf);
                break;
                default: 
                    const text = component.data.text;
                    const fontSize = Number(component.data.size);
                    const font = convertStringToFont(component.data.font);
                    const x = Number((component.data.x??0)+(pageSetting?.padding??0));
                    const y = height - Number((component.data.y??0)+(pageSetting?.padding??0));
                    const color = convertHexToColorPercentage(component.data.color);
                    
                    page.drawText(text, {x, y, size:fontSize, color:rgb(color[0],color[1],color[2]), font: await pdf.embedFont(font)});
                break;
            }
        }
       
        const pdfBytes = await pdf.save();
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        return {pdfUrl, pdfBlob, pdfBytes};
        
    }   
const PDFBuilderView = ({components, pageSetting})=>{
    const [loading, setLoading] = useState(false);
    const [url, setPdfUrl] = useState("");
  
    
    const componentStrinfify = JSON.stringify(components);
    const pageSettingStrinfify = JSON.stringify(pageSetting);
    useEffect(()=>{
        if(componentStrinfify && pageSettingStrinfify){
            
            setLoading(true);
            createPDF({
                components,
                pageSetting
            }).then((pdf)=>{
                
                setLoading(false);
                setPdfUrl(pdf.pdfUrl);
            }).catch((e)=>{
                
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [componentStrinfify, pageSettingStrinfify]);
  
    
    return <Column style={{height:"100%", width:"100%"}}>
        {loading && <Column style={{alignItem: "center"}}>
            <CircularProgress/>
            <h1>Creating PDF...</h1>
        </Column>}
        {url && <iframe title="pdf" src={url} width="100%" height="100%"></iframe>}
    </Column>
}
export default PDFBuilderView;