/**
 * Created by ajrmatt on 3/16/17.
 */
import Game from './Game'
import User from './User'
import { Knight } from './Piece'

let player1 = new User({
    username: 'Ajrmatt',
    password: '1234',
    rating: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    friends: [],
    _id: '10101100',
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
    _id: '11101000'
});
// let gameResult;
// while (!gameResult) {
//     game.move(game.players[0], {from: {x: 2, y: 2}, to: {x: 3, y: 3}});
//     gameResult = "draw";
// }