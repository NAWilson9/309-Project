import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";

import Page from './components/page.jsx';
import store from "./store"

ReactDOM.render(
    <Provider store={store}>
        <Page/>
    </Provider>, document.getElementById('app'));

setTimeout(function(){
    store.dispatch({
        type: "gg",
        payload: true
    });
    console.log(store.getState());
}, 3000);

