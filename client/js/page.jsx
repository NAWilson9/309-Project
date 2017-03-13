import React from 'react'
import GameView from './game_view.jsx';
import CHSSHeader from './header.jsx';


const Page = React.createClass({
    render() {
        return (
            <div>
                <CHSSHeader/>
                <GameView/>
            </div>
        );
    }
});


export default Page;