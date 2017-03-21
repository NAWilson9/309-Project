import React from 'react'
import { Feed } from 'semantic-ui-react'
import ChatEntry from './chat_entry.jsx'

// const getStyles = function(props){
//     return {
//         display: 'inline-block',
//         height: '100%',
//         width: '18%'
//     }
// };

const ChatPanel = React.createClass({
    render() {
        const chatItems = this.props.chatEntries.map(function(entry, i){
           return <ChatEntry key={i} entryData={entry}/>
        });

        return (
           <Feed>
               {chatItems}
           </Feed>
        );
    }
});


export default ChatPanel;
