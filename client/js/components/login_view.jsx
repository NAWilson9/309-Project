import React from 'react';
import { Button, Form } from 'semantic-ui-react';

import { login } from '../actions/user_actions.js';

export default class LoginView extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        };

        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
    }

    handleUsername(event){
        this.setState({username: event.target.value});
    }

    handlePassword(event){
        this.setState({password: event.target.value});
    }

    render() {
        return (
            <div>
                <h1>Login</h1>
                <Form style={{left: '35%', maxWidth: '30%', minWidth: '200px'}}>
                    <Form.Field>
                        <label style={{textAlign: 'left'}}>Username</label>
                        <input placeholder='Username' value={this.state.username} onChange={this.handleUsername} />
                    </Form.Field>
                    <Form.Field>
                        <label style={{textAlign: 'left'}}>Password</label>
                        <input type='password' placeholder='Password'  value={this.state.password} onChange={this.handlePassword}/>
                    </Form.Field>
                    <Button color='green' onClick={() => login(this.state.username, this.state.password)} type="button" size='massive'>Submit</Button>
                </Form>
            </div>
        );
    }
};