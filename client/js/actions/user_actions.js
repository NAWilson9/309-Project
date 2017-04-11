import request from 'browser-request';

import store from '../store'

export function logout(){
    setTimeout(function(){
        store.dispatch({
            type: 'logout',
            payload: null,
        });
        store.dispatch({
            type: 'changeView',
            payload: 'home',
        });
    }, 3000);
}

export function login(username, password){
    console.log('testttt');
    let credentials = {
        'username': username,
        'password': password
    };

    request({method:'POST', url:'/api/user/login', body:credentials, json: true}, function(err, response, body){
        if(response.statusCode === 200){
            store.dispatch({
                type: 'login',
                payload: body,
            });
            console.log('login worked.');
        } else if(response.statusCode === 401){
            console.error('hacker');
        } else if(response.statusCode === 400){
            console.error('trash request. try again kiddo.');
        } else {
            //todo: do something
        }
    });
}