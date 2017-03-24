import { connect } from "react-redux"

import React from 'react';
import Piece from './piece.jsx';

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

@connect((store) => {
    return {};
})
export default class BoardSquare extends React.Component{
    dragEnterHandler(ev){
        this.props.dispatch({
            type: "pieceMoveDestination",
            payload: {
                x: this.props.cellNumber,
                y: this.props.rowNumber,
            },
            // payload: this.props.rowNumber + ',' + this.props.cellNumber
        });
    }

    onDragEnd(ev){
        this.props.dispatch({
            type: 'pieceMoveComplete',
            payload: {
                x: this.props.cellNumber,
                y: this.props.rowNumber,
            },
            // payload: this.props.rowNumber + ',' + this.props.cellNumber
        })
    }

    render(){
        let image = (this.props.data.image != null)
            ? <Piece image={this.props.data.image} row={this.props.rowNumber} cell={this.props.cellNumber}/>
            : <div style={{paddingTop:'100%'}}/>;

        return (
            <div
                style={getStyle(this.props)}
                onClick={()=>this.click()}
                draggable="true"
                onDragEnter={(event) => this.dragEnterHandler(event)}
                onDragEnd={(event) => this.onDragEnd(event)}
            >
                {image}
            </div>
        );
    }
};