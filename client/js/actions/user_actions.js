import request from 'browser-request';

import store from '../store'

export function logout(){
    store.dispatch({
        type: 'logout',
        payload: null
    });

    setTimeout(function(){
        if(store.getState().view.current === 'logout'){
            store.dispatch({
                type: 'changeView',
                payload: 'home',
            });
        }
    }, 3000);
}

export function login(username, password, callback){
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
        } else {
            callback();
        }
    });
}

export function register(username, password, callback){
    let credentials = {
        'username': username,
        'password': password
    };

    request({method:'POST', url:'/api/user/register', body:credentials, json: true}, function(err, response, body){
        if(response.statusCode === 200){
            store.dispatch({
                type: 'login',
                payload: body,
            });
        } else {
            callback();
        }
    });
}

export function changePassword(userID, password, callback){
    let credentials = {
        'userID': userID,
        'password': password
    };

    request({method:'POST', url:'/api/user/profile?userID=' + userID, body:credentials, json: true}, function(err, response){
        callback(response.statusCode === 200);
    });
}