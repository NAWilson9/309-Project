import React from 'react'
import { connect } from "react-redux"
import { Grid } from 'semantic-ui-react'

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
        winner: store.game.over,
    };
})
export default class GameView extends React.Component{
    render() {
        return (
            <Grid style={getStyles()}>
                {this.props.winner === true &&
                    <Message
                        error
                        content="Game over!"
                        style={{
                            marginTop: '-75px',
                        }}
                    />
                }
                <Grid.Column width={7}><Board/></Grid.Column>
                <Grid.Column width={9}><BoardSidebar/></Grid.Column>
            </Grid>
        );
    }
};