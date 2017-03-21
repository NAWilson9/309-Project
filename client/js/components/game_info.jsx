import React from 'react';

const getStyles = function(props){
    return {
        height: (100/props.numberOfRows) + '%'
    }
};

const GameInfoPanel = React.createClass({
    render() {
        return (
            <div style={getStyles(this.props)}>{row}</div>
        );
    }
});


export default GameInfoPanel;