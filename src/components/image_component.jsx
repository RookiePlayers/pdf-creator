import { IconButton, TextField } from "@mui/material"
import Row from "./Row"
import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import {UploadBox} from 'ruki-react-upload-box';
const ImageComponent = ({data,onDelete, onChange}) => {
    
    const [image, setImage] = useState(data);
    useEffect(()=>{
        if(image.image){
            if(image.image instanceof ArrayBuffer){
                setImage({...image, image: URL.createObjectURL(new Blob([image.image], {type: image.type}))});
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return <Row style={{flexWrap : "wrap"}}>
        <Row alignment="left" style={{width:"100%"}}>
            <IconButton size="small" onClick={()=>{
                onDelete();
            }}>
                <Close/>
            </IconButton>
        </Row>
        <div style={{minHeight: 200, minWidth: 200, margin: "1em"}}>
            <UploadBox image={typeof image.image === "string" ? image.image : undefined} style={{width:"100%", height:"100%"}} onUpload={
                (file)=>{
                    let newImage;
                    if(file?.type){
                        newImage = {...image, image: file.arrayBuffer(), type: file.type};
                    }else{
                        console.log(file);
                        newImage = {...image, image: file.link, type: file.link.split('.').pop()};
                    }
                   
                    setImage(newImage);
                    onChange(newImage);
                }
            
            }/>
        </div>
        <div style={{ width: '1em' }}/>
        <TextField type="text" fullWidth style={{margin:'1em'}}
            onChange={(e)=>{
                const newImage = {...image, var: (e.target.value)};
                
                setImage(newImage);
                onChange(newImage);
            }}
            value={image.var}
             label="$var(optional)" variant="outlined" size="small" />
        <Row style={{margin:'1em'}}>
            <TextField type="number"
            onChange={(e)=>{
                const newImage = {...image, x: Number(e.target.value)};
                setImage(newImage);
                onChange(newImage);
            }}
            value={image.x}
             label="x Position" variant="outlined" size="small" />
            <div style={{ width: '1em' }}/>
            <TextField type="number"
            onChange={(e)=>{
                const newImage = {...image, y: Number(e.target.value)};
                setImage(newImage);
                onChange(newImage);
            }}
            value={image.y}
             label="y Position" variant="outlined" size="small" />
        </Row>
        <Row style={{margin:'1em'}}>
            
            <TextField type="number"
            onChange={(e)=>{
                const newImage = {...image, height: Number(e.target.value)};
                setImage(newImage);
                onChange(newImage);
            }}
            value={image.height}
             label="Size" variant="outlined" size="small" />
        </Row>
       
    </Row>
}
export default ImageComponent;