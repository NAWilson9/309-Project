import React from 'react';
import { connect } from 'react-redux'

@connect((store) => {
    return {
        inGame: store.view.inGame
    };
})
export default class ProfileView extends React.Component{
    render() {
        return (
            <main>
                Todo...
            </main>
        );
    }
};