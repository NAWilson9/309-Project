import store from './store'

const socket = io.connect(window.location.origin);

// Request handlers
export function leaveQueue(){
    socket.emit('leaveQueue');
    store.dispatch({
        type: 'leaveQueue',
        payload: null
    });
}

export function findGame(){
    //Returns a randomly generated 14 character string, starting with 'game'.
    function keyGen(){
        let key = 'generic';
        const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for(let i = 0; i < 10; i++ ){
            key += possible[Math.floor(Math.random() * possible.length)];
        }
        return key;
    }

    let guid = store.getState().user._id || keyGen();
    socket.emit('findGame', guid, function(){
        // This callback is used to prevent the loading elements from
        // flickering on the screen before the game board loads.
        store.dispatch({
            type: 'findGame',
            payload: null,
        });
    });
}

export function leaveGame(){
    socket.emit('leaveGame');
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

    console.log(gameState);
    store.dispatch({
        type: 'updateGameState',
        payload: gameState
    })
});

socket.on('playerLeft', function() {
    store.dispatch({
        type: 'leaveGame',
        payload: null,
    });
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

socket.on('currentGames', function(games){
    store.dispatch({
      type: 'currentGames',
      payload: games
    });
});