import { Provider } from "react-redux";
import React from 'react';
import ReactDOM from 'react-dom';

import store from "./store"
import Page from './components/page.jsx';

ReactDOM.render(
    <Provider store={store}>
        <Page/>
    </Provider>, document.getElementById('CHSS')
);


//Todo: Remove these
setInterval(function(){
    store.dispatch({
        type: "gg",
        payload: true
    });

    store.dispatch({
        type: "move",
        payload: true
    });
}, 3000);

setInterval(function(){
    store.dispatch({
        type: "tick",
        payload: null
    });
}, 1000);
