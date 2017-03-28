/**
 * Created by ajrmatt on 3/23/17.
 */
export default class GameState {
    constructor(game) {
        this.board = game.board.map((row) => { return row.slice() });
        this.players = game.players;
        this.activePlayer = game.activePlayer;
        this.movementRequest = Object.assign({}, game.latestMovement);
    }
}