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
        game: store.game.moves,
        players: store.game.players,
        time: store.game.time,
        activePlayer: store.game.activePlayer,
        moves: store.game.moves
    };
})
export default class GameInfo extends React.Component{
    render() {
        let check = 'None';
        if(this.props.players != null){
            if(this.props.players.playerTop.isInCheck) {
                check = this.props.players.playerTop.userData._id;
            } else if(this.props.players.playerBottom.isInCheck) {
                check = this.props.players.playerBottom.userData._id;
            }
        }

        //Todo: current users turn should tell if "you" or "opponent"
        //Todo: Make timer work
        return (
            <div>
                <div>Number of moves: {this.props.moves}</div>
                <div>Time: {this.props.time} seconds</div>
                <div>Opponent: {this.props.players && this.props.players.playerTop.userData._id}</div>
                <div>Current User's Turn: {this.props.activePlayer && this.props.activePlayer.userData._id}</div>
                <div>User in check: {check}</div>
            </div>
        )
    }
};