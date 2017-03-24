/**
 * Created by ajrmatt on 3/16/17.
 */
// let db;
import Board from './Board'
import { Knight, Rook, Queen, King, Bishop, Pawn } from './Piece'

export default class Game {
    constructor(props) {
        this.players = props.players;
        this.activePlayer = props.firstPlayer;
        this.gameboard = props.pieceList ? null : generateClassicBoard(this);
        this.move = movePiece;
        // this.start = startGame;
        // this.generateClassicBoard = generateClassicBoard;
    }
}

// const startGame = function() {
//
// };

const movePiece = function(movement) {
    const from = movement.start;
    const to = movement.end;
    const piece = this.gameboard[from.y][from.x];
    const destinationPiece = this.gameboard[to.y][to.x];
    // console.log('Piece:', piece);
    // console.log('Destination piece:', destinationPiece, '\n');
    // if(player === this.activePlayer) {
    let isAttacking = null;
    if (piece) {
        if (piece.player === this.activePlayer) {
            if (destinationPiece) {
                if (destinationPiece.player === piece.player) {
                    console.log('Cannot occupy the same space as your own piece');
                }
                else if (destinationPiece.player !== piece.player) isAttacking = true;
            }
            else isAttacking = false;
        } else {
            console.log('Not your turn');
        }
    } else {
        console.log('Empty square');
    }
    if (isAttacking !== null) {
        // console.log('Is attacking:', isAttacking);
        let canMovePiece = canMove(piece, isAttacking, movement, this.gameboard);
        // console.log('Can move:', canMovePiece);
        if (canMovePiece) {
            this.gameboard[to.y][to.x] = this.gameboard[from.y][from.x];;
            this.gameboard[from.y][from.x] = null;
            printBoard(this.gameboard);
        }
    } else {

    }
    // } else {
    //     console.log('Not your turn');
    // }
    // console.log(db);
};

function canMove(piece, isAttacking, movement, board) {
    let canMove = { value: false, };
    let stepMap = piece.generateRelativeStepMap(isAttacking);
    for (let stepIndex in stepMap.start.nextSteps) {
        canMoveRecursive(piece, stepMap.start.nextSteps[stepIndex], movement, board, canMove);
    }
    return canMove.value;
}
function canMoveRecursive(piece, step, movement, board, canMove) {
    // Cut off if
    // !canJump &&
    let boardMaxX = board[0].length-1;
    let boardMaxY = board.length-1;
    let stepX = movement.start.x + step.relativeLocation.x;
    let stepY = movement.start.y + step.relativeLocation.y;
    if (stepX >= 0 && stepX <= boardMaxX && stepY >= 0 && stepY <= boardMaxY) {
        let stepLocationPiece = board[stepY][stepX];
        let stepIsDestination = (movement.end.x === stepX && movement.end.y === stepY);
        let branch = true;
        let canMoveHere = false;
        if (stepLocationPiece) {
            if (!piece.abilities.canJump) {
                // console.log('Cannot Jump');
                if (stepLocationPiece.player !== piece.player && step.canStopHere) {
                    canMoveHere = true;
                } else {
                    // stepPiece is owned by activePlayer
                }
                branch = false;
            } else {
                // console.log('Can Jump');
                //canJump
            }
        } else {
            // Empty square
            // console.log('Can stop here:', step.canStopHere, '\n', step);
            if (step.canStopHere) canMoveHere = true;
        }
        if (canMoveHere && stepIsDestination) {
            // console.log('Step is destination');
            canMove.value = true;
        }
        // console.log('Branch:', branch);
        // console.log
        if (branch && !canMove.value) {
            for (let stepIndex in step.nextSteps) {
                canMoveRecursive(piece, step.nextSteps[stepIndex], movement, board, canMove);
            }
        }
    } else {
        // out of bounds
    }
    // TODO: account for step.canStopHere
    // TODO: account for board edges
    // Check location == movement.end
}
// const playerOwnsPiece = (player, piece) => {
//     return (player === piece.player);
// };

// module.exports = (database) => {
//     db = database;
//     return Game;
// };

export function printBoard(board) {
    console.log();
    let topString = '   ';
    for (let colIndex in board[0]) {
        topString += colIndex + ' ';
    }
    console.log(topString);
    for(let rowIndex in board) {
        let row = board[rowIndex];
        let rowString = rowIndex + ' |';
        for (let colIndex in row) {
            let piece = row[colIndex];
            rowString += piece ? piece.name + '|' : '-|';
        }
        console.log(rowString);
    }
}

// TODO: account for jumping/path obstacles
// TODO: account for board edges
function generateClassicBoard(game) {
    return [
        [
            new Rook({
                name: 'R',
                userID: game.players.playerTop._id,
                _id: '11001010',
                player: game.players.playerTop,
            }),
            new Knight({
                name: 'N',
                userID: game.players.playerTop._id,
                _id: '11001010',
                player: game.players.playerTop,
            }),
            new Bishop({
                name: 'B',
                userID: game.players.playerTop._id,
                _id: '11001010',
                player: game.players.playerTop,
            }),
            new Queen({
                name: 'Q',
                userID: game.players.playerTop._id,
                _id: '11001010',
                player: game.players.playerTop,
            }),
            new King({
                name: 'K',
                userID: game.players.playerTop._id,
                _id: '11001010',
                player: game.players.playerTop,
            }),
            new Bishop({
                name: 'B',
                userID: game.players.playerTop._id,
                _id: '11001010',
                player: game.players.playerTop,
            }),
            new Knight({
                name: 'N',
                userID: game.players.playerTop._id,
                _id: '11001010',
                player: game.players.playerTop,
            }),
            new Rook({
                name: 'R',
                userID: game.players.playerTop._id,
                _id: '11001010',
                player: game.players.playerTop,
            }),

        ],
        [
            new Pawn({
                name: 'P',
                userID: game.players.playerTop._id,
                _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'P',
                userID: game.players.playerTop._id,
                _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'P',
                userID: game.players.playerTop._id,
                _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'P',
                userID: game.players.playerTop._id,
                _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'P',
                userID: game.players.playerTop._id,
                _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'P',
                userID: game.players.playerTop._id,
                _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'P',
                userID: game.players.playerTop._id,
                _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'P',
                userID: game.players.playerTop._id,
                _id: '10010010',
                player: game.players.playerTop,
            }),
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
            new Pawn({
                name: 'P',
                userID: game.players.playerBottom._id,
                _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'P',
                userID: game.players.playerBottom._id,
                _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'P',
                userID: game.players.playerBottom._id,
                _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'P',
                userID: game.players.playerBottom._id,
                _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'P',
                userID: game.players.playerBottom._id,
                _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'P',
                userID: game.players.playerBottom._id,
                _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'P',
                userID: game.players.playerBottom._id,
                _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'P',
                userID: game.players.playerBottom._id,
                _id: '10010010',
                player: game.players.playerBottom,
            }),
        ],
        [
            new Rook({
                name: 'R',
                userID: game.players.playerBottom._id,
                _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Knight({
                name: 'N',
                userID: game.players.playerBottom._id,
                _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Bishop({
                name: 'B',
                userID: game.players.playerBottom._id,
                _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Queen({
                name: 'Q',
                userID: game.players.playerBottom._id,
                _id: '11001010',
                player: game.players.playerBottom,
            }),
            new King({
                name: 'K',
                userID: game.players.playerBottom._id,
                _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Bishop({
                name: 'B',
                userID: game.players.playerBottom._id,
                _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Knight({
                name: 'N',
                userID: game.players.playerBottom._id,
                _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Rook({
                name: 'R',
                userID: game.players.playerBottom._id,
                _id: '11001010',
                player: game.players.playerBottom,
            }),

        ],
    ];
    // for (let rowIndex in board) {
    //     let row = board[rowIndex];
    //     for (let pieceIndex in row) {
    //         let piece = row[pieceIndex];
    //         if (piece !== null) piece.board = board;
    //     }
    // }
    // return board;
}