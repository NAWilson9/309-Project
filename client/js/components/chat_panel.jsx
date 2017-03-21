import React from 'react'
import { connect } from "react-redux"
import { Button, Feed, Input } from 'semantic-ui-react'
import ChatEntry from './chat_entry.jsx'

// const getStyles = function(props){
//     return {
//         display: 'inline-block',
//         height: '100%',
//         width: '18%'
//     }
// };

@connect((store) => {
    return {
        log: store.chat.log
    };
})
export default class ChatPanel extends React.Component{
    render() {
        const chatItems = this.props.log.map(function(entry, i){
           return <ChatEntry key={i} entryData={entry}/>
        });

        return (
            <div>
                <Feed>
                    {chatItems}
                </Feed>
                <div>
                    <Input fluid placeholder="New message...">
                        <input onSubmit={function(){console.log('test')}}/>
                        <Button type="submit">Enter</Button>
                    </Input>
                </div>
            </div>
        );
    }
};