/**
 * Created by ajrmatt on 3/16/17.
 */
const Piece = require('./piece');

let db;

function Board(grid) {
    this.grid = grid;
}

module.exports = (database) => {
    db = database;
    return Board;
};