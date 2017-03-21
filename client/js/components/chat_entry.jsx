import React from 'react'
import { Feed } from 'semantic-ui-react'

// const getStyles = function(props){
//     return {
//         display: 'inline-block',
//         height: '100%',
//         width: '18%'
//     }
// };

const ChatEntry= React.createClass({
    render() {
        return (
            <Feed.Event>
                <Feed.Content>
                    <Feed.Summary>
                        <Feed.User>{this.props.entryData.username}</Feed.User>
                        <Feed.Date>{this.props.entryData.time}</Feed.Date>
                    </Feed.Summary>
                    <Feed.Extra text>{this.props.entryData.content}</Feed.Extra>
                </Feed.Content>
            </Feed.Event>
        );
    }
});


export default ChatEntry;
