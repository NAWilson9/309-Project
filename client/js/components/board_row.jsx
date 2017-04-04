import React from 'react';
import BoardSquare from './board_square.jsx';

const getStyles = function(props){
    return {
        height: (100/props.numberOfRows) + '%'
    }
};

export default class BoardRow extends React.Component{
    render() {
        return (
            <div style={getStyles(this.props)}>{
                this.props.rowData.map(function(square, i){
                    return <BoardSquare key={i} rowNumber={this.props.rowNumber} cellNumber={i} piece={square} rowCount={this.props.rowData.length} even={(this.props.even) ? (i%2 == 0) : ((i+1)%2 == 0)}/>
                }, this)
            }</div>
        );
    }
};