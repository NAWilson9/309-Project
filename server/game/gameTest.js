/**
 * Created by ajrmatt on 3/16/17.
 */
const Game = require('./Game').Game;
const GameState = require('./GameState').GameState;
const ConsoleGame = require('./ConsoleGame').ConsoleGame;
// import { Knight, Rook, Queen, King, Bishop, Pawn } from './Piece'
const Util = require('util');

let game = new Game({
    userIDs: [
        'generic10002918',
        'generic10002919',
    ],
    pieceIDs: null,
    db: null,
});

const consoleGame = new ConsoleGame(game);

consoleGame.start();

// let gameState = game.getGameState();
//
// console.log(Util.inspect(gameState, { depth: 5 }));
// console.log(JSON.stringify(gameState));

// console.log(game.gameboard);
// game.gameboard[5][2] = new Pawn({
//     name: 'Pawn the First',
//     userID: playerTop._id,
//     _id: '10010010',
//     player: playerTop,
// });

// game.movePiece({
//     start: {
//         x: 4,
//         y: 6,
//     },
//     end: {
//         x: 4,
//         y: 4,
//     }
// });
// game.movePiece({
//     start: {
//         x: 1,
//         y: 7,
//     },
//     end: {
//         x: 2,
//         y: 5,
//     }
// });
// game.movePiece({
//     start: {
//         x: 2,
//         y: 5,
//     },
//     end: {
//         x: 4,
//         y: 4,
//     }
// });
// game.movePiece({
//     start: {
//         x: 3,
//         y: 7,
//     },
//     end: {
//         x: 7,
//         y: 3,
//     }
// });
// game.movePiece({
//     start: {
//         x: 7,
//         y: 3,
//     },
//     end: {
//         x: 7,
//         y: 1,
//     }
// });
// game.movePiece({
//     start: {
//         x: 7,
//         y: 1,
//     },
//     end: {
//         x: 7,
//         y: 0,
//     }
// });

// console.log(game.gameboard[3][7]);

// let knight = new Knight({
//     name: 'Horsey',
//     userID: playerBottom._id,
//     _id: '11101000',
//     player: playerBottom,
// });
// let stepMap = knight.generateRelativeStepMap(false);
// let rook = new Rook({
//     name: 'Castle',
//     userID: playerBottom._id,
//     _id: '11001010',
//     player: playerBottom,
// });
// let stepMap = rook.generateRelativeStepMap(false);
// let queen = new Queen({
//     name: 'Queen',
//     userID: playerBottom._id,
//     _id: '11011010',
//     player: playerBottom,
// });
// queen.generateRelativeDestinations(false);
// let king = new King({
//     name: 'King',
//     userID: playerBottom._id,
//     _id: '10011110',
//     player: playerBottom,
// });
// king.generateRelativeDestinations(false);
// let bishop = new Bishop({
//     name: 'Bishop',
//     userID: playerTop._id,
//     _id: '10011101',
//     player: playerTop,
// });
// bishop.generateRelativeDestinations(false);
// let pawn = new Pawn({
//     name: 'Pawn the First',
//     userID: playerBottom._id,
//     _id: '10010010',
//     player: playerBottom,
// });
// // pawn.moveCount = 6;
// pawn.generateRelativeDestinations(false);

// for (let stepIndex in stepMap.start.nextSteps[0].nextSteps) {
//     console.log(Util.inspect(stepMap.start.nextSteps[0].nextSteps[stepIndex], {depth: 4}));
// }
