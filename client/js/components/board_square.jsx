import { connect } from "react-redux"

import React from 'react';
import Piece from './piece.jsx';

import { movePiece } from '../socket'

const getStyle = function(props){
    return {
        // borderStyle: 'solid',
        // borderWidth: '1px',
        // todo: Should be column count? - Adam
        width: (100/props.rowCount) + '%',
        // paddingTop: (100/props.rowCount) - 2 + '%',
        height: (100/props.rowCount) + '%',
        display: 'inline-block',
        backgroundColor: (props.even) ? 'darkgrey' : 'white',
        textAlign: 'center'
    };
};

@connect((store) => {
    return {
        moveDestination: store.game.moveDestination,
        userName: store.user.username
    };
})
export default class BoardSquare extends React.Component{
    dragEnterHandler(){
        this.props.dispatch({
            type: "pieceMoveDestination",
            payload: {
                x: this.props.cellNumber,
                y: this.props.rowNumber,
            },
        });
    }

    onDragEnd(){
        movePiece({
            start: {
                x: this.props.cellNumber,
                y: this.props.rowNumber,
            },
            end: this.props.moveDestination,
        });
    }

    render(){
        let pieceUser;
        if(this.props.piece){
            // This used to work then the commits that were supposed to actually fix this broke it even more.
            // if(this.props.userName){
            //     console.log('username');
            //     pieceUser = this.props.piece.player.userData._id.indexOf('generic' + this.props.userName) >= 0;
            // } else {
                console.log('else');
                pieceUser = this.props.piece.player.isBottomPlayer;
        }

        let image = (this.props.piece !== null)
            ? <Piece image={this.props.piece.name + '.svg'} row={this.props.rowNumber} cell={this.props.cellNumber} isUsers={pieceUser}/>
            : <div style={{paddingTop:'100%'}}/>;

        return (
            <div
                style={getStyle(this.props)}
                draggable="true"
                onDragEnter={(event) => this.dragEnterHandler(event)}
                onDragEnd={(event) => this.onDragEnd(event)}
            >
                {image}
            </div>
        );
    }
};