import React from 'react';
import { Button, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux'

@connect((store) => {
    return {
        games: store.game.gamesInProgress
    };
})
export default class Spectate extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      gameSelected: null
    };

    this.segmentMaker = this.segmentMaker.bind(this);
  }

  segmentMaker(){
    let segments = [];
    if(this.props.games.length === 0){
      segments.push(<Segment key={0} disabled>No games in progress</Segment>)
    } else {
      let that = this;
      for(let game of this.props.games){
        segments.push(<Segment key={game} className={(game === this.state.gameSelected) ? 'watchSegment_selected' : 'watchSegment'} onClick={function(){that.setState({gameSelected: game}); }}>{game.playerTop} <strong style={{color: '#21BA45'}}>vs.</strong> {game.playerBottom} <strong style={{color: '#21BA45'}}>|</strong> Moves: {game.moveCount}</Segment>);
      }
    }
    return segments;
  }

  render() {
    return (
      <div>
        <div>
          <h1>Games in Progress</h1>
          <Segment.Group style={{left: '35%', maxWidth: '30%', minWidth: '200px', marginBottom: '15px', overflow: 'hidden', maxHeight: '700px', overflowY: 'auto'}}>
            {this.segmentMaker()}
          </Segment.Group>
        </div>
        <Button disabled={this.state.gameSelected === null} color="green" type='submit' size='massive' style={{marginBottom: '10px'}}>Watch</Button>
      </div>
    );
  }
};