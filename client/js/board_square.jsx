import React from 'react';

const getStyle = function(props){
    return {
        borderStyle: 'solid',
        borderWidth: '1px',
        width: (100/props.rowCount) + '%',
        height: '100%',
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

const BoardSquare = React.createClass({
    render() {
        return (
            <div style={getStyle(this.props)}>
                <div draggable="true" onDragStart={dragstart_handler} onDragOver={dragover_handler} onDrop={dragover_handler} style={{width: '100%', height: '100%'}}>{this.props.number}</div>
            </div>
        );
    }
});


export default BoardSquare;