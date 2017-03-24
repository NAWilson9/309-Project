/**
 * Created by ajrmatt on 3/16/17.
 */
import Game from './Game'
import User from './User'
import { Knight, Rook, Queen, King, Bishop, Pawn } from './Piece'

let player1 = new User({
    username: 'Ajrmatt',
    password: '1234',
    rating: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    friends: [],
    _id: '10101100',
    isBottomPlayer: true,
});
let player2 = new User({
    username: 'Jmatthews',
    password: '4321',
    rating: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    friends: [],
    _id: '10100101',
    isBottomPlayer: false,
});
let game = new Game({
    players: {
        player1: player1,
        player2: player2,
    },
});
let knight = new Knight({
    name: 'Horsey',
    userID: player1._id,
    _id: '11101000',
    player: player1,
});
knight.generateRelativeLocations(false);
let rook = new Rook({
    name: 'Castle',
    userID: player1._id,
    _id: '11001010',
    player: player1,
});
rook.generateRelativeLocations(false);
let queen = new Queen({
    name: 'Queen',
    userID: player1._id,
    _id: '11011010',
    player: player1,
});
queen.generateRelativeLocations(false);
let king = new King({
    name: 'King',
    userID: player1._id,
    _id: '10011110',
    player: player1,
});
king.generateRelativeLocations(false);
let bishop = new Bishop({
    name: 'Bishop',
    userID: player2._id,
    _id: '10011101',
    player: player2,
});
bishop.generateRelativeLocations(false);
let pawn = new Pawn({
    name: 'Pawn the First',
    userID: player1._id,
    _id: '10010010',
    player: player1,
});
// pawn.moveCount = 6;
pawn.generateRelativeLocations(false);


// let gameResult;
// while (!gameResult) {
//     game.move(game.players[0], {from: {x: 2, y: 2}, to: {x: 3, y: 3}});
//     gameResult = "draw";
// }