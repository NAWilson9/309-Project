import store from "./store"

const socket = io.connect(window.location.origin);

// Request handlers
export function findGame(){
    socket.emit('findGame', function(){
        //This callback is used to prevent the loading components from
        // flickering on the screen before the game board loads.
        store.dispatch({
            type: 'findGame',
            payload: null,
        });
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

export function movePiece(movement) {
    socket.emit('movePiece', movement);
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

socket.on('chatMessage', function(data){
   store.dispatch({
       type: 'newChatMessage',
       payload: data
   });
});

socket.on('updateGameState', function(gameState) {
    store.dispatch({
        type: 'updateGameState',
        payload: gameState
    });
});