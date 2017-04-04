import store from "./store"

const socket = io.connect(window.location.origin);
export default socket;

// Request handlers
export function findGame(){
    socket.emit('findGame', function(result){
        //Result is false if the user was placed in queue.
        //Result is true if the user was immediately placed in a game.
        //This check is used to prevent the loading components from flickering
        //on the screen before the game board loads.
        if(!result){
            store.dispatch({
                type: 'findGame',
                payload: null,
            });
        }
    });
}

export function cancelGameSearch(){
    socket.emit('cancelGameSearch');
    store.dispatch({
        type: 'cancelGameSearch',
        payload: null,
    });
}

export function sendChatMessage(message){
    socket.emit('sendChatMessage', message);
}

export function requestMovePiece(movement) {
    socket.emit('requestMovePiece', movement);
}

// Listeners
socket.on('debug', function(data){
    console.log(data);
});

socket.on('gameFound', function(){
    store.dispatch({
        type: 'gameFound',
        payload: null,
    });
});

socket.on('chatMessage', function(data){
   store.dispatch({
       type: 'newChatMessage',
       payload: data,
   });
});

socket.on('updateGameState', function(gameState) {
    store.dispatch({
        type: 'updateGameState',
        payload: gameState,
    });
});