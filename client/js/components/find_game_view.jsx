import React from 'react'
import { connect } from "react-redux"
import { Button, Grid, Loader } from 'semantic-ui-react'
import { cancelGameSearch, findGame } from '../socket.js'

@connect((store) => {
    return {
        inQueue: store.view.inQueue
    };
})
export default class FindGameView extends React.Component{
    render() {
        return (
            <Grid textAlign='center' verticalAlign='middle' style={{height: "100%"}}>
                <Grid.Row>
                    <Grid.Column>
                        <h1 style={{fontSize: "550%"}}>Find a Game</h1>
                        {!this.props.inQueue &&
                            <Button color='green' size="massive" onClick={findGame}>Enter Queue</Button>}
                        {this.props.inQueue &&
                            <Loader active inline='centered' size='massive' style={{marginBottom: '30px'}}>Searching...</Loader>}
                        {this.props.inQueue &&
                            <Button color='red' size="massive" onClick={cancelGameSearch}>Leave Queue</Button>}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
};