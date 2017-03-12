import React from 'react';
import BoardSquare from './board_square.jsx';

const getStyles = function(props){
    return {
        height: (100/props.numberOfRows) + '%'
    }
};

const BoardRow = React.createClass({
    render() {
        const self = this;
        const row = this.props.rowData.map(function(item, i){
            return <BoardSquare key={i} number={item} rowCount={self.props.rowData.length}/>
        });

        return (
            <div style={getStyles(this.props)}>
                {row}
            </div>
        );
    }
});


export default BoardRow;