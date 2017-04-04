import React from 'react'

export default class HomeView extends React.Component{
    render() {
        return (
            <div>
                <h1>Welcome to CHSS!</h1>
                <img src={'./images/pawn.svg'} style={{height: '160px', width: '160px'}}/>
            </div>
        )
    }
};