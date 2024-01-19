import {createPDF} from "ruki-react-pdf-creator";
import { useEffect, useState } from "react";
import Column from "./components/Column";
import { CircularProgress } from "@mui/material";
 
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
        {loading ? <Column style={{alignItem: "center"}}>
            <CircularProgress/>
            <h1>Creating PDF...</h1>
        </Column> :
        url && <iframe title="pdf" src={url} width="100%" height="100%"></iframe>}
    </Column>
}
export default PDFBuilderView;