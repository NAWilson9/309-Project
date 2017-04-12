import React from 'react'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'

import { logout } from '../actions/user_actions.js';

@connect((store) => {
    return {
        currentPage: store.view.current,
        loggedIn: store.user.username
    };
})
export default class CHSSHeader extends React.Component {
    changePage(target){
        this.props.dispatch({
            type: 'changeView',
            payload: target,
        });
    };

    render(){
        return (
            <Menu size='huge'>
                <Menu.Item
                    active={this.props.currentPage === 'home'}
                    children={<strong>CHSS</strong>}
                    color='green'
                    header
                    onClick={() => this.changePage('home')}
                />
                <Menu.Item
                    active={this.props.currentPage === 'game'}
                    color='green'
                    icon='game'
                    name='Play'
                    onClick={() => this.changePage('game')}
                />
                <Menu.Item
                    active={this.props.currentPage === 'editor'}
                    color='green'
                    icon='write'
                    name='Editor'
                    onClick={() => this.changePage('editor')}
                />
                <Menu.Item
                    active={this.props.currentPage === 'ranking'}
                    color='green'
                    icon='trophy'
                    name='Ranking'
                    onClick={() => this.changePage('ranking')}
                />
                <Menu.Menu position='right'>
                    <Menu.Item
                        active={this.props.currentPage === 'profile'}
                        color='green'
                        icon='user'
                        name='Profile'
                        onClick={() => this.changePage('profile')}
                    />
                    {this.props.loggedIn &&
                        <Menu.Item
                            active={this.props.currentPage === 'logout'}
                            color='red'
                            icon='sign out'
                            onClick={() => logout()}
                        />
                    }
                </Menu.Menu>
            </Menu>
        );
    }
}
