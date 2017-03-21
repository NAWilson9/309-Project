import React from 'react';
import BoardSquare from './board_square.jsx';

const getStyles = function(props){
    return {
        height: (100/props.numberOfRows) + '%'
    }
};

const BoardRow = React.createClass({
    render() {
        const row = this.props.rowData.map(function(item, i){
            return <BoardSquare key={i} number={item} rowCount={this.props.rowData.length} even={(this.props.even) ? (i%2 == 0) : ((i+1)%2 == 0)}/>
        }, this);

        return (
            <div style={getStyles(this.props)}>{row}</div>
        );
    }
});


export default BoardRow;