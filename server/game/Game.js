/**
 * Created by ajrmatt on 3/16/17.
 */
// let db;
import Board from './Board'
import { Knight, Rook, Queen, King, Bishop, Pawn } from './Piece'

export default class Game {
    constructor(props) {
        this.players = props.players;
        this.players.playerTop.opponent = this.players.playerBottom;
        this.players.playerBottom.opponent = this.players.playerTop;
        this.activePlayer = props.firstPlayer;
        this.nextPlayer = handleNextPlayer;
        this.gameboard = props.pieceList ? null : generateClassicBoard(this);
        this.movePiece = handleMovePiece;
    }
}

const handleNextPlayer = function() {
    // console.log((game.players.indexOf(game.activePlayer)+1)%game.players.length);
    // Generalization for more players (may not be working as is)
    // return game.players[(game.players.indexOf(game.activePlayer)+1)%game.players.length];
    return this.activePlayer === this.players.playerTop ? this.players.playerBottom : this.players.playerTop;
};

const handleMovePiece = function(movement) {
    const from = movement.start;
    const to = movement.end;
    const piece = this.gameboard[from.y][from.x];
    const destinationPiece = this.gameboard[to.y][to.x];
    let isAttacking = null;
    if (piece) {
        if (piece.player === this.activePlayer) {
            if (destinationPiece) {
                if (destinationPiece.player === piece.player) {
                    console.log('Cannot occupy the same space as your own piece');
                }
                else if (destinationPiece.player !== piece.player) isAttacking = true;
            }
            else isAttacking = false;
        } else {
            console.log('Not your piece');
        }
    } else {
        console.log('Empty square');
    }
    if (isAttacking !== null) {
        let destinations = [to];
        let canMovePiece = canMove(piece, isAttacking, destinations, this.gameboard);
        if (canMovePiece) {
            if (destinationPiece) {
                destinationPiece.isInPlay = false;
                destinationPiece.currentLocation = null;
            }
            this.gameboard[to.y][to.x] = piece;
            this.gameboard[from.y][from.x] = null;
            piece.currentLocation.x = to.x;
            piece.currentLocation.y = to.y;
            piece.moveCount++;
            // console.log('Piece:', piece);
            // console.log('DestPiece:', destinationPiece);
            updateCheckAndCheckmate(this);
            console.log(this.activePlayer.isInCheck, this.nextPlayer().isInCheck);
            this.activePlayer = this.nextPlayer();
        }
    } else {

    }
};

function canMove(piece, isAttacking, destinations, board) {
    let canMove = { value: false, };
    let stepMap = piece.generateRelativeStepMap(isAttacking);
    for (let stepIndex in stepMap.start.nextSteps) {
        canMoveRecursive(piece, stepMap.start.nextSteps[stepIndex], destinations, board, canMove);
    }
    return canMove.value;
}
function canMoveRecursive(piece, step, destinations, board, canMove) {
    let boardMaxX = board[0].length-1;
    let boardMaxY = board.length-1;
    let stepLocation = {
        x: piece.currentLocation.x + step.relativeLocation.x,
        y: piece.currentLocation.y + step.relativeLocation.y,
    };
    if (stepLocation.x >= 0 && stepLocation.x <= boardMaxX && stepLocation.y >= 0 && stepLocation.y <= boardMaxY) {
        let stepLocationPiece = board[stepLocation.y][stepLocation.x];
        let stepIsDestination = containsLocation(destinations, stepLocation);
        let branch = true;
        let canMoveHere = step.canMoveHere;
        if (stepLocationPiece) {
            if (stepLocationPiece.player === piece.player) {
                canMoveHere = false;
            } else {
                // stepLocationPiece is owned by activePlayer
            }
            if (!piece.abilities.canJump) {
                branch = false;
            } else {
                //canJump
            }
        } else {
            // Empty square
            // if (step.canMoveHere) canMoveHere = true;
        }
        if (canMoveHere && stepIsDestination) {
            canMove.value = true;
        }
        if (branch && !canMove.value) {
            for (let stepIndex in step.nextSteps) {
                canMoveRecursive(piece, step.nextSteps[stepIndex], destinations, board, canMove);
            }
        }
    } else {
        // out of bounds
    }
}

function updateCheckAndCheckmate(game) {
    let kingDestinations;
    for (let playerProp in game.players) {
        if (game.players.hasOwnProperty(playerProp)) {
            let player = game.players[playerProp];
            kingDestinations = generatePossibleDestinations(player.king, game.gameboard);
            let inCheck = false;
            let kingCannotMove = false;
            for (let pieceIndex in player.opponent.pieces) {
                let piece = player.opponent.pieces[pieceIndex];
                if (piece.currentLocation && canMove(piece, true, [player.king.currentLocation], game.gameboard)) inCheck = true;
            }
            player.isInCheck = inCheck;
        }
    }
    // console.log(kingDestinations);

}

function generatePossibleDestinations(king, board) {
    let destinations = [];
    let stepMapDefault = king.generateRelativeStepMap(false);
    let stepMapAttack = king.generateRelativeStepMap(true);
    for (let stepIndex in stepMapDefault.start.nextSteps) {
        generatePossibleDestinationsRecursive(king, stepMapDefault.start.nextSteps[stepIndex], board, destinations);
    }
    for (let stepIndex in stepMapAttack.start.nextSteps) {
        generatePossibleDestinationsRecursive(king, stepMapAttack.start.nextSteps[stepIndex], board, destinations);
    }
    return destinations;
}
function generatePossibleDestinationsRecursive(king, step, board, destinations) {
    let boardMaxX = board[0].length-1;
    let boardMaxY = board.length-1;
    let stepLocation = {
        x: king.currentLocation.x + step.relativeLocation.x,
        y: king.currentLocation.y + step.relativeLocation.y,
    };
    if (stepLocation.x >= 0 && stepLocation.x <= boardMaxX && stepLocation.y >= 0 && stepLocation.y <= boardMaxY) {
        // console.log('In Bounds');
        let stepLocationPiece = board[stepLocation.y][stepLocation.x];
        let branch = true;
        let canMoveHere = step.canMoveHere;
        if (stepLocationPiece) {
            if (stepLocationPiece.player === king.player) canMoveHere = false;
            if (!king.abilities.canJump) branch = false;
        }
        if (canMoveHere && !containsLocation(destinations, stepLocation)) destinations.push(stepLocation);
        if (branch && !canMoveHere) {
            for (let stepIndex in step.nextSteps) {
                generatePossibleDestinationsRecursive(king, step.nextSteps[stepIndex], board, destinations);
            }
        }
    }
}

function containsLocation(destinations, location) {
    for (let locIndex in destinations) {
        let currLoc = destinations[locIndex];
        if (currLoc.x === location.x && currLoc.y === location.y) return true;
    }
    return false;
}

export function printGame(game) {
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

function generateClassicBoard(game) {
    let board = [
        [
            new Rook({
                name: 'r',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),
            new Knight({
                name: 'n',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),
            new Bishop({
                name: 'b',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),
            new Queen({
                name: 'q',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),
            new King({
                name: 'k',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),
            new Bishop({
                name: 'b',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),
            new Knight({
                name: 'n',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),
            new Rook({
                name: 'r',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),

        ],
        [
            new Pawn({
                name: 'p',
                // userID: game.players.playerTop._id,
                // _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'p',
                // userID: game.players.playerTop._id,
                // _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'p',
                // userID: game.players.playerTop._id,
                // _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'p',
                // userID: game.players.playerTop._id,
                // _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'p',
                // userID: game.players.playerTop._id,
                // _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'p',
                // userID: game.players.playerTop._id,
                // _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'p',
                // userID: game.players.playerTop._id,
                // _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'p',
                // userID: game.players.playerTop._id,
                // _id: '10010010',
                player: game.players.playerTop,
            }),
        ],
        [
            null, null, null, null, null, null, null, null,
        ],
        [
            null, null, null, null, null, null, null, null,
        ],
        [
            null, null, null, null, null, null, null, null,
        ],
        [
            null, null, null, null, null, null, null, null,
        ],
        [
            new Pawn({
                name: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
        ],
        [
            new Rook({
                name: 'R',
                // userID: game.players.playerBottom._id,
                // _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Knight({
                name: 'N',
                // userID: game.players.playerBottom._id,
                // _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Bishop({
                name: 'B',
                // userID: game.players.playerBottom._id,
                // _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Queen({
                name: 'Q',
                // userID: game.players.playerBottom._id,
                // _id: '11001010',
                player: game.players.playerBottom,
            }),
            new King({
                name: 'K',
                // userID: game.players.playerBottom._id,
                // _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Bishop({
                name: 'B',
                // userID: game.players.playerBottom._id,
                // _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Knight({
                name: 'N',
                // userID: game.players.playerBottom._id,
                // _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Rook({
                name: 'R',
                // userID: game.players.playerBottom._id,
                // _id: '11001010',
                player: game.players.playerBottom,
            }),
        ],
    ];
    for (let rowIndex in board) {
        let row = board[rowIndex];
        for (let pieceIndex in row) {
            let piece = row[pieceIndex];
            if (piece !== null) {
                piece.isInPlay = true;
                piece.currentLocation = { x: parseInt(pieceIndex), y: parseInt(rowIndex), };
                piece.player.pieces.push(piece);
                if (piece instanceof King) piece.player.king = piece;
            }
        }
    }
    return board;
}