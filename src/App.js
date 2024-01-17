import './App.css';
import { CircularProgress, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import Column from './components/Column';
import PDFBuilderPanel from './pdf_builder_panel';
import PDFBuilderView from './pdf_builder_view';
import { PDFJSONParser } from "ruki-react-pdf-creator";
import jsonfile from './pdf-components(1_11_2024, 12_15_02 PM)';
import logo from "./assets/logo192.png";
function App() {
  const [loading, setLoading] = useState(true)
  const [components, setComponents] = useState([])
  const [pageSetting, setPageSetting] = useState()
  useEffect(()=>{
    PDFJSONParser(jsonfile,
      {
        companyName:"DearfxchTV",
        logo:logo,
        items: [
      {
        colId: "ITEM",
        cellValues: [{text: "ITEM", cellWidth: 800, bold: true, font: "Helvetica"}, "QTY", "PRICE","AMOUNT"],
        cellWidth: 100,
      },
      {
        colId: "ITEM2",
        cellValues: ["Item 1", "Item 2", "Item 3"],
        cellWidth: 100,
      },
    ]}).then((result)=>{
    
    setComponents(result.components.sort((a,b)=>a.data.y - b.data.y))
    setPageSetting(result.pageSettings)
    setLoading(false)
  }).catch((error)=>{
    console.log(error)
    setLoading(false)
  })
  },[])
  
  const _buildLeftSide = ()=>{
    return <PDFBuilderPanel 
    pageSetting={pageSetting}
    components={components}
    onPageSettingUpdated={
      (pageSetting)=>{
        setPageSetting(pageSetting)
      }
    }
    onUpdated = {
      (components)=>{
        setComponents(components)
      }
    }/>
  }
  const _buildRightSide = ()=>{
    return <div style={{height: "100vh", width:"100%"}}>
      <PDFBuilderView components={components} pageSetting = {pageSetting}/>
    </div>
  }
  return (
    <Column alignment="centered" style={{height: "100vh", alignItems: "center"}}>
      {loading  ? <Column style={{width:"100%", height:"100%", alignItems: "center"}}><CircularProgress/></Column> :
        <Grid container>
      <Grid item xs={4}>
        {_buildLeftSide()}
      </Grid>
      <Grid  item xs={8}>
        {_buildRightSide()}
      </Grid>
    </Grid>}
    </Column>
  );
}

export default App;
