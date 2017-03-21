import React from 'react';
import { Menu } from 'semantic-ui-react'


// const getStyles = function(props){
//     return {
//         height: (100/props.numberOfRows) + '%'
//     }
// };

const GameInfoPanel = React.createClass({
    render() {
        return (
            <Menu>
                <Menu.Item header>CHSS</Menu.Item>
            </Menu>
        );
    }
});


export default GameInfoPanel;