/**
 * Created by ajrmatt on 3/23/17.
 */
module.exports.GameState = class GameState {
    constructor(game) {
        this.players = generateGameStatePlayers(game.players);
        this.activePlayer = game.players.playerTop === game.activePlayer ? this.players.playerTop : this.players.playerBottom;
        this.board = generateGameStateBoard(game.gameboard, this.players);
        this.moveCount = game.moveCount;
        this.movementRequest = Object.assign({}, game.latestMovement);
    }
}


function generateGameStatePlayers(players) {
    return {
        playerTop: generateGameStatePlayer(players.playerTop),
        playerBottom: generateGameStatePlayer(players.playerBottom),
    }
}
function generateGameStatePlayer(player) {
    let statePlayer = Object.assign({}, player);
    delete statePlayer.opponent;
    delete statePlayer.pieces;
    delete statePlayer.king;
    return statePlayer;
}
function generateGameStateBoard(board, statePlayers) {
    return board.map((row) => {
        return row.map((piece) => {
            if (piece) {
                let statePiece = Object.assign({}, piece);
                delete statePiece.board;
                delete statePiece.abilities;
                delete statePiece.generateRelativeStepMap;
                // let isBottomPlayer = statePiece.player.isBottomPlayer;
                statePiece.player = statePiece.player.isBottomPlayer ? statePlayers.playerBottom : statePlayers.playerTop;
                // console.log('State piece player opponent:', statePiece.player.opponent);
                return statePiece;
            }
            return null;
        });
    });
}
