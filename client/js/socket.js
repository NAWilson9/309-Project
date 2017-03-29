import store from "./store"

const socket = io.connect(window.location.origin);
export default socket;

// Request handlers
export function findGame(){
    socket.emit('findGame');
    store.dispatch({
        type: 'findGame',
        payload: null
    });
}

export function cancelGameSearch(){
    socket.emit('cancelGameSearch');
    store.dispatch({
        type: 'cancelGameSearch',
        payload: null
    });
}

export function sendChatMessage(message){
    socket.emit('sendChatMessage', message);
}

// Listeners
socket.on('debug', function(data){
    console.log(data);
});

socket.on('gameFound', function(){
    store.dispatch({
        type: 'gameFound',
        payload: null
    })
});

socket.on('chatMessage', function(data){
   store.dispatch({
       type: 'newChatMessage',
       payload: data
   })
});