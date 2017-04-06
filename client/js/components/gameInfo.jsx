import React from 'react';
import { connect } from "react-redux"

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
        moves: store.game.moves,
        time: store.game.time
    };
})
export default class GameInfo extends React.Component{
    render() {
        return (
            <div>
                <div>Number of moves: {this.props.moves}</div>
                <div>Time: {this.props.time} seconds</div>
            </div>
        )
    }
};