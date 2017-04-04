import React from 'react';
import { Button, Form } from 'semantic-ui-react'

export default class Login extends React.Component{
    render() {
        return (
            <div>
                <h1>Login</h1>
                <Form style={{left: '35%', maxWidth: '30%', minWidth: '200px'}}>
                    <Form.Field>
                        <label style={{textAlign: 'left'}}>Username</label>
                        <input placeholder='Username' />
                    </Form.Field>
                    <Form.Field>
                        <label style={{textAlign: 'left'}}>Password</label>
                        <input type='password' placeholder='Password' />
                    </Form.Field>
                    <Button type='submit' color='green' size='massive'>Submit</Button>
                </Form>
            </div>
        );
    }
};