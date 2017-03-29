import { Provider } from "react-redux";
import React from 'react';
import ReactDOM from 'react-dom';

import './socket.js';
import Page from './components/page.jsx';
import store from "./store"

ReactDOM.render(
    <Provider store={store}>
        <Page/>
    </Provider>, document.getElementById('CHSS')
);