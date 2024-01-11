import { Card, CardContent, FormControl, IconButton, InputLabel, Menu, MenuItem, Select, TextField } from "@mui/material"
import Row from "./Row"
import { useState } from "react";
import { StandardFonts } from "pdf-lib";
import { Close, ColorLens } from "@mui/icons-material";
import { CirclePicker } from "react-color";
import {UploadBox} from 'ruki-react-upload-box';
const ImageComponent = ({data,id, onDelete, onChange}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    console.log("DATA: ", data?.id);
    const [image, setImage] = useState(data);
    return <Row style={{flexWrap : "wrap"}}>
        <Row alignment="left" style={{width:"100%"}}>
            <IconButton size="small" onClick={()=>{
                onDelete();
            }}>
                <Close/>
            </IconButton>
        </Row>
        <div style={{height: image.height, width: image.width}}>
            <UploadBox style={{width:"100%", height:"100%"}} onUpload={
                (file)=>{
                    let newImage;
                    if(file?.type){
                        newImage = {...image, image: file.arrayBuffer(), type: file.type};
                    }else{
                        newImage = {...image, image: file.link, type: file.link.split('.').pop()};
                    }
                   
                    setImage(newImage);
                    onChange(newImage);
                }
            
            }/>
        </div>
        <div style={{ width: '1em' }}/>
        <Row style={{margin:'1em'}}>
            <TextField type="number"
            onChange={(e)=>{
                const newImage = {...image, x: Number(e.target.value)};
                setImage(newImage);
                onChange(newImage);
            }}
            value={image.x}
            defaultValue={image.x} label="x Position" variant="outlined" size="small" />
            <div style={{ width: '1em' }}/>
            <TextField type="number"
            onChange={(e)=>{
                const newImage = {...image, y: Number(e.target.value)};
                setImage(newImage);
                onChange(newImage);
            }}
            value={image.y}
            defaultValue={image.y} label="y Position" variant="outlined" size="small" />
        </Row>
        <Row style={{margin:'1em'}}>
            <TextField type="number"
            onChange={(e)=>{
                const newImage = {...image, width: Number(e.target.value)};
                console.log("NEW IMAGE: ", newImage);
                setImage(newImage);
                onChange(newImage);
            }}
            value={image.width}
            defaultValue={image.width} label="Width" variant="outlined" size="small" />
            <div style={{ width: '1em' }}/>
            <TextField type="number"
            onChange={(e)=>{
                const newImage = {...image, height: Number(e.target.value)};
                setImage(newImage);
                onChange(newImage);
            }}
            value={image.height}
            defaultValue={image.height} label="height" variant="outlined" size="small" />
        </Row>
       
    </Row>
}
export default ImageComponent;