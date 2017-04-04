import React from 'react';
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'

import FindGameView from './find_game_view.jsx';
import GameView from './game_view.jsx';
import CHSSHeader from './header.jsx';
import Login from './login.jsx';
import ProfileView from './profile_view.jsx';
import HomeView from './home_view.jsx';

@connect((store) => {
    return {
        inGame: store.view.inGame,
        loggedIn: store.view.loggedIn,
        view: store.view.current
    };
})
export default class Page extends React.Component{
    getPageComponent(){
        switch(this.props.view){
            case 'game':
                if (this.props.inGame) return <GameView/>;
                else return <FindGameView/>;
            case 'home':
                return <HomeView/>;
            case 'logout':
                return <h1>You have been logged out!</h1>;
            case 'profile':
                if (this.props.loggedIn) return <ProfileView/>;
                else return <Login/>;
            default:
                return <h1 style={{textAlign: 'center'}}>{this.props.view} page in progress...</h1>;
        }
    };

    render() {
        return (
            <main style={{height: '85%', width: '100%'}}>
                <CHSSHeader/>
                <Grid style={{height: '100%'}} textAlign='center' verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column>
                            {this.getPageComponent()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </main>
        );
    }
};