import React from 'react'
import { Button, Dimmer, Loader, Segment } from 'semantic-ui-react'
import { findGame } from '../socket.js'


const getStyles = function(props){
    return {
        // marginLeft: '14px',
        // marginRight: '14px',
        // marginTop: '14px'
    }
};

export default class FindGameView extends React.Component{
    render() {
        let comp;
        if(this.props.inQueue){
            comp = (
                <Segment>
                    <Dimmer active>
                        <Loader>In Queue...</Loader>
                    </Dimmer>
                </Segment>
            );
        } else {
            comp = <Button onClick={findGame}>Find a Game</Button>
        }

        return (
            <div style={getStyles()}>
                {comp}
            </div>
        );
    }
};