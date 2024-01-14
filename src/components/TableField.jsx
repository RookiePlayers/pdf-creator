import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import {
  InputBase,
  TextField,
  Card,
  CardContent,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import { CirclePicker } from "react-color";
import { StandardFonts } from "ruki-react-pdf-creator";
import Row from "./Row";

//{TEXT: STRING, FONT: STRING, SIZE: INT, COLOR: STRING, ID: STRING}
const TableField = ({ data, onDataChange }) => {
  const [tableData, setTableData] = useState(data);

  const [contextMenu, setContextMenu] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const openColors = Boolean(anchorEl);
  const handleClickColors = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseColors = () => {
    setAnchorEl(null);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };
  const handleOnChangeText = (e) => {
    const text = e.target.value;
    tableData.text = text;
    onDataChange(tableData);
    setTableData({ ...tableData });
  };
  return (
    <div onContextMenu={handleContextMenu} style={{ cursor: "context-menu" }}>
      <InputBase
        multiline
        style={{
          padding: 2,
          color: tableData.color,
          fontSize: tableData.size,
          fontFamily: tableData.font,
        }}
        value={tableData.text}
        onChange={handleOnChangeText}
      />
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem>
          
           <Row style={{width:"100%", alignItems:"center"}} alignment="space-between">
            <Typography>Fontsize</Typography>
            <div style={{ width: '1em' }}/>
            <TextField
                    size="small"
                    value={tableData.size}
                    onChange={(e) => {
                    const size = e.target.value;
                    tableData.size = Number(size);
                    onDataChange(tableData);
                    setTableData({ ...tableData });
                    }}
                />
            </Row>
        </MenuItem>
        <MenuItem>
        <Row style={{width:"100%", alignItems:"center"}} alignment="space-between">
            <Typography>Color</Typography>
            <div style={{ width: '1em' }}/>
            <Row>
              <div
                onClick={handleClickColors}
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 5,
                  background: tableData.color,
                  margin: 2,
                }}
              />
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={openColors}
                onClose={handleCloseColors}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Card
                  variant="outlined"
                  style={{ border: "none", background: "transparent" }}
                >
                  <CardContent>
                    <CirclePicker
                      onChange={(color) => {
                        
                        tableData.color = color.hex;
                        onDataChange(tableData);
                        setTableData({ ...tableData });
                        handleCloseColors();
                      }}
                    />
                  </CardContent>
                </Card>
              </Menu>
            </Row>
        </Row>
        </MenuItem>
        <MenuItem><Row style={{width:"100%", alignItems:"center"}} alignment="space-between">
            <Typography>Cell Width</Typography>
            <div style={{ width: '1em' }}/>
            <TextField
                    size="small"
                    value={tableData.cellWidth}
                    onChange={(e) => {
                    const cellWidth = e.target.value;
                    tableData.cellWidth = Number(cellWidth);
                    onDataChange(tableData);
                    setTableData({ ...tableData });
                    }}
                />
            </Row>
        </MenuItem>
        <MenuItem>
        <Row style={{width:"100%", alignItems:"center"}} alignment="space-between">
            <Typography>Font Family</Typography>
            <div style={{ width: '2em' }}/>
            <Row style={{width:"100%"}}>
              <FormControl size="small" fullWidth>
                <InputLabel
                  defaultValue={tableData.text}
                  id="demo-simple-select-label"
                >
                  Font
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={tableData.font}
                  label="Font"
                  onChange={(e) => {
                    const font = e.target.value;
                    tableData.font = font;
                    onDataChange(tableData);
                    setTableData({ ...tableData });
                  }}
                >
                  {Object.keys(StandardFonts).map((font, i) => {
                    return (
                      <MenuItem key={i} value={StandardFonts[font]}>
                        {font}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Row>
        </Row>
        </MenuItem>
        <MenuItem>
        <Row style={{width:"100%", alignItems:"center"}} alignment="space-between">
             <Typography>#Id</Typography>
              <div style={{ width: '1em' }}/>
               <Typography>{tableData.id}</Typography>
           
         </Row>
        </MenuItem>
      </Menu>
    </div>
  );
};
export default TableField;
