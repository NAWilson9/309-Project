import store from "../store"

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