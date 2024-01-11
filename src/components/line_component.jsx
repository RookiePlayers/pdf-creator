import { Card, CardContent, FormControl, IconButton, InputLabel, Menu, MenuItem, Select, Slider, TextField, Typography } from "@mui/material"
import Row from "./Row"
import { useState } from "react";
import { StandardFonts } from "pdf-lib";
import { Close, ColorLens } from "@mui/icons-material";
import { CirclePicker } from "react-color";
import Column from "./Column";

const LineComponent = ({data, id, onDelete, onChange}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const [line, setLine] = useState(data);
    return <Row style={{flexWrap : "wrap"}}>
        <Row alignment="left" style={{width:"100%"}}>
            <IconButton size="small" onClick={()=>{
                onDelete();
            }}>
                <Close/>
            </IconButton>
        </Row>
        
        <Row style={{margin:'1em'}}>
            <TextField type="number"
            onChange={(e)=>{
                const newText = {...line, strokeThickness: Number(e.target.value)};
                setLine(newText);
                onChange(newText);
            }}
            value={line.strokeThickness}
            defaultValue={line.strokeThickness} label="Thickness" variant="outlined" size="small" />
            <div style={{ width: '1em' }}/>
            <TextField type="number"
            onChange={(e)=>{
                const newText = {...line, length: Number(e.target.value)};
                setLine(newText);
                onChange(newText);
            }}
            value={line.length}
            defaultValue={line.length} label="Length" variant="outlined" size="small" />
        </Row>
        <div style={{ width: '1em' }}/>
        <Column style={{width:"100%", padding: 20}}>
            <Typography>Opacity</Typography>
            <div style={{ width: '0.2em' }}/>
            <Slider 
            min={0} max={1} step={0.1}
            defaultValue={line.opacity} value={line.opacity} onChange={(e, v)=>{
                    const newText = {...line, opacity: v};
                    setLine(newText);
                    onChange(newText);
                }}/>
        </Column>
        <div style={{ width: '1em' }}/>
        <Row style={{margin:'1em'}}>
            <TextField type="number"
            onChange={(e)=>{
                const newText = {...line, x: Number(e.target.value)};
                setLine(newText);
                onChange(newText);
            }}
            value={line.x}
            defaultValue={line.x} label="x Position" variant="outlined" size="small" />
            <div style={{ width: '1em' }}/>
            <TextField type="number"
            onChange={(e)=>{
                const newText = {...line, y: Number(e.target.value)};
                setLine(newText);
                onChange(newText);
            }}
            value={line.y}
            defaultValue={line.y} label="y Position" variant="outlined" size="small" />
        </Row>
        <TextField
            id="demo-positioned-button"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            fullWidth
            value={line.color}
            onChange={(e)=>{
                if(e.target.value.length !== 7 && e.target.value.length !== 7){
                    return;
                }
                const newText = {...line, color: e.target.value};
                setLine(newText);
                onChange(newText);

            }}
            style={{margin:'1em'}}
            InputProps={{
            startAdornment:(
                <div onClick={handleClick} style={{width:'20px',height: 20,cursor: 'pointer', backgroundColor: line.color, borderRadius: 4, marginRight:'6px', border: '1px solid lightgrey'}}/>
            ),
            endAdornment: (
                <IconButton
                aria-label="pick color of text"
                edge="end"
                onClick={handleClick}
                >
                <ColorLens/>
                </IconButton>
            ),
            
            }}
        />
        <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Card variant="outlined" style={{border: "none", background: 'transparent'}}>
        <CardContent>
        <CirclePicker onChange={
            (color)=>{
                console.log(color);
                const newText = {...line, color: color.hex};
                setLine(newText);
                onChange(newText);
                handleClose();
            }
        } />
        </CardContent>
        </Card>
      </Menu>
    </Row>
}
export default LineComponent;