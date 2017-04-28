import React from 'react'
import { connect } from "react-redux"
import { Grid, Message } from 'semantic-ui-react'

import Board from './board.jsx';
import BoardSidebar from './board_sidebar.jsx';


const getStyles = function(){
    return {
        marginLeft: '14px',
        marginRight: '14px',
        marginTop: '14px'
    }
};

@connect((store) => {
    return {
        winner: store.game.winner,
    };
})
export default class GameView extends React.Component{
    render() {
        return (
            <div>
                {this.props.winner != null &&
                    <Message
                        error
                        content="Game over!"
                        style={{
                        }}
                    />
                }
            <Grid style={getStyles()}>
                <Grid.Column width={7}><Board/></Grid.Column>
                <Grid.Column width={9}><BoardSidebar/></Grid.Column>
            </Grid>
            </div>
        );
    }
};