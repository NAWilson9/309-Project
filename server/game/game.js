/**
 * Created by ajrmatt on 3/16/17.
 */
// let db;
const Board = require('./board')();

function Game(players, grid) {
    // this.players = players;
    // this.activePlayer = players[0];
    // this.gameboard = new Board(grid);
    this.move = movePiece;
}

const movePiece = function(player, movement) {
    // const from = movement.from;
    // const to = movement.to;
    // const piece = this.gameboard.grid[from.x][from.y];
    // const destinationPiece = this.gameboard.grid[to.x][to.y];
    // if(player == this.activePlayer) {
    //     if (piece) {
    //         if (playerOwnsPiece(player, piece)) {
    //             if(!destinationPiece) {
    //
    //             } else {
    //                 console.log('Destination occupied');
    //             }
    //         } else {
    //             console.log('Not your piece');
    //         }
    //     } else {
    //         console.log('Empty square');
    //     }
    // } else {
    //     console.log('Not your turn');
    // }
    console.log(db);
};
const playerOwnsPiece = (player, piece) => {
    return (player._id == piece.userID);
};

module.exports = (database) => {
    db = database;
    return Game;
};