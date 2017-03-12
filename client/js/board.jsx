import React from 'react';
import BoardRow from './board_row.jsx';

const getStyle = function(){
    return {
        borderStyle: 'solid',
        width: '800px',
        height: '800px'
    };
};

const gg = [
    [1,2,3,4,5,6,7,8],
    [1,2,3,4,5,6,7,8],
    [1,2,3,4,5,6,7,8],
    [1,2,3,4,5,6,7,8],
    [1,2,3,4,5,6,7,8],
    [1,2,3,4,5,6,7,8],
    [1,2,3,4,5,6,7,8],
    [1,2,3,4,5,6,7,8]
];

const Board = React.createClass({
    render() {
        var board = gg.map(function(row, i){
            return <BoardRow key={i} rowData={row} numberOfRows={gg.length}/>
        });

        return (
            <div style={getStyle()}>
            {board}
            </div>
        );
    }
});


export default Board;