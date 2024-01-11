import { Card, CardContent, IconButton, Menu, TextField } from "@mui/material";
import Row from "./Row";
import { useState } from "react";
import { Close, ColorLens } from "@mui/icons-material";
import { CirclePicker } from "react-color";
import Table from "./table";

const TableComponent = ({data,id, onDelete, onChange}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const _buildTable = ()=>{
        return <Table 
        cellHeight={table.table.cellHeight}
        cellWidth={table.table.cellWidth}
        borderColor={table.table.borderColor}
        onDataChange={(data)=>{
            table.table.grid = data;
            onChange(table);
            setTable({...table});

        }}
        table={
            table.table?.grid??[]
        } />
     }
    const [table, setTable] = useState(data);

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
                const newText = {...table, x: Number(e.target.value)};
                setTable(newText);
                onChange(newText);
            }}
            value={table.x}
             label="x Position" variant="outlined" size="small" />
            <div style={{ width: '1em' }}/>
            <TextField type="number"
            onChange={(e)=>{
                const newText = {...table, y: Number(e.target.value)};
                setTable(newText);
                onChange(newText);
            }}
            value={table.y}
             label="y Position" variant="outlined" size="small" />
        </Row>
        <Row style={{margin:'1em'}}>
            <TextField type="number"
            onChange={(e)=>{
                table.table.cellWidth = Number(e.target.value);
                setTable({...table});
                onChange(table);
            }}
            value={table.table.cellWidth}
             label="Cell Width" variant="outlined" size="small" />
            <div style={{ width: '1em' }}/>
            <TextField type="number"
            onChange={(e)=>{
                table.table.cellHeight = Number(e.target.value);
                setTable({...table});
                onChange(table);
            }}
            value={table.table.cellHeight}
             label="Cell Height" variant="outlined" size="small" />
        </Row>
        <div style={{ width: '1em' }}/>
             
        <TextField
            id="demo-positioned-button"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            fullWidth
            value={table.table.borderColor}
            onChange={(e)=>{
                if(e.target.value.length !== 7 && e.target.value.length !== 7){
                    return;
                }
                table.table.borderColor = e.target.value;
                setTable({...table});
                onChange(table);
            }}
            style={{margin:'1em'}}
            InputProps={{
            startAdornment:(
                <div onClick={handleClick} style={{width:'20px',height: 20,cursor: 'pointer', backgroundColor: table.table.borderColor, borderRadius: 4, marginRight:'6px', border: '1px solid lightgrey'}}/>
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
                
                table.table.borderColor = color.hex;
                setTable({...table});
                onChange(table);
                handleClose();
            }
        } />
        </CardContent>
        </Card>
      </Menu>
      {_buildTable()}
    </Row>
}
export default TableComponent;