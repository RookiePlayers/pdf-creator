import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardContent, Chip, CircularProgress, Container, Grid, Icon, TextField, Typography } from "@mui/material";
import Column from "./components/Column";
import Row from "./components/Row";
import { Fragment, useEffect, useRef, useState } from "react";
import shortid from "shortid";
import TextComponent from "./components/text_component";
import TableComponent from "./components/table_component";
import ImageComponent from "./components/image_component";
import LineComponent from "./components/line_component";
import { debounce } from 'lodash';
import { ExpandMore, GridOn, Image } from "@mui/icons-material";
import { _arrayBufferToBase64 } from "./utils";
import { PDFJSONParser, StandardFonts } from "ruki-react-pdf-creator";

const PDFBuilderPanel = ({ pageSetting:pageSettingDefault, components: componentDefault, onUpdated,onPageSettingUpdated}) => {
  const [components, setComponents] = useState(componentDefault??[]);
  const [generating, setGenerating] = useState(false);
  const fileUploadRef = useRef(null)

  const [pageSettings, setPageSettings] = useState(pageSettingDefault??{
    width: window.innerWidth, 
    height: window.innerHeight,
    padding: 0,
  });
  useEffect(()=>{}, [componentDefault]);
  useEffect(()=>{}, [pageSettingDefault]);

  const handleImportClicked = (e) => {
     e.preventDefault()
    if (fileUploadRef.current) {
      fileUploadRef.current.click()
    }
  }
  // Helper functions
    const handleComponentUpdate = (updateFunction) => {
        const newComponent = updateFunction([...components]);
        setComponents(newComponent);
        onUpdated && onUpdated(newComponent);
    };
    
    const updateComponentData = (componentsArray, componentId, newData) => {
        const index = componentsArray.findIndex((c) => c.id === componentId);
        if (index !== -1) {
        componentsArray[index].data = newData;
        }
        return componentsArray;
    };
  const importJsonComponets = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => { 
        const text = (e.target.result);
        const json = JSON.parse(text);
        console.log(json);
        const result = await PDFJSONParser(json,{
            logo:"data:image/jpeg;base64,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"
        })
        setComponents(result.components.sort((a,b)=>a.data.y - b.data.y));
        setPageSettings(result.pageSettings);
        onUpdated && onUpdated(json.components);
        onPageSettingUpdated && onPageSettingUpdated(json.pageSettings);
    }
    reader.readAsText(file);
  }
  const exportComponentToJson = async () => {
    setGenerating(true);
    const pdfJson = {
        pageSettings,
        components: components
    }
    //change images to base64
    for(let i = 0; i < pdfJson.components.length; i++){
        if(pdfJson.components[i].type === "image"){
            if(pdfJson.components[i].data?.image){
                if(pdfJson.components[i].data.image instanceof Promise)
                pdfJson.components[i].data.image = `data:image/png;base64,${_arrayBufferToBase64(await pdfJson.components[i].data.image)}`;
            }
        }else if(pdfJson.components[i].type === "text"){
            if(pdfJson.components[i].data?.text?.startsWith("$")){
                pdfJson.components[i].data.var = pdfJson.components[i].data.text;
            }
        }
    }
    const json = JSON.stringify(pdfJson);
    const blob = new Blob([json],{type:'application/json'});
    const href =  URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    window.open(href);
    link.download = `pdf-components(${new Date().toLocaleString()}).json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setGenerating(false);
  }
  const getJSX = (component) => {
    switch(component.type){
        case "line":
            return <LineComponent
            data = {component.data}
            id={component.id} 
            onDelete={() => handleComponentUpdate((newComponent) => newComponent.filter((c) => c.id !== component.id))}
            onChange={debounce((data) => handleComponentUpdate((newComponent) => updateComponentData(newComponent, component.id, data)), 300)}
            />
        case "image":
            return <ImageComponent 
            data = {component.data}
            id={component.id} 
            onDelete={() => handleComponentUpdate((newComponent) => newComponent.filter((c) => c.id !== component.id))}
            onChange={debounce((data) => handleComponentUpdate((newComponent) => updateComponentData(newComponent, component.id, data)), 300)}
            />

        case "table":
            return <TableComponent
            data = {component.data}
            id={
                component.id
            } 
            onDelete={() => handleComponentUpdate((newComponent) => newComponent.filter((c) => c.id !== component.id))}
            onChange={debounce((data) => handleComponentUpdate((newComponent) => updateComponentData(newComponent, component.id, data)), 300)}
            />
        default: 
            return <TextComponent 
            id={component.id} 
            data = {component.data}
            onDelete={() => handleComponentUpdate((newComponent) => newComponent.filter((c) => c.id !== component.id))}
            onChange={debounce((data) => handleComponentUpdate((newComponent) => updateComponentData(newComponent, component.id, data)), 300)}
            />
    }
  }

    const handleAddComponent = (type) => {
        let newComponent = {};
        const id = shortid.generate();
        const lattestHeight = components[components.length-1]?.data?.y??0;
        newComponent.id = id;
        newComponent.type = type;
        switch(type){
            case "line":
                newComponent.data = {
                    y: lattestHeight + 20,
                    id: id,
                    strokeThickness: 2,
                    opacity: 1,
                    length: 100,
                    x: 10,
                    color: "#000000",
                };
                break;
            case "image":
                newComponent.data = {
                    y: lattestHeight + 110,
                    id: id,
                    image: "",
                    width: 200,
                    height: 200,
                };
                break;
            case "table":
                newComponent.data = {
                    y: lattestHeight + 30,
                    id: id,
                    text: "",
                    x: 10,
                    table:{
                        cellWidth: 100,
                        cellHeight: 30,
                        grid: [[]],
                        borderWidth: 1,
                        borderColor: "#000000",
                        tableMargin: 5,
                    },
                    font: StandardFonts.CourierBold,
                    size: 12,
                    color: "#000000",
                };
            break;
                default:
                    newComponent.data = {
                        text: "",
                        x: 10,
                        id: id,
                        font: StandardFonts.CourierBold,
                        size: 12,
                        color: "#000000",
                        y: lattestHeight + 20,
                    };
        }
        const newComponents = [...components, newComponent];
        setComponents(newComponents);
        onUpdated && onUpdated(newComponents);
    }
   
    const BuildPreview = ({data}) => {
        const [preview, setPreview] = useState(null);
        useEffect(()=>{
            if(data.type === "image"){
               if(data.data?.image){
                if(data.data.image instanceof Promise)
                {
                        data.data.image.then((image)=>{
                        let base64Url = `data:image/png;base64,${_arrayBufferToBase64(image)}`
                        console.log(base64Url);
                        setPreview(base64Url);
                    })
                }else{
                    if(typeof data.data.image === "string"){
                        setPreview(data.data.image);
                    }
                }
               }
            }
        },[data.data?.image,data.type])
        switch(data.type){
            case "image": return <Row style={{alignItems:'center'}}>
                <div style={{width: 30, height: 30}}>
                    {preview ? <img alt={data?.data?.var??""} style={{width: "100%", height: "100%"}} src={preview}/> : 
                        <Icon><Image/></Icon>
                    }
                </div>
                {data?.data?.var &&<Row>
                    <Typography style={{marginLeft: 5, fontStyle:"italic"}}>{data?.data?.var}</Typography>
                    <Chip style={{marginLeft: 5}} size="small" variant="outlined" label={"variable"}/>
                    </Row>}
            </Row>
            case "table": return <Row style={{alignItems:'center'}}>
                <Icon>
                    <GridOn/>
                </Icon>
                <Typography style={{marginLeft: 5}}>{`${data.data?.table?.grid.length} Rows`}</Typography>
            </Row>
            case "line":
                return <Row>
                    <div style={{width: 100, height: data.data.strokeThickness, backgroundColor: data.data.color}}/>
                    </Row>

            default: 
                return <Row>
                <Typography style={{fontWeight:data.data?.text?.[0] === "$" ?"normal":"bold", fontStyle: data.data?.text?.[0] === "$" ? "italic" :"normal"}}>{data.data.text}</Typography>
                {data.data?.text?.[0] === "$" && <Chip style={{marginLeft: 5}} size="small" variant="outlined" label="variable"/>}
                </Row>
        }
    }
    return <Container style={{ padding: '1em', backgroundColor: '#1f2336', height: '100vh', overflowY:"auto", width:'100%'}}>
    <Grid container spacing={1}>
        <Grid item xs={12}>
            <Card variant='outlined'>
                <CardContent>
                    {
                        generating ? <CircularProgress/> :
                        <Row>
                        <Button variant="outlined" onClick={exportComponentToJson}>Export As JSON</Button>
                        <div style={{ width: '1em' }}/>
                        <Fragment>
                            <input onChange={importJsonComponets} ref={fileUploadRef} type="file" hidden/>
                            <Button onClick={handleImportClicked} variant="outlined"> Import JSON</Button>
                        </Fragment>
                    </Row>}
                </CardContent>
            </Card>
        </Grid>
      <Grid item xs={12}>
        <Card variant='outlined'>
           <CardContent>
            <Column>
              <Typography variant="h6">Page Setting</Typography>
              <div style={{ height: '1em' }}/>
              <Row>
                <TextField label="Width" type="number"
                onChange={(e)=>{
                    const newPageSettings = {...pageSettings, width: Number(e.target.value)};
                    setPageSettings(newPageSettings);
                    onPageSettingUpdated && onPageSettingUpdated(newPageSettings);
                }}
               variant="outlined" size="small" />
                <div style={{ width: '1em' }}/>
                <TextField label="Height"  type="number"  onChange={(e)=>{
                    const newPageSettings = {...pageSettings, height: Number(e.target.value)};
                    setPageSettings(newPageSettings);
                    onPageSettingUpdated && onPageSettingUpdated(newPageSettings);
                }} variant="outlined" size="small" />
              </Row>
              <div style={{ height: '1em' }}/>
              <Row>
                <TextField label="Padding"  type="number"  onChange={(e)=>{
                    const newPageSettings = {...pageSettings, padding: Number(e.target.value)};
                    setPageSettings(newPageSettings);
                    onPageSettingUpdated && onPageSettingUpdated(newPageSettings);
                }}  variant="outlined" size="small" />
              </Row>
            </Column>
           </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        {
            components.map((c, i) => {
                return <Accordion style={{marginBottom: 10}} key={c.id}>
                    <AccordionSummary  expandIcon={<ExpandMore />}>
                        <Row style={{width:"100%", alignItems:"center"}} alignment="space-between">
                            <BuildPreview data={c}/>
                            <Chip style={{
                                backgroundColor: c.type === "text" ? "#8ecae6" : c.type === "table" ? "#ffb703" : c.type === "image" ? "#ffc8dd" : "#8d99ae",
                                color: "#000000"
                            
                            }} size="small" variant="outlined" label={c.type}/>
                        </Row>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Card style={{margin:'1em 0.1em'}} variant='outlined' >
                    <CardContent>
                        {getJSX(c)}
                    </CardContent>
                </Card>
                    </AccordionDetails>
                </Accordion>
            })
        }
      </Grid>
      <Grid item xs={12}>
          <Card variant='outlined'>
             <CardContent>
              <Row style={{ flexWrap: true }}>
                  <Button style={{marginRight: 10}} variant="outlined" onClick={()=>{
                    handleAddComponent("text")
                  }}>Add Text</Button>
                  <Button style={{marginRight: 10}} variant="outlined" onClick={()=>{
                    handleAddComponent("table")
                  }}>Add Table</Button>
                  <Button style={{marginRight: 10}} variant="outlined" onClick={()=>{
                    handleAddComponent("image")
                  }}>Add Image</Button>
                    <Button style={{marginRight: 10}} variant="outlined" onClick={()=>{
                        handleAddComponent("line")
                    }}>Add Line</Button>
              </Row>
             </CardContent>
          </Card>
          </Grid>
      </Grid>
    </Container>
}
export default PDFBuilderPanel;