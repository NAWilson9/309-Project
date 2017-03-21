import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";

import Page from './components/page.jsx';
import store from "./store"

ReactDOM.render(
    <Provider store={store}>
        <Page/>
    </Provider>, document.getElementById('app'));

setInterval(function(){
    store.dispatch({
        type: "gg",
        payload: true
    });

    store.dispatch({
        type: "move",
        payload: true
    });

    console.log(store.getState());
}, 3000);

setInterval(function(){
    store.dispatch({
        type: "tick",
        payload: null
    });
}, 1000);
