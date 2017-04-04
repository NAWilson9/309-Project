import store from './store'

const socket = io.connect(window.location.origin);

// Request handlers
export function cancelGameSearch(){
    socket.emit('cancelGameSearch');
    store.dispatch({
        type: 'cancelGameSearch',
        payload: null
    });
}

export function findGame(){
    socket.emit('findGame', function(){
        // This callback is used to prevent the loading elements from
        // flickering on the screen before the game board loads.
        store.dispatch({
            type: 'findGame',
            payload: null,
        });
    });
}

export function movePiece(move) {
    socket.emit('movePiece', move);
}

export function sendMessage(message){
    socket.emit('sendMessage', message);
}

// Listeners
socket.on('debug', function(data){
    console.log(data);
});

socket.on('gameFound', function(gameState){
    store.dispatch({
        type: 'gameFound',
        payload: null
    });
    store.dispatch({
        type: 'updateGameState',
        payload: gameState
    })
});

socket.on('updateGameState', function(gameState) {
    store.dispatch({
        type: 'updateGameState',
        payload: gameState
    });
});

socket.on('chatMessage', function(message){
    store.dispatch({
        type: 'chatMessage',
        payload: message
    });
});