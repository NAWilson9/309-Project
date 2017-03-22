import React from 'react';
import { connect } from "react-redux"
import BoardRow from './board_row.jsx';

const getStyle = function(over){
    return {
        borderStyle: 'solid',
        borderWidth: '2px',
        // height: '900px',
        width: '100%',
        color: (over) ? 'red' : null
        // paddingTop: '100%'
    // width: '800px',
        // height: '800px',
        // display: 'inline-block'
    };
};

@connect((store) => {
    return {
        board: store.game.board,
        over: store.game.over
    };
})
export default class Board extends React.Component{
    render() {
        const board = this.props.board.map(function(row, i){
            return <BoardRow key={i} rowData={row} numberOfRows={this.props.board.length} even={i%2 == 0}/>
        }, this);

        return (
            <div style={getStyle(this.props.over)}>{board}</div>
        );
    }
};