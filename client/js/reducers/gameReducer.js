export default function reducer(state={
    //Todo: Get rid of the junk
    players: [],
    board: [
        [
            {
                number: 1,
                image: 'rook.svg'
            },
            {
                number: 2,
                image: 'knight.svg'
            },
            {
                number: 3,
                image: 'bishop.svg'
            },
            {
                number: 4,
                image: 'king.svg'
            },
            {
                number: 5,
                image: 'queen.svg'
            },
            {
                number: 6,
                image: 'bishop.svg'
            },
            {
                number: 7,
                image: 'knight.svg'
            },
            {
                number: 8,
                image: 'rook.svg'
            },
        ],
        [
            {
                number: 1,
                image: 'pawn.svg'
            },
            {
                number: 2,
                image: 'pawn.svg'
            },
            {
                number: 3,
                image: 'pawn.svg'
            },
            {
                number: 4,
                image: 'pawn.svg'
            },
            {
                number: 5,
                image: 'pawn.svg'
            },
            {
                number: 6,
                image: 'pawn.svg'
            },
            {
                number: 7,
                image: 'pawn.svg'
            },
            {
                number: 8,
                image: 'pawn.svg'
            },
        ],
        [
            {
                number: 1,
                image: null
            },
            {
                number: 2,
                image: null
            },
            {
                number: 3,
                image: null
            },
            {
                number: 4,
                image: null
            },
            {
                number: 5,
                image: null
            },
            {
                number: 6,
                image: null
            },
            {
                number: 7,
                image: null
            },
            {
                number: 8,
                image: null
            },
        ],
        [
            {
                number: 1,
                image: null
            },
            {
                number: 2,
                image: null
            },
            {
                number: 3,
                image: null
            },
            {
                number: 4,
                image: null
            },
            {
                number: 5,
                image: null
            },
            {
                number: 6,
                image: null
            },
            {
                number: 7,
                image: null
            },
            {
                number: 8,
                image: null
            },
        ],
        [
            {
                number: 1,
                image: null
            },
            {
                number: 2,
                image: null
            },
            {
                number: 3,
                image: null
            },
            {
                number: 4,
                image: null
            },
            {
                number: 5,
                image: null
            },
            {
                number: 6,
                image: null
            },
            {
                number: 7,
                image: null
            },
            {
                number: 8,
                image: null
            },
        ],
        [
            {
                number: 1,
                image: null
            },
            {
                number: 2,
                image: null
            },
            {
                number: 3,
                image: null
            },
            {
                number: 4,
                image: null
            },
            {
                number: 5,
                image: null
            },
            {
                number: 6,
                image: null
            },
            {
                number: 7,
                image: null
            },
            {
                number: 8,
                image: null
            },
        ],
        [
            {
                number: 1,
                image: 'pawn.svg'
            },
            {
                number: 2,
                image: 'pawn.svg'
            },
            {
                number: 3,
                image: 'pawn.svg'
            },
            {
                number: 4,
                image: 'pawn.svg'
            },
            {
                number: 5,
                image: 'pawn.svg'
            },
            {
                number: 6,
                image: 'pawn.svg'
            },
            {
                number: 7,
                image: 'pawn.svg'
            },
            {
                number: 8,
                image: 'pawn.svg'
            },
        ],
        [
            {
                number: 1,
                image: 'rook.svg'
            },
            {
                number: 2,
                image: 'knight.svg'
            },
            {
                number: 3,
                image: 'bishop.svg'
            },
            {
                number: 4,
                image: 'king.svg'
            },
            {
                number: 5,
                image: 'queen.svg'
            },
            {
                number: 6,
                image: 'bishop.svg'
            },
            {
                number: 7,
                image: 'knight.svg'
            },
            {
                number: 8,
                image: 'rook.svg'
            },
        ]
    ],
    over: false,
    moves: 0,
    time: 0,
    moveDestination: null,
    moveStartPosition: null,
    inGame: false,
    inQueue: false
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
                image: null
            };
            console.log( board[destinationPosition.y][destinationPosition.x]);

            return {...state, board: board}
        }
        case 'updateGameState': {
            const gameState = action.payload;
            return {...state, board: gameState.board }
        }
        default: {
            return state
        }
    }
}