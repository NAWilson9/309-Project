import React from 'react';
import { Accordion, Segment, Icon} from 'semantic-ui-react';
import ChatPanel from './chat_panel.jsx';
import GameInfo from './gameInfo.jsx';

const getStyles = function(props){
    return {
        // display: 'inline-block',
        height: '100%',
        // width: '30%'
    }
};

const getPanels = function(){
  return [
      {
          'title': 'Game Info',
          'content': 'Some good info'
      },
      {
          'title': 'Match Chat',
          'content': 'Trash talking n that'
      },
      {
          'title': 'Opponent Info',
          'content': 'Silver scrub'
      }
  ]
};

const BoardRow = React.createClass({
    render() {
        return (
            <Segment style={getStyles(this.props)}>
                <Accordion>
                    <Accordion.Title>
                        <Icon name='dropdown' />
                        Game Info
                    </Accordion.Title>
                    <Accordion.Content>
                        <GameInfo/>
                    </Accordion.Content>
                    <Accordion.Title>
                        <Icon name='dropdown' />
                        Match Chat
                        {true == true && <Icon name='comment'/>}
                    </Accordion.Title>
                    <Accordion.Content>
                        <ChatPanel/>
                    </Accordion.Content>
                </Accordion>
            </Segment>
        );
    }
});


export default BoardRow;
