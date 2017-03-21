import React from 'react'
import { Menu } from 'semantic-ui-react'

class CHSSHeader extends React.Component {
    render(){
        return (
            <Menu size='huge'>
                <Menu.Item header>CHSS</Menu.Item>
                <Menu.Item name='Play' icon="game"/>
                <Menu.Item name='Editor' icon="write"/>
                <Menu.Item name='Ranking' icon="trophy"/>
                <Menu.Menu position='right'>
                    <Menu.Item name="Profile" icon="user"/>
                    <Menu.Item icon="sign out"/>
                </Menu.Menu>
            </Menu>
        );
    }
}

export default CHSSHeader;
