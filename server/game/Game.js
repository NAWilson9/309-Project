/**
 * Created by ajrmatt on 3/16/17.
 */
const Player = require('./Player').Player;
const Knight = require('./Piece').Knight;
const Rook = require('./Piece').Rook;
const Queen = require('./Piece').Queen;
const King = require('./Piece').King;
const Bishop = require('./Piece').Bishop;
const Pawn = require('./Piece').Pawn;
const GameState = require('./GameState').GameState;
const ObjectID = require('mongodb').ObjectID;

module.exports.Game = class Game {
    constructor(props, callback) {
        let gameState = props.gameState;
        let guids = [];
        if (props.guids) guids = props.guids;
        else if (gameState) {
            for (let playerIndex in gameState.players) {
                guids.push(gameState.players[playerIndex]._id);
            }
        }
        if (guids) {
            getUserDataForGuids(props.guids, props.db, (err, errGuid, users) => {
                if (err) {
                    callback(err);
                } else {
                    let players = [];
                    for (let userIndex = 0; userIndex < users.length; userIndex++) {
                        let user = users[userIndex];
                        if (user.username.startsWith('generic')) {
                            user.username = (userIndex === 0 ? 'Top' : 'Bottom') + ' player';
                        }
                        players.push(new Player({
                            userData: user,
                            isBottomPlayer: userIndex !== 0,
                        }));
                    }
                    if (gameState) {
                        let playerTop, playerBottom;
                        if (players[0].userData._id === gameState.players.playerTop._id) {
                            playerTop = players[0];
                            playerBottom = players[1];
                        } else {
                            playerTop = players[1];
                            playerBottom = players[0];
                        }
                        this.players = {
                            playerTop: playerTop,
                            playerBottom: playerBottom,
                        };
                    } else {
                        this.players = {
                            playerTop: players[0],
                            playerBottom: players[1],
                        };
                    }
                    this.players.playerTop.opponent = this.players.playerBottom;
                    this.players.playerBottom.opponent = this.players.playerTop;
                    this.activePlayer = this.players.playerTop;
                    if (gameState) {
                        this.gameboard = generateBoardFromGameState(gameState, this);
                    } else {
                        this.gameboard = props.pieceIDs ? undefined : generateClassicBoard(this);
                    }
                    this.nextPlayer = handleNextPlayer;
                    this._id = new ObjectID().toHexString();
                    this.isClassicGame = false;
                    this.movePiece = handleMovePiece;
                    this.moveCount = 0;
                    this.getGameState = handleGetGameState;
                    this.latestMovement = gameState ? gameState.movementRequest : {
                        request: null,
                        successful: null,
                        errMsg: null,
                    };
                    callback(null, this);
                }
            });
        } else {
            console.error('Must provide either "guids : array," or "gameState : gameState," to constructor');
        }
        if (props.gameState) {
        }
    }
};

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
    this.latestMovement.successful = false;
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
                this.moveCount++;
                piece.currentLocation.x = to.x;
                piece.currentLocation.y = to.y;
                piece.moveCount++;
                this.latestMovement.successful = true;
                // console.log('Piece:', piece);
                // console.log('DestPiece:', destinationPiece);
                updateCheckAndCheckmate(this.players);
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

function updateCheckAndCheckmate(players) {
    for (let playerProp in players) {
        if (players.hasOwnProperty(playerProp)) {
            let player = players[playerProp];
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
function getUserDataForGuids(guids, db, callback) {
    let userArr = [];
    getUserDataForGuidsRecursive(guids, 0, userArr, db, callback);
    return userArr;
}

function getUserDataForGuidsRecursive(guids, guidIndex, userArr, db, callback) {
    let guid = guids[guidIndex];
    if (guid.startsWith('generic')) {
        userArr.push({
            username: guid,
            _id: guid,
        });
        if (guidIndex === guids.length-1) {
            callback(undefined, null, userArr);
        } else {
            getUserDataForGuidsRecursive(guids, guidIndex + 1, userArr, db, callback);
        }
    } else {
        db.getUserByID(guid, (err, user) => {
            if (err) {
                callback(err, null, undefined);
            } else {
                if (user) {
                    userArr.push(user);
                    if (guidIndex === guids.length-1) {
                        callback(undefined, null, userArr);
                    } else {
                        getUserDataForGuidsRecursive(guids, guidIndex + 1, userArr, db, callback);
                    }
                } else {
                    callback('UserID ' + guid + ' does not exist.', guids[guidIndex], null);
                }
            }
        });
    }
}
function generateBoardFromGameState(gameState) {
    for (let rowIndex in gameState.board) {
        for (let pieceIndex in gameState.board[rowIndex]) {
            let statePiece = gameState.board[rowIndex][pieceIndex];
            if (statePiece) {
                switch (statePiece.name) {
                    case 'pawn':
                        board[rowIndex][pieceIndex] = new Pawn({
                            name: statePiece.name,
                            consoleName: statePiece.consoleName,
                            player: null,
                        });
                        break;

                }
            } else {
                board[rowIndex][pieceIndex] = null;
            }
        }
    }
}
function generateClassicBoard(game) {
    game.isClassicGame = true;
    let board = [
        [
            new Rook({
                name: 'rook',
                consoleName: 'r',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),
            new Knight({
                name: 'knight',
                consoleName: 'n',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),
            new Bishop({
                name: 'bishop',
                consoleName: 'b',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),
            new Queen({
                name: 'queen',
                consoleName: 'q',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),
            new King({
                name: 'king',
                consoleName: 'k',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),
            new Bishop({
                name: 'bishop',
                consoleName: 'b',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),
            new Knight({
                name: 'knight',
                consoleName: 'n',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),
            new Rook({
                name: 'rook',
                consoleName: 'r',
                // userID: game.players.playerTop._id,
                // _id: '11001010',
                player: game.players.playerTop,
            }),

        ],
        [
            new Pawn({
                name: 'pawn',
                consoleName: 'p',
                // userID: game.players.playerTop._id,
                // _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'pawn',
                consoleName: 'p',
                // userID: game.players.playerTop._id,
                // _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'pawn',
                consoleName: 'p',
                // userID: game.players.playerTop._id,
                // _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'pawn',
                consoleName: 'p',
                // userID: game.players.playerTop._id,
                // _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'pawn',
                consoleName: 'p',
                // userID: game.players.playerTop._id,
                // _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'pawn',
                consoleName: 'p',
                // userID: game.players.playerTop._id,
                // _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'pawn',
                consoleName: 'p',
                // userID: game.players.playerTop._id,
                // _id: '10010010',
                player: game.players.playerTop,
            }),
            new Pawn({
                name: 'pawn',
                consoleName: 'p',
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
                name: 'pawn',
                consoleName: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'pawn',
                consoleName: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'pawn',
                consoleName: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'pawn',
                consoleName: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'pawn',
                consoleName: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'pawn',
                consoleName: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'pawn',
                consoleName: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
            new Pawn({
                name: 'pawn',
                consoleName: 'P',
                // userID: game.players.playerBottom._id,
                // _id: '10010010',
                player: game.players.playerBottom,
            }),
        ],
        [
            new Rook({
                name: 'rook',
                consoleName: 'R',
                // userID: game.players.playerBottom._id,
                // _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Knight({
                name: 'knight',
                consoleName: 'N',
                // userID: game.players.playerBottom._id,
                // _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Bishop({
                name: 'bishop',
                consoleName: 'B',
                // userID: game.players.playerBottom._id,
                // _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Queen({
                name: 'queen',
                consoleName: 'Q',
                // userID: game.players.playerBottom._id,
                // _id: '11001010',
                player: game.players.playerBottom,
            }),
            new King({
                name: 'king',
                consoleName: 'K',
                // userID: game.players.playerBottom._id,
                // _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Bishop({
                name: 'bishop',
                consoleName: 'B',
                // userID: game.players.playerBottom._id,
                // _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Knight({
                name: 'knight',
                consoleName: 'N',
                // userID: game.players.playerBottom._id,
                // _id: '11001010',
                player: game.players.playerBottom,
            }),
            new Rook({
                name: 'rook',
                consoleName: 'R',
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