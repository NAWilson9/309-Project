import React from 'react'
import { Segment, Grid } from 'semantic-ui-react'
import Board from './board.jsx';
import BoardSidebar from './board_sidebar.jsx';


const getStyles = function(props){
    return {
        marginLeft: '14px',
        marginRight: '14px',
        marginTop: '14px'
    }
};

export default class GameView extends React.Component{
    render() {
        return (
            <Grid style={getStyles()}>
                <Grid.Column width={7}><Board/></Grid.Column>
                <Grid.Column width={9}><BoardSidebar/></Grid.Column>
            </Grid>
        );
    }
};