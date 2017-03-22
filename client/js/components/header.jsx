import React from 'react'
import { Menu } from 'semantic-ui-react'

export default class CHSSHeader extends React.Component {

    changePage(target){
        this.props.dispatch({
            type: 'changeView',
            payload: target
        });
    }

    render(){
        return (
            <Menu size='huge'>
                <Menu.Item active={this.props.currentPage === 'home'} color="green" onClick={() => this.changePage('home')} header>CHSS</Menu.Item>
                <Menu.Item active={this.props.currentPage === 'game'} color="green" name='Play' icon="game" onClick={() => this.changePage('game')}/>
                <Menu.Item active={this.props.currentPage === 'editor'} color="green" name='Editor' icon="write" onClick={() => this.changePage('editor')}/>
                <Menu.Item active={this.props.currentPage === 'ranking'} color="green" name='Ranking' icon="trophy" onClick={() => this.changePage('ranking')}/>
                <Menu.Menu position='right'>
                    <Menu.Item active={this.props.currentPage === 'profile'} color="green" name="Profile" icon="user" onClick={() => this.changePage('profile')}/>
                    <Menu.Item icon="sign out" onClick={() => this.changePage('logout')}/>
                </Menu.Menu>
            </Menu>
        );
    }
}
