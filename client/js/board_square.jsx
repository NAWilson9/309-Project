import React from 'react';

const getStyle = function(props){
    return {
        borderStyle: 'solid',
        width: (100/props.rowCount) + '%',
        height: '100%',
        display: 'inline-block'
    };
};

const BoardSquare = React.createClass({
    render() {
        return (
            <div style={getStyle(this.props)}>
                {this.props.number}
            </div>
        );
    }
});


export default BoardSquare;