import React from 'react';
import { Button, Form, Message } from 'semantic-ui-react';

import { login, register } from '../actions/user_actions.js';

export default class LoginView extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            authError: false,
            password: '',
            regError: false,
            username: ''
        };

        this.formEventHandler = this.formEventHandler.bind(this);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }

    formEventHandler(event){
        if(event.target.placeholder === 'Username'){
            this.setState({authError: false, regError: false, username: event.target.value});
        } else {
            this.setState({authError: false, regError: false, password: event.target.value});
        }
    }

    login(event){
        event.preventDefault();
        let that = this;
        login(this.state.username, this.state.password, function(){
            that.setState({authError: true, password: ''});
        });
    }

    register(event){
        event.preventDefault();
        let that = this;
        register(this.state.username, this.state.password, function(){
            that.setState({regError: true, username: '', password: ''});
        });
    }

    render() {
        return (
            <div>
                {this.state.authError === true &&
                    <Message
                        error
                        header="Unauthorized"
                        content="Invalid username or password."
                        style={{
                            marginTop: '-75px',
                        }}
                    />
                }
                {this.state.regError === true &&
                <Message
                    error
                    header="Error"
                    content="Desired username is already in use."
                    style={{
                        marginTop: '-75px',
                    }}
                />
                }
                <h1>Login</h1>
                <Form style={{left: '35%', maxWidth: '30%', minWidth: '200px'}}>
                    <Form.Field>
                        <label style={{textAlign: 'left'}}>Username</label>
                        <input placeholder='Username' value={this.state.username} onChange={this.formEventHandler} />
                    </Form.Field>
                    <Form.Field>
                        <label style={{textAlign: 'left'}}>Password</label>
                        <input type='password' placeholder='Password'  value={this.state.password} onChange={this.formEventHandler}/>
                    </Form.Field>
                    <Button color="green" disabled={!(this.state.username.length > 0 && this.state.password.length > 3)} onClick={this.login} type='submit' size='massive' style={{marginBottom: '10px'}}>Submit</Button>
                    <Button color="blue" disabled={!(this.state.username.length > 0 && this.state.password.length > 3)} onClick={this.register} size='massive'>Register</Button>
                </Form>
            </div>
        );
    }
};