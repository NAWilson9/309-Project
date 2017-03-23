import React from 'react';

export default class Piece extends React.Component{
    render(){
        return (
            <img
                src={'./images/' + this.props.image}
                style={{maxWidth: '96%', maxHeight: '96%'}}
            />
        );
    }
};