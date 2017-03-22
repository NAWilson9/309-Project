import React from 'react';

const getStyle = function(props){
    return {
        // borderStyle: 'solid',
        // borderWidth: '1px',
        width: (100/props.rowCount) + '%',
        // paddingTop: (100/props.rowCount) - 2 + '%',
        height: (100/props.rowCount) + '%',
        display: 'inline-block',
        backgroundColor: (props.even) ? 'darkgrey' : 'white',
        textAlign: 'center'
    };
};

function dragover_handler(ev) {
    console.log('dragover handler');
    // ev.preventDefault();
    // Set the dropEffect to move
    // ev.dataTransfer.dropEffect = "move"
}
function drop_handler(ev) {
    console.log('drop handler');
    // ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    // var data = ev.dataTransfer.getData("text");
    // ev.target.appendChild(document.getElementById(data));
}

function dragstart_handler(ev) {
    console.log('drag start');
    // Add the target element's id to the data transfer object
    // ev.dataTransfer.setData("text/plain", this.props.number);
}

export default class BoardSquare extends React.Component{
    click(test){
        console.log("[" + this.props.rowNumber + "," + this.props.cellNumber + "]");
    };

    render(){
        let image = (this.props.data.image != null)
            ? <img src={'./images/' + this.props.data.image} style={{maxWidth: '96%', maxHeight: '96%'}}/>
            : <div style={{paddingTop:'100%'}}/>;

        return (
            <div style={getStyle(this.props)} onClick={()=>this.click()}>
                {image}
                {/*<div draggable="true" onDragStart={dragstart_handler} onDragOver={dragover_handler} onDrop={dragover_handler}>{this.props.data.number}</div>*/}
            </div>
        );
    }
};