import { Button, Card, CardContent, CircularProgress, Container, Grid, TextField, Typography } from "@mui/material";
import Column from "./components/Column";
import Row from "./components/Row";
import { Fragment, useEffect, useRef, useState } from "react";
import { StandardFonts } from "pdf-lib";
import shortid from "shortid";
import TextComponent from "./components/text_component";
import TableComponent from "./components/table_component";
import ImageComponent from "./components/image_component";
import LineComponent from "./components/line_component";


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
  const importJsonComponets = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => { 
        const text = (e.target.result);
        const json = JSON.parse(text);
        console.log(json);
        setComponents(json.components);
        setPageSettings(json.pageSettings);
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
            onDelete={()=>{
                setComponents(prevComponents => {
                    const newComponent = prevComponents.filter((c, i) => c.id !== component.id);
                    onUpdated && onUpdated(newComponent);
                    return newComponent;
                });
            }} 
            onChange={(line)=>{
                const newComponent = {
                    id: component.id,
                    type: component.type,
                    ...components.find((c, i) => {
                        return c.id === component.id
                    }),
                    data: line
                }
                const newComponents = components.filter((c, i) => {
                    return c.id !== component.id
                })
                newComponents.push(newComponent);
                setComponents(newComponents);
                onUpdated && onUpdated(newComponents);
            }}/>
        case "image":
            return <ImageComponent 
            data = {component.data}
            id={component.id} 
            onDelete={()=>{
                const newComponent = components.filter((c, i) => {
                    return c.id !== component.id
                })
                setComponents([...newComponent]);
                onUpdated && onUpdated(newComponent);
            }} 
            onChange={(image)=>{
                const newComponent = {
                    id: component.id,
                    type: component.type,
                    ...components.find((c, i) => {
                        return c.id === component.id
                    }),
                    data: image
                }
                const newComponents = components.filter((c, i) => {
                    return c.id !== component.id
                })
                newComponents.push(newComponent);
                setComponents(newComponents);
                onUpdated && onUpdated(newComponents);
            }}/>

        case "table":
            return <TableComponent
            data = {component.data}
            id={
                component.id
            } 
            onDelete={
                ()=>{
                    const newComponent = components.filter((c, i) => {
                        return c.id !== component.id
                    })
                    setComponents([...newComponent]);
                    onUpdated && onUpdated(newComponent);
                }
            }
            onChange={(table)=>{
                const newComponent = {
                    id: component.id,
                    type: component.type,
                    ...components.find((c, i) => {
                        return c.id === component.id
                    }),
                    data: table
                }
                const newComponents = components.filter((c, i) => {
                    return c.id !== component.id
                })
                newComponents.push(newComponent);
                setComponents(newComponents);
                onUpdated && onUpdated(newComponents);
            }}
            onDeleted={()=>{
                const newComponent = components.filter((c, i) => {
                    return c.id !== component.id
                })
                setComponents([...newComponent]);
                onUpdated && onUpdated(newComponent);
            }}
            />
        default: 
            return <TextComponent 
            data = {component.data}
            onChange={(text)=>{
                const newComponent = {
                    id: component.id,
                    type: component.type,
                    ...components.find((c, i) => {
                        return c.id === component.id
                    }),
                    data: text
                }
                const newComponents = components.filter((c, i) => {
                    return c.id !== component.id
                })
                newComponents.push(newComponent);
                setComponents(newComponents);
                onUpdated && onUpdated(newComponents);
            }} id={component.id} onDelete={()=>{
                const newComponent = components.filter((c, i) => {
                    return c.id !== component.id
                })
                setComponents([...newComponent]);
                onUpdated && onUpdated(newComponent);
            }}/>
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
                return <Card style={{margin:'1em 0.1em'}} variant='outlined' key={c.id}>
                <CardContent>
                    {getJSX(c)}
                </CardContent>
                </Card>
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