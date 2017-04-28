export default function reducer(state={
    players: [],
    board: [
        [
            {
                number: 1,
                name: 'rook'
            },
            {
                number: 2,
                name: 'knight'
            },
            {
                number: 3,
                name: 'bishop'
            },
            {
                number: 4,
                name: 'king'
            },
            {
                number: 5,
                name: 'queen'
            },
            {
                number: 6,
                name: 'bishop'
            },
            {
                number: 7,
                name: 'knight'
            },
            {
                number: 8,
                name: 'rook'
            },
        ],
        [
            {
                number: 1,
                name: 'pawn'
            },
            {
                number: 2,
                name: 'pawn'
            },
            {
                number: 3,
                name: 'pawn'
            },
            {
                number: 4,
                name: 'pawn'
            },
            {
                number: 5,
                name: 'pawn'
            },
            {
                number: 6,
                name: 'pawn'
            },
            {
                number: 7,
                name: 'pawn'
            },
            {
                number: 8,
                name: 'pawn'
            },
        ],
        [
            null, null, null, null, null, null, null, null,
        ],
        [
            null, null, null, null, null, null, null, null,
        ],
        [
            null, null, null, null, null, null, null, null,
        ],
        [
            null, null, null, null, null, null, null, null,
        ],
        [
            {
                number: 1,
                name: 'pawn'
            },
            {
                number: 2,
                name: 'pawn'
            },
            {
                number: 3,
                name: 'pawn'
            },
            {
                number: 4,
                name: 'pawn'
            },
            {
                number: 5,
                name: 'pawn'
            },
            {
                number: 6,
                name: 'pawn'
            },
            {
                number: 7,
                name: 'pawn'
            },
            {
                number: 8,
                name: 'pawn'
            },
        ],
        [
            {
                number: 1,
                name: 'rook'
            },
            {
                number: 2,
                name: 'knight'
            },
            {
                number: 3,
                name: 'bishop'
            },
            {
                number: 4,
                name: 'king'
            },
            {
                number: 5,
                name: 'queen'
            },
            {
                number: 6,
                name: 'bishop'
            },
            {
                number: 7,
                name: 'knight'
            },
            {
                number: 8,
                name: 'rook'
            },
        ]
    ],
    over: false,
    moves: 0,
    time: 0,
    players: null,
    activePlayer: null,
    moveDestination: null,
    moveStartPosition: null,
    inGame: false,
    inQueue: false,
    gamesInProgress: []
}, action) {

    switch (action.type) {
        case 'pieceMoveDestination': {
            // console.log('move: ' + action.payload);
            return {...state, moveDestination: action.payload}
        }
        case 'pieceMoveComplete': {
            // console.log('complete: ' + action.payload);
            console.log({start: action.payload, end: state.moveDestination});
            // socket.emit('/movePiece', {start: action.payload, end: state.moveDestination});

            let destinationPosition = state.moveDestination;//.split(',');
            // let destinationPiece = Object.assign({}, state.board[destinationPosition[0]][destinationPosition[1]]);

            let startingPosition = action.payload;//.split(',');
            let startPiece = Object.assign({}, state.board[startingPosition.y][startingPosition.x]);

            let board = JSON.parse(JSON.stringify(state.board));
            board[destinationPosition.y][destinationPosition.x] = startPiece;
            board[startingPosition.y][startingPosition.x] =  {
                number: startPiece.number,
                name: null,
            };
            console.log( board[destinationPosition.y][destinationPosition.x]);

            return {...state, board: board}
        }
        case 'updateGameState': {
            const gameState = action.payload;
            console.log(gameState.players);
            return {...state, board: gameState.board, players: gameState.players, activePlayer: gameState.activePlayer, moves: gameState.moveCount }
        }
        case 'currentGames': {
            return {...state, gamesInProgress: action.payload}
        }
        default: {
            return state
        }
    }
}