import React from 'react'
import { connect } from 'react-redux'
import { Button, Loader } from 'semantic-ui-react'

import { findGame, leaveQueue } from '../socket.js'

@connect((store) => {
    return {
        inQueue: store.view.inQueue
    };
})
export default class FindGameView extends React.Component{
    render() {
        return (
            <div>
                <h1>Find a Game</h1>
                {!this.props.inQueue &&
                    <Button color='green' onClick={findGame} size='massive'>Enter Queue</Button>}
                {this.props.inQueue &&
                    <Loader active inline='centered' size='massive' style={{marginBottom: '30px'}}>Searching...</Loader>}
                {this.props.inQueue &&
                    <Button color='red' onClick={leaveQueue} size='massive'>Leave Queue</Button>}
            </div>
        );
    }
};