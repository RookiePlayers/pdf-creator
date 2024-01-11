import React, { Component } from 'react';
import '../utils.css';
class Column extends Component {
    //contains a list of JFX Components

    /**
     * PROPERTIES:
     * alignment: String: alignment="left|center|right"
     * elements: Array(Components): elements=[Comp1, Comp2]
     * id: String: id="id"
     * class: String: class="class1 class2"
     * style: Object: style={}
     * onClick: Function(): onClick=(){}
     * **/

    
    constructor(props){//elements=[],alignment="left"
        super(props);
        /*this.props.elements;
        this.props.alignment=alignment;*/
        this.state = { 
            crossAlignment:this.props.crossAlignment?this.props.crossAlignment:"left",
            alignment:this.props.alignment?this.props.alignment:"centered",
                classes:this.props.className?this.props.className:"",
                id:this.props.id,
                styles:this.props.style,
                handleClick:this.props.onClick?this.props.onClick:()=>{}
        }
    }
    
    
    render() { 
     
        return <div id={this.state.id}  className={(this.props.alignment??"centered")+"-col "+this.props.className} style={{alignItems:this.state.crossAlignment,...this.props.style}}>
        {this.props.children}
    </div>
    }
}
 
export default Column;