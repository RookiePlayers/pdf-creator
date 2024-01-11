import React, { Component } from 'react';
import '../utils.css';
import PropTypes from "prop-types";
class Row extends Component {
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
        // elements.forEach(e=>{
        //     this.state.elems.push(e);
        // }); 
        this.state = { 
            alignment:this.props.alignment?this.props.alignment:"space-evenly",
            classes:this.props.className?this.props.className:"",
            id:this.props.id,
            styles:this.props.style,
            handleClick:this.props.onClick?this.props.onClick:()=>{}
        }
        // this.state.alignment=alignment;
    }
    
    
    render() { 
        
        return <div id={this.state.id} className={(this.props.alignment??"left")+"-row "+this.props.className} style={this.props.style}>
            {this.props.children}
        </div>
    }
}
Row.propTypes = {
    alignment:  PropTypes.oneOf(['space-evenly', 'space-between','centered','left','right']),
  };
export default Row;
