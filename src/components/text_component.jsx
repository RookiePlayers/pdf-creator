import { Card, CardContent, FormControl, IconButton, InputLabel, Menu, MenuItem, Select, TextField } from "@mui/material"
import Row from "./Row"
import { useState } from "react";
import { StandardFonts } from "pdf-lib";
import { Close, ColorLens } from "@mui/icons-material";
import { CirclePicker } from "react-color";

const TextComponent = ({data, id, onDelete, onChange}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const [text, setText] = useState(data);
    const handleChange = (event) => {
        const newText = {...text, font: event.target.value};
        setText(newText);
        onChange(newText);
      };
    return <Row style={{flexWrap : "wrap"}}>
        <Row alignment="left" style={{width:"100%"}}>
            <IconButton size="small" onClick={()=>{
                onDelete();
            }}>
                <Close/>
            </IconButton>
        </Row>
        <div style={{ width: '1em',height: '1em' }}/>
        <TextField 
        onChange={(e)=>{
            const newText = {...text, text: (e.target.value)};
            setText(newText);
            onChange(newText);
        }}
        value={text.text}
         fullWidth label="Text" variant="outlined" size="small" />
        <div style={{ width: '1em',height: '1em' }}/>
        <TextField type="number"
        onChange={(e)=>{
            const newText = {...text, size: Number(e.target.value)};
            setText(newText);
            onChange(newText);
        }}
        value={text.size}
         fullWidth label="Fontsize" variant="outlined" size="small" />
        <div style={{ width: '1em' }}/>
        <Row style={{margin:'1em'}}>
            <TextField type="number"
            onChange={(e)=>{
                const newText = {...text, x: Number(e.target.value)};
                setText(newText);
                onChange(newText);
            }}
            value={text.x}
             label="x Position" variant="outlined" size="small" />
            <div style={{ width: '1em' }}/>
            <TextField type="number"
            onChange={(e)=>{
                const newText = {...text, y: Number(e.target.value)};
                setText(newText);
                onChange(newText);
            }}
            value={text.y}
             label="y Position" variant="outlined" size="small" />
        </Row>
        <FormControl style={{margin:'1em'}} fullWidth>
        <InputLabel defaultValue={text.text} id="demo-simple-select-label">Font</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={text.font}
            label="Font"
            onChange={handleChange}
        >
            {Object.keys(StandardFonts).map((font, i) => {
                return <MenuItem key={i} value={StandardFonts[font]}>{font}</MenuItem>
            })}
        </Select>
        </FormControl>
        <TextField
            id="demo-positioned-button"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            fullWidth
            value={text.color}
            onChange={(e)=>{
                if(e.target.value.length !== 7 && e.target.value.length !== 7){
                    return;
                }
                const newText = {...text, color: e.target.value};
                setText(newText);
                onChange(newText);

            }}
            style={{margin:'1em'}}
            InputProps={{
            startAdornment:(
                <div onClick={handleClick} style={{width:'20px',height: 20,cursor: 'pointer', backgroundColor: text.color, borderRadius: 4, marginRight:'6px', border: '1px solid lightgrey'}}/>
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
                
                const newText = {...text, color: color.hex};
                setText(newText);
                onChange(newText);
                handleClose();
            }
        } />
        </CardContent>
        </Card>
      </Menu>
    </Row>
}
export default TextComponent;