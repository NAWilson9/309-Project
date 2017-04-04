import 'browser-request';

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

export function login(){
    console.log('testttt');
    request({method:'POST', url:'/api/user/login', body:'{"relaxed":true}', json: true}, function(){console.log('test')});
}