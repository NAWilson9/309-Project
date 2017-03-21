import React from 'react';
import { Accordion, Segment, Icon} from 'semantic-ui-react';
import ChatPanel from './chat_panel.jsx';

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

const getChat = function(){
    return [
        {
            'username':'Player 1',
            'time': '11:45AM',
            'content': 'Ur trash'
        },
        {
            'username':'Player 2',
            'time': '11:45AM',
            'content': 'i know'
        },
        {
            'username':'Player 1',
            'time': '11:46AM',
            'content': 'Git Gud'
        },
        {
            'username':'Player 2',
            'time': '11:45AM',
            'content': 'I\'m trying but I can\'t'
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

                    </Accordion.Content>
                    <Accordion.Title>
                        <Icon name='dropdown' />
                        Opponent Info
                    </Accordion.Title>
                    <Accordion.Content>

                    </Accordion.Content>
                    <Accordion.Title>
                        <Icon name='dropdown' />
                        Match Chat
                        {true == true && <Icon name='comment'/>}
                    </Accordion.Title>
                    <Accordion.Content>
                        <ChatPanel chatEntries={getChat()}/>
                    </Accordion.Content>
                </Accordion>
            </Segment>
        );
    }
});


export default BoardRow;
