/**
 * Created by ajrmatt on 3/26/17.
 */
const Readline = require('readline');

const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

module.exports.ConsoleGame = class ConsoleGame {
    constructor(game) {
        this.game = game;
        this.start = handleStart;

    }
}
function handleStart() {
    updateConsole(this.game);
}
function updateConsole(game) {
    printGame(game);
    requestFrom(game);
}
function requestFrom(game) {
    let inputFormat = /^\d+,\d+$/;
    rl.question('From: ', function(fromResponse) {
        if (fromResponse.match(inputFormat) === null) {
            requestFrom(game);
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
        console.log(fromResponseArray);
        console.log(toResponseArray);
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
    if (game.activePlayer.isInCheckmate) console.log(game.activePlayer.userData.username, 'has lost\n');
    else if (game.activePlayer.isInCheck) console.log(game.activePlayer.userData.username, 'is in check\n');
    if (game.activePlayer.opponent.isInCheckmate) console.log(game.activePlayer.opponent.userData.username, 'has lost\n');
    else if (game.activePlayer.opponent.isInCheck) console.log(game.activePlayer.opponent.userData.username, 'is in check\n');
    let board = game.gameboard;
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
            rowString += piece ? piece.consoleName + '|' : '-|';
        }
        console.log(rowString);
    }
    console.log('Move count:', game.moveCount);
    console.log(game.activePlayer.userData.username + '\'s turn');
}