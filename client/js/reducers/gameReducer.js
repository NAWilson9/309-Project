export default function reducer(state={
    players: [],
    board: [],
    over: false,
    moves: 0,
    time: 0,
    players: null,
    activePlayer: null,
    winner: null,
    moveDestination: null,
    moveStartPosition: null,
    inGame: false,
    inQueue: false,
    gamesInProgress: []
}, action) {

    switch (action.type) {
        case 'pieceMoveDestination': {
            return {...state, moveDestination: action.payload}
        }
        case 'pieceMoveComplete': {
            let destinationPosition = state.moveDestination;
            let startingPosition = action.payload;
            let startPiece = Object.assign({}, state.board[startingPosition.y][startingPosition.x]);

            let board = JSON.parse(JSON.stringify(state.board));
            board[destinationPosition.y][destinationPosition.x] = startPiece;
            board[startingPosition.y][startingPosition.x] =  {
                number: startPiece.number,
                name: null,
            };

            return {...state, board: board}
        }
        case 'updateGameState': {
            const gameState = action.payload;
            return {...state, board: gameState.board, players: gameState.players, activePlayer: gameState.activePlayer, winner: gameState.winner, moves: gameState.moveCount }
        }
        case 'currentGames': {
            return {...state, gamesInProgress: action.payload}
        }
        default: {
            return state
        }
    }
}