/**
 * Created by ajrmatt on 3/16/17.
 */
const Game = require('./game')();
let game = new Game(["a", "b"], "testGrid");
let gameResult;
while (!gameResult) {
    game.move(game.players[0], {from: {x: 2, y: 2}, to: {x: 3, y: 3}});
    gameResult = "draw";
}