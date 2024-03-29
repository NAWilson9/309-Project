import React from 'react';
import { connect } from "react-redux"
import BoardRow from './board_row.jsx';

const getStyle = function(over){
    return {
        borderStyle: 'solid',
        borderWidth: '2px',
        color: (over) ? 'red' : null
    };
};

@connect((store) => {
    return {
        board: store.game.board,
        winner: store.game.winner
    };
})
export default class Board extends React.Component{
    render() {
        return (
            <div>
                <div style={getStyle(this.props.winner)}>{
                    this.props.board.map(function(row, i){
                        return <BoardRow key={i} rowNumber={i} rowData={row} numberOfRows={this.props.board.length} even={i%2 == 0}/>
                    }, this)
                }</div>
            </div>
        );
    }
};