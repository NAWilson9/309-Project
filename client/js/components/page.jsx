import { connect } from "react-redux"
import React from 'react';

import CHSSHeader from './header.jsx';
import GameView from './game_view.jsx';

@connect((store) => {
    return {
        view: store.view.page
    };
})
export default class Page  extends React.Component{

    getPageComponent(){
        if(this.props.view === 'game'){
            return <GameView/>
        } else {
            return <section><h1>{this.props.view} page in progress...</h1></section>;
        }
    };

    render() {
        return (
            <main>
                <CHSSHeader currentPage={this.props.view} dispatch={this.props.dispatch}/>
                {this.getPageComponent()}
            </main>
        );
    }
};