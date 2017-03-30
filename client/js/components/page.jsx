import React from 'react';
import { connect } from "react-redux"

import FindGameView from './find_game_view.jsx';
import GameView from './game_view.jsx';
import CHSSHeader from './header.jsx';

@connect((store) => {
    return {
        inGame: store.view.inGame,
        view: store.view.current
    };
})
export default class Page extends React.Component{

    getPageComponent(){
        if(this.props.view === 'game'){
            if(this.props.inGame){
                return <GameView/>;
            } else {
                return <FindGameView/>;
            }
        } else {
            return <h1 style={{textAlign: 'center'}}>{this.props.view} page in progress...</h1>;
        }
    };

    render() {
        return (
            <main style={{width: "100%", height: "85%"}}>
                <CHSSHeader/>
                {this.getPageComponent()}
            </main>
        );
    }
};