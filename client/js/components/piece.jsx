import React from 'react';

export default class Piece extends React.Component{
    render(){
        let color = !this.props.isUsers ? 'hue-rotate(90deg)' : '';
        return (
            <img
                src={'./images/' + this.props.image}
                style={{maxWidth: '96%', maxHeight: '96%', filter: color}}
            />
        );
    }
};