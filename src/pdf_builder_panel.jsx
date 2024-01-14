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
            logo:"http://www.photo-paysage.com/albums/Paysages/Lac-riviere-cascade/paradis-lac-cascade-plitvice.jpg"
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