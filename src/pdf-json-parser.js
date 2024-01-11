import { StandardFonts } from "pdf-lib";
import shortid from "shortid";

export const PDFJSONParser = async (jsonFilePath, params) => {
    //retrieve json from jsonFilePath
    let json = jsonFilePath;
    if(typeof jsonFilePath === "string" && jsonFilePath.startsWith("http")){
    const response = await fetch(jsonFilePath);
     json = await response.json();
    }
    // Extract pageSettings and components from the JSON
    const { pageSettings, components } = json;
  
    // Scan components for any value that starts with $ and replace it with the value from params
    const replacedComponents = _replaceParamsInComponents(components, params);
    _populateTables(replacedComponents,params);
    return { pageSettings, components: replacedComponents };
  };
  function _populateTables(components,params) {
    let tableParams = [];
    for(let key in params){
        if(Array.isArray(params[key])){
            
            if(params[key].length > 0 && typeof params[key][0]?.["colId"])
            {
                for(let newKey of params[key]){
                    
                    tableParams[`${newKey?.['colId']?.toLowerCase()}`] = newKey;
                }
            }else{
                return;
            }
        }
    }

    
   
    const tableData = [];
    const grids = components.filter((component)=>component.type === "table");

        let rowInd = 0;
        for(let key in tableParams){
            const cellValues = tableParams[key].cellValues;
            const cellWidth = tableParams[key].cellWidth;
            const newRow = [];
            for(let i = 0; i < cellValues.length; i++){
                let text = cellValues[i];
                let cw = cellWidth;
                let font = StandardFonts.Courier;
                let bold = false;
                //cellValues: [{text: "Item 1", cellWidth: 400}, {text: "Item 2"}, "Item 3"],
                if(typeof (cellValues[i])=== "object"){
                    text = cellValues[i]?.text??"";
                    cw = cellValues[i]?.cellWidth??cellWidth;
                    font = cellValues[i]?.font??StandardFonts.Courier;
                    bold = cellValues[i]?.bold??false;
                }
                newRow.push({
                    text: text,
                    cellWidth: cw,
                    font: Object.keys(StandardFonts)[Object.values(StandardFonts).indexOf(`${font}${bold?"-Bold":""}`)],
                    size:12,
                    color:"#000000",
                    id:`${rowInd}_${i}`
                })
            }
            tableData.push(newRow);
        }
        const id= shortid.generate();
        const newTable = {
            id: id,
            type: "table",
            data:{
                y: findTallestComponent(components) + 30,
                x: grids[0].data.x,
                font: grids[0].data.font,
                size: grids[0].data.size,
                color: grids[0].data.color,
                text: grids[0].data.text,
                id: id,
                table:{
                    cellWidth: grids[0].data.table.cellWidth,
                    cellHeight: grids[0].data.table.cellHeight,
                    grid: tableData,
                    borderWidth: grids[0].data.table.borderWidth,
                    borderColor: grids[0].data.table.borderColor,
                    tableMargin: grids[0].data.table.tableMargin,
                }
            }


            
        }
        components.push(newTable);

}

function findTallestComponent(components) {
  //get the height of the biggest y value
  let tallest = 0;
  for(let component of components){
    if(component.data.y > tallest){
      tallest = component.data.y;
    }
  }
  return tallest;
}
  function convertKeysToLowerCase(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj; // Return non-object values as is
    }
  
    const newObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = key.toLowerCase();
        newObj[newKey] = convertKeysToLowerCase(obj[key]); // Recursively convert nested objects
      }
    }
  
    return newObj;
  }
  const _replaceParams = (obj, params) => {
    if(!params) return;
    params = convertKeysToLowerCase(params);
    if (typeof obj === "object") {
      for (let key in obj) {
        if (typeof obj[key] === "string") {
          const match = obj[key].match(/^\$(\w+)/);
          if (match) {
            const paramKey = match[1].toLowerCase();
            const replacement = params[paramKey];
            if (replacement !== undefined) {
              obj[key] = replacement;
            }
          }
        } else {
          _replaceParams(obj[key], params); // Recursively call _replaceParams for nested objects
        }
      }
    }
  };
  
  const _replaceParamsInComponents = (components, params) => {
    // Ensure components is an array
    if (!Array.isArray(components)) {
      throw new Error("Invalid components. Must be an array.");
    }
  
    const replacedComponents = components.map(component => {
      // Clone the component to avoid modifying the original object
      const clonedComponent = { ...component };
  
      // Replace params in the cloned component
      _replaceParams(clonedComponent, params);
  
      return clonedComponent;
    });
  
    return replacedComponents;
  };