import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button/Button';

export class testButton extends React.Component {
    render(){
        return (
            <Button className="navbar-dark" fluid>
                "Button Test"
            </Button>
        );
    }
}