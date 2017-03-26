/**
 * Created by ajrmatt on 3/26/17.
 */
import Readline from 'readline'

const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export default class ConsoleGame {
    constructor(game) {
        this.game = game;
        this.start = function () {
            startConsoleGame(this.game);
        };
    }
}
function startConsoleGame(game) {
    updateConsole(game);
}
function updateConsole(game) {
    printGame(game);
    requestFrom(game);
}
function requestFrom(game) {
    let inputFormat = /^\d+,\d+$/;
    rl.question('From: ', function(fromResponse) {
        if (fromResponse.match(inputFormat) === null) {
            requestFrom();
            return;
        }
        let fromResponseArray = fromResponse.split(',');
        requestTo(game, fromResponseArray, inputFormat);
    });
}
function requestTo(game, fromResponseArray, inputFormat) {
    rl.question('To: ', function(toResponse) {
        if (toResponse.match(inputFormat) === null) {
            requestTo(fromResponseArray, inputFormat);
            return;
        }
        let toResponseArray = toResponse.split(',');
        game.movePiece({
            start: {
                x: parseInt(fromResponseArray[0]),
                y: parseInt(fromResponseArray[1]),
            },
            end: {
                x: parseInt(toResponseArray[0]),
                y: parseInt(toResponseArray[1]),
            },
        });
        updateConsole(game);
    });
}

function printGame(game) {
    console.log();
    if (game.activePlayer.isInCheckmate) console.log(game.activePlayer.username, 'has lost');
    else if (game.activePlayer.isInCheck) console.log(game.activePlayer.username, 'is in check');
    if (game.activePlayer.opponent.isInCheckmate) console.log(game.activePlayer.opponent.username, 'has lost');
    else if (game.activePlayer.opponent.isInCheck) console.log(game.activePlayer.opponent.username, 'is in check');
    let board = game.gameboard;
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
    console.log(game.activePlayer.username + '\'s turn');
}