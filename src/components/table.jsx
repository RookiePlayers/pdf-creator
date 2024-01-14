import { useState } from "react";
import { Grid, Button, IconButton, Typography } from "@mui/material";
import TableField from "./TableField";
import Row from "./Row";
import Column from "./Column";
import { Add, Delete } from "@mui/icons-material";
import shortid from "shortid";
const Table = ({ table, onDataChange,cellWidth }) => {
  const [tableData, setTableData] = useState(table??[]);

  const handleRemoveRow = (rowIndex) => {
    tableData.splice(rowIndex, 1);
    onDataChange(tableData);
    setTableData([...tableData]);
  }

  const handleAddNewRow = () => {
    tableData.push([
      {
        text: "",
        font: "",
        size: 12,
        color: "#000000",
        id: `${tableData.length}0`,
        cellWidth: cellWidth??100,
      },
    ]);
    //populate the row with empty columns
    for (let i = 1; i < tableData[0].length; i++) {
        tableData[tableData.length - 1].push({
            text: "",
            font: "",
            size: 12,
            cellWidth: cellWidth??100,
            color: "#000000",
            id: `${tableData.length - 1}${i}`,
            });
    }
    onDataChange(tableData);
    setTableData([...tableData]);
  };
  const handleRemoveRecentRow = () => {
    tableData.pop();
    onDataChange(tableData);
    setTableData([...tableData]);
  }
  const handleRemoveRecentColumn = () => {
    for (let i = 0; i < tableData.length; i++) {
        tableData[i].pop();
    }
    onDataChange(tableData);
    setTableData([...tableData]);
  }
  const handleAddNewColumn = () => {
    //add new column
    for (let i = 0; i < tableData.length; i++) {
        tableData[i].push({
            text: "",
            font: "",
            size: 12,
            color: "#000000",
            cellWidth: cellWidth??100,
            id: `${i}${tableData[i].length}`,
            });
    }


    onDataChange(tableData);
    setTableData([...tableData]);
  };
  const handleAddingcolumnToRow = (rowIndex) => {
    if (!tableData || tableData.length === 0) {
      return [[""]];
    }
    tableData[rowIndex].push({
      text: "",
      font: "",
      size: 12,
      color: "#000000",
      cellWidth: cellWidth??100,
      id: `${rowIndex}${tableData[rowIndex].length}`,
    });

    onDataChange(tableData);
    setTableData([...tableData]);
  };
  const _addColButton = (rowIndex) => {
    return (
      <Row>
        <IconButton
        key={`btn-${rowIndex}-1`}
        onClick={() => {
          handleAddingcolumnToRow(rowIndex);
        }}
      >
      <Add/>
      </IconButton>
        <IconButton
        key={`btn-${rowIndex}`}
        onClick={() => {
            handleRemoveRow(rowIndex);
        }}
      >
      <Delete/>
      </IconButton>
      
      </Row>
    );
  };
  const _buildTableField = (index, colIndex, col) => {
    return (
      <TableField
        onDataChange={(data) => {
          tableData[index][colIndex] = data;
          onDataChange(tableData);
        }}
        data={col}
      />
    );
  };
  const _buildRow = (row) => {
    return (
      <Grid key={shortid.generate()} container>
        {row.map((child, index) => {
          return (
            <Column key={"row-" + index} id={index}>
              {child}
            </Column>
          );
        })}
        
      </Grid>
    );
  }
  const _buildGrid = () => {
    const grid = [];
    for (let i = 0; i < tableData.length; i++) {
      const row = tableData[i];
      const rowGrid = [
        <Typography style={{
            margin: "0.5em",
        }} key={`row-${i}`}>{i}</Typography>
      ];
      for (let j = 0; j < row.length; j++) {
        const col = row[j];
        rowGrid.push(
            <div
            key={`td-${col.id}`}
            style={{
              border: "1px solid black",
              width: "100px",
              minHeight: "30px",
            }}
          >{_buildTableField(i, j, col)}</div>);
      }
      rowGrid.push(_addColButton(i));
      grid.push(_buildRow(rowGrid));
    }
    return grid;
  };
  return (
    <Grid key={shortid.generate()} container>
     <Row>
        <Button size="small" startIcon={<Add/>} onClick={handleAddNewRow}>Row</Button>
        <Button size="small" startIcon={<Add/>} onClick={handleAddNewColumn}>Col</Button>
        <Button size="small" startIcon={<Delete/>} color="error" onClick={handleRemoveRecentRow}>Row</Button>
        <Button size="small" startIcon={<Delete/>} color="error" onClick={handleRemoveRecentColumn}>Col</Button>
    </Row>
      <Grid key={shortid.generate()}  xs={12}>{_buildGrid()}</Grid>
    </Grid>
  );
};
export default Table;
