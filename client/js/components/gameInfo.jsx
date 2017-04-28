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
        winner: store.game.winner,
        moves: store.game.moves,
        user: store.user,
    };
})
export default class GameInfo extends React.Component{
    render() {
        let check = 'None';
        if(this.props.players != null){
            // console.log(this.props.players.playerTop);
            // console.log(this.props.players.playerBottom);
            if(this.props.players.playerTop.isInCheck) {
                check = this.props.players.playerTop.userData.username;
            } else if(this.props.players.playerBottom.isInCheck) {
                check = this.props.players.playerBottom.userData.username;
            }
        }
        console.log(this.props.winner);

        //Todo: current users turn should tell if "you" or "opponent"
        //Todo: Make timer work
        return (
            <div>
                <div>Number of moves: {this.props.moves}</div>
                <div>Time: {this.props.time} seconds</div>
                <div>Opponent: {this.props.players && getOpponent(this.props.user, this.props.players).userData.username}</div>
                <div>Current Player's Turn: {this.props.activePlayer && currentUsersTurn(this.props.user, this.props.activePlayer, this.props.players)}</div>
                <div>Player in check: {check}</div>
                <div>{this.props.winner ? 'Winner: ' + this.props.winner.userData.username : ''}</div>
            </div>
        )
    }
};

function currentUsersTurn(user, activePlayer, players) {
    console.log('user._id:', user._id);
    console.log('activePlayer._id:', activePlayer.userData._id);
    if (user._id === activePlayer.userData._id) return 'You';
    else return 'Opponent'; //getOpponent(user, players).userData.username;
}

function getOpponent(user, players) {
    if(players.playerBottom.userData._id === user._id) return players.playerTop;
    else return players.playerBottom;
}