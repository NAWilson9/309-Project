/**
 * Created by ajrmatt on 3/16/17.
 */
// let db;
import { Knight, Rook, Queen, King, Bishop, Pawn } from './Piece'
import GameState from './GameState'

export default class Game {
    constructor(props) {
        this.players = props.players;
        this.players.playerTop.opponent = this.players.playerBottom;
        this.players.playerBottom.opponent = this.players.playerTop;
        this.activePlayer = props.firstPlayer;
        this.nextPlayer = handleNextPlayer;
        this.gameboard = props.pieceList ? null : generateClassicBoard(this);
        this.movePiece = handleMovePiece;
        this.getGameState = handleGetGameState;
        this.latestMovement = {
            request: null,
            successful: null,
            errMsg: null,
        };
    }
}

const handleGetGameState = function() {
    return new GameState(this);
};

const handleNextPlayer = function() {
    // console.log((game.players.indexOf(game.activePlayer)+1)%game.players.length);
    // Generalization for more players (may not be working as is)
    // return game.players[(game.players.indexOf(game.activePlayer)+1)%game.players.length];
    return this.activePlayer === this.players.playerTop ? this.players.playerBottom : this.players.playerTop;
};

const handleMovePiece = function(movement) {
    this.latestMovement.request = movement;
    const from = movement.start;
    const to = movement.end;
    if (from.x >= 0 && from.x < this.gameboard[0].length && from.y >= 0 && from.y < this.gameboard.length &&
        to.x >= 0 && to.x < this.gameboard[0].length && to.y >= 0 && to.y < this.gameboard.length) {
        const piece = this.gameboard[from.y][from.x];
        const destinationPiece = this.gameboard[to.y][to.x];
        let isAttacking = null;
        if (piece) {
            // Could move this check to outside this scope
            if (piece.player === this.activePlayer) {
                if (destinationPiece) {
                    if (destinationPiece.player === piece.player) {
                        console.log('Cannot occupy the same space as your own piece');
                    }
                    else if (destinationPiece.player !== piece.player) isAttacking = true;
                }
                else isAttacking = false;
            } else {
                console.log('Not active player\'s piece');
            }
        } else {
            console.log('Empty square');
        }
        if (isAttacking !== null) {
            let destinations = [to];
            let errMsg = { value: null };
            let canMovePiece = canMove(piece, isAttacking, destinations, errMsg);
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
                // console.log('Check:', this.activePlayer.isInCheck, this.nextPlayer().isInCheck);
                // console.log('Checkmate:', this.activePlayer.isInCheckmate, this.nextPlayer().isInCheckmate);
                this.activePlayer = this.nextPlayer();
            }
        }
    } else {
        console.log('Outside boundaries');
    }
};

function canMove(piece, isAttacking, destinations, errMsg) {
    let results = { canMove: false, errMsg: null };
    let stepMap = piece.generateRelativeStepMap(isAttacking);
    for (let stepIndex in stepMap.start.nextSteps) {
        canMoveRecursive(piece, stepMap.start.nextSteps[stepIndex], destinations, results);
    }
    if (errMsg) errMsg.value = results.errMsg;
    return results.canMove;
}
function canMoveRecursive(piece, step, destinations, results) {
    let boardMaxX = piece.board[0].length-1;
    let boardMaxY = piece.board.length-1;
    let stepLocation = {
        x: piece.currentLocation.x + step.relativeLocation.x,
        y: piece.currentLocation.y + step.relativeLocation.y,
    };
    // For errMsg, generate stepList of path until destination reached
    // Check destination never reached, check if blocked by other piece
    if (stepLocation.x >= 0 && stepLocation.x <= boardMaxX && stepLocation.y >= 0 && stepLocation.y <= boardMaxY) {
        let stepLocationPiece = piece.board[stepLocation.y][stepLocation.x];
        let stepIsDestination = containsLocation(destinations, stepLocation);
        let canBranch = true;
        let canMoveHere = step.canMoveHere;
        if (stepLocationPiece) {
            if (stepLocationPiece.player === piece.player) {
                canMoveHere = false;
            } else {
                // stepLocationPiece is owned by opponent
            }
            if (!piece.abilities.canJump) {
                canBranch = false;
            } else {
                //canJump
            }
        } else {
            // Empty square
        }
        if (stepIsDestination) {
            if (canMoveHere) {
                results.canMove = true;
                results.errMsg = null;
            }
        }
        if (canBranch && !results.canMove) {
            for (let stepIndex in step.nextSteps) {
                canMoveRecursive(piece, step.nextSteps[stepIndex], destinations, results);
            }
        }
    } else {
        // out of bounds
    }
}

function updateCheckAndCheckmate(game) {
    for (let playerProp in game.players) {
        if (game.players.hasOwnProperty(playerProp)) {
            let player = game.players[playerProp];
            if (player.king.currentLocation !== null) {
                player.isInCheck = inDanger(player.king);
                player.isInCheckmate = player.isInCheck && !canEscape(player.king);
            } else {
                player.isInCheck = null;
                player.isInCheckmate = null;
            }
        }
    }
}
// Inefficiency: pieces are iterated here and in canEscape
//   However, keeping separate allows for generic use of both functions
function inDanger(piece) {
    let isInDanger = false;
    for (let pieceIndex in piece.player.opponent.pieces) {
        let opponentPiece = piece.player.opponent.pieces[pieceIndex];
        if (opponentPiece.currentLocation !== null &&
            canMove(opponentPiece, true, [piece.currentLocation])) isInDanger = true;
    }
    return isInDanger;
}
function canEscape(piece) {
    let destinations = generatePossibleDestinations(piece);
    destinations.map((destination) => { destination.isSafe = true; });
    let opponentPieces = piece.player.opponent.pieces;
    for (let pieceIndex in opponentPieces) {
        let opponentPiece = opponentPieces[pieceIndex];
        if (opponentPiece.currentLocation !== null) {
            let stepMap = opponentPiece.generateRelativeStepMap(true);
            for (let stepIndex in stepMap.start.nextSteps) {
                canEscapeRecursive(piece, opponentPiece, stepMap.start.nextSteps[stepIndex], destinations);
            }
        }
    }
    let isAbleToEscape = false;
    for (let destinationIndex in destinations) if (destinations[destinationIndex].isSafe) isAbleToEscape = true;
    return isAbleToEscape;
}
function canEscapeRecursive(piece, opponentPiece, step, destinations) {
    let boardMaxX = opponentPiece.board[0].length-1;
    let boardMaxY = opponentPiece.board.length-1;
    let stepLocation = {
        x: opponentPiece.currentLocation.x + step.relativeLocation.x,
        y: opponentPiece.currentLocation.y + step.relativeLocation.y,
    };
    if (stepLocation.x >= 0 && stepLocation.x <= boardMaxX && stepLocation.y >= 0 && stepLocation.y <= boardMaxY) {
        let stepLocationPiece = opponentPiece.board[stepLocation.y][stepLocation.x];
        let branch = true;
        let canMoveHere = step.canMoveHere;
        if (stepLocationPiece) {
            if (stepLocationPiece.player === opponentPiece.player) canMoveHere = false;
            if (!opponentPiece.abilities.canJump && !(stepLocationPiece instanceof piece.constructor)) branch = false;
        }
        if (canMoveHere) {
            destinations.map((destination) => {
                // console.log(opponentPiece.currentLocation, destination, stepLocation);
                if (destination.x === stepLocation.x && destination.y === stepLocation.y) {
                    destination.isSafe = false;
                }
            });
        }
        if (branch) {
            for (let stepIndex in step.nextSteps) {
                canEscapeRecursive(piece, opponentPiece, step.nextSteps[stepIndex], destinations);
            }
        }
    }
}

function generatePossibleDestinations(piece) {
    let destinations = [];
    let stepMapDefault = piece.generateRelativeStepMap(false);
    let stepMapAttack = piece.generateRelativeStepMap(true);
    for (let stepIndex in stepMapDefault.start.nextSteps) {
        generatePossibleDestinationsRecursive(piece, stepMapDefault.start.nextSteps[stepIndex], destinations);
    }
    for (let stepIndex in stepMapAttack.start.nextSteps) {
        generatePossibleDestinationsRecursive(piece, stepMapAttack.start.nextSteps[stepIndex], destinations);
    }
    return destinations;
}
function generatePossibleDestinationsRecursive(piece, step, destinations) {
    let boardMaxX = piece.board[0].length-1;
    let boardMaxY = piece.board.length-1;
    let stepLocation = {
        x: piece.currentLocation.x + step.relativeLocation.x,
        y: piece.currentLocation.y + step.relativeLocation.y,
    };
    if (stepLocation.x >= 0 && stepLocation.x <= boardMaxX && stepLocation.y >= 0 && stepLocation.y <= boardMaxY) {
        // console.log('In Bounds');
        let stepLocationPiece = piece.board[stepLocation.y][stepLocation.x];
        let branch = true;
        let canMoveHere = step.canMoveHere;
        if (stepLocationPiece) {
            if (stepLocationPiece.player === piece.player) canMoveHere = false;
            if (!piece.abilities.canJump) branch = false;
        }
        if (canMoveHere && !containsLocation(destinations, stepLocation)) destinations.push(stepLocation);
        if (branch && !canMoveHere) {
            for (let stepIndex in step.nextSteps) {
                generatePossibleDestinationsRecursive(piece, step.nextSteps[stepIndex], destinations);
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
                piece.board = board;
                piece.isInPlay = true;
                piece.currentLocation = { x: parseInt(pieceIndex), y: parseInt(rowIndex), };
                piece.player.pieces.push(piece);
                // Should generalize from King
                if (piece instanceof King) piece.player.king = piece;
            }
        }
    }
    return board;
}