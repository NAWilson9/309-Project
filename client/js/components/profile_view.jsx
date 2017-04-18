import React from 'react';
import { connect } from 'react-redux'
import { Button, Divider, Form, List, Message } from 'semantic-ui-react';

import { changePassword } from '../actions/user_actions.js';

@connect((store) => {
    return {
        user: store.user
    };
})
export default class ProfileView extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            changeError: false,
            changeSuccess: false,
            password: ''
        };

        this.formEventHandler = this.formEventHandler.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    formEventHandler(event){
        this.setState({changeError: false, password: event.target.value});
    }

    changePassword(event){
        event.preventDefault();
        let that = this;
        changePassword(this.props.user.username, this.state.password, function(success){
            that.setState({changeError: !success, changeSuccess: success, password: ''}); //Todo: Clear once displayed for 3 seconds
        });
    }

    render() {
        return (
            <div>
                <h1>Profile</h1>
                <span id="profile" style={{left: '50%', maxWidth: '30%', minWidth: '200px'}}>
                    <List id="profileList">
                        <List.Item>Username: <span>Nick</span></List.Item>
                        <List.Item>Rank: <span>{this.props.user.rating}</span></List.Item>
                        <List.Item style={{color: '#21BA45'}}>Wins: <span>{this.props.user.wins}</span></List.Item>
                        <List.Item style={{color: '#FBBD08'}}>Draws: <span>{this.props.user.draws}</span></List.Item>
                        <List.Item style={{color: '#DB2828'}}>Losses: <span>{this.props.user.losses}</span></List.Item>
                        <Divider style={{width: '30%', marginLeft: '35%'}}/>
                        <List.Item>Change Password</List.Item>
                        {this.state.changeError === true &&
                        <Message
                            error
                            content="Unable to save new password."
                        />
                        }
                        {this.state.changeSuccess === true &&
                        <Message
                            success
                            content="New password saved."
                        />
                        }
                        <Form style={{left: '40%', maxWidth: '20%', minWidth: '200px', marginBottom: '10px', marginTop: '10px'}} onSubmit={this.changePassword}>
                             <Form.Field>
                                    <input style={{textAlign: 'center'}} placeholder='New password' value={this.state.password} onChange={this.formEventHandler} />
                            </Form.Field>
                        </Form>
                        <Button color="red" disabled={!(this.state.password.length > 3)} onClick={this.changePassword} size='large'>Change</Button>
                    </List>
                </span>
            </div>
        );
    }
};