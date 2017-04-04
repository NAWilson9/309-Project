/**
 * Created by ajrmatt on 3/15/17.
 */
const Movement = require('./Movement').Movement;
const DependentMovement = require('./Movement').DependentMovement;
const  MovementList = require('./MovementList').MovementList;
const DirectionSet = require('./DirectionSet').DirectionSet;
const dirSets = require('./DirectionSet').dirSets;
const Step = require('./Step').Step;
const StepMap = require('./StepMap').StepMap;

module.exports.Piece = class Piece {
    constructor(props) {
        this.name = props.name;
        this.consoleName = props.consoleName;
        // this.userID = props.userID;
        // this._id = props._id;
        this.player = props.player;
        this.board = null;
        this.moveCount = 0;
        this.abilities = {
            defaultMovementLists: props.defaultMovementLists,
            attackingMovementLists: props.attackingMovementLists,
            canJump: props.canJump,
        };
        this.currentLocation = null;
        this.generateRelativeStepMap = handleGenerateRelativeStepMap;
    }
};
/**
 * MovementList choice dependent on attacking and numMoves
 *
 */
function handleGenerateRelativeStepMap(isAttacking) {
    let destinations = [];
    let location = { x: 0, y: 0, };
    let applicableMovementLists;
    if (isAttacking && this.abilities.attackingMovementLists !== null) applicableMovementLists = this.abilities.attackingMovementLists;
    else applicableMovementLists = this.abilities.defaultMovementLists;
    let stepMap = new StepMap();
    for (let movementListIndex in applicableMovementLists) {
        let movementList = applicableMovementLists[movementListIndex];
        for (let direction in movementList.first.possibleDirections.dirSet) {
            if (movementList.first.possibleDirections.dirSet[direction] > 0) {
                generateRelativeStepMapRecursive(this, movementList.first, direction, Object.assign({}, location), stepMap.start, destinations);
            }
        }
    }
    // console.log(destinations);
    return stepMap;
}
function generateRelativeStepMapRecursive(piece, movement, direction, currentLocation, prevStep, destinations) {
    if (movement instanceof DependentMovement) {
        if (movement.setFromMoveCount !== null) movement.setFromMoveCount(piece.moveCount);
        // Because board size is static, this could be set once, but would require more refactoring than time allows
        //   (iterate movements to set upon board creation is one option)
        if (movement.setFromBoardSize !== null) movement.setFromBoardSize(piece.board);
    }
    let location = currentLocation;
    for (let distance = 1; distance <= movement.maxDistance; distance++) {
        updateRelativeLocation(piece.player, direction, location);
        let thisStep = new Step({
            prev: prevStep,
            relativeLocation: Object.assign({}, location),
            canMoveHere: false,
        });
        prevStep.nextSteps.push(thisStep);
        prevStep = thisStep;
        // If distance is not yet max distance and the movement need not be completed or
        // distance is max distance
        if (distance < movement.maxDistance && !movement.mustComplete ||
            distance === movement.maxDistance) {
            // If next movement exists and need not be performed or this is final movement
            if (movement.next && !movement.next.mustPerform ||
                !movement.next) {
                thisStep.canMoveHere = true;
                if (!containsLocation(destinations, location)) destinations.push(Object.assign({}, location));
            }
            if (movement.next !== null) {
                if (movement.next instanceof DependentMovement && movement.next.setFromResults !== null) {
                    movement.next.setFromResults({
                        direction: direction,
                        distance: distance,
                    });
                }
                for (let nextDirection in movement.next.possibleDirections.dirSet) {
                    if (movement.next.possibleDirections.dirSet[nextDirection] > 0) {
                        generateRelativeStepMapRecursive(piece, movement.next, nextDirection, Object.assign({}, location), thisStep, destinations);
                    }
                }
            }
        }
    }
}
function updateRelativeLocation(player, direction, location) {
    if (player.isBottomPlayer) {
        switch (direction) {
            case '0' :
                location.x += -1;
                location.y += -1;
                break;
            case '1' :
                location.y += -1;
                break;
            case '2' :
                location.x += 1;
                location.y += -1;
                break;
            case '3' :
                location.x += 1;
                break;
            case '4' :
                location.x += 1;
                location.y += 1;
                break;
            case '5' :
                location.y += 1;
                break;
            case '6' :
                location.x += -1;
                location.y += 1;
                break;
            case '7' :
                location.x += -1;
                break;
        }
    } else {
        switch (direction) {
            case '0' :
                location.x += 1;
                location.y += 1;
                break;
            case '1' :
                location.y += 1;
                break;
            case '2' :
                location.x += -1;
                location.y += 1;
                break;
            case '3' :
                location.x += -1;
                break;
            case '4' :
                location.x += -1;
                location.y += -1;
                break;
            case '5' :
                location.y += -1;
                break;
            case '6' :
                location.x += 1;
                location.y += -1;
                break;
            case '7' :
                location.x += 1;
                break;
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

module.exports.Knight = class Knight extends module.exports.Piece {
    constructor(props) {
        props.defaultMovementLists = [
            new MovementList([
                new Movement({
                    mustPerform: true,
                    mustComplete: false,
                    possibleDirections: new DirectionSet(dirSets.orthogonal),
                    maxDistance: 2,
                }),
                new DependentMovement({
                    mustPerform: true,
                    mustComplete: true,
                    maxDistance: null,
                    possibleDirections: null,
                    setFromResults: function (results) {
                        this.possibleDirections = this.prev.possibleDirections.copyAndRemoveDirection(results.direction);
                        this.maxDistance = 3-results.distance;
                    },
                    setFromMoveCount: null,
                    setFromBoardSize: null,
                }),
            ]),
        ];
        props.attackingMovementLists = null;
        props.canJump = true;
        super(props);
    }
};

module.exports.Rook = class Rook extends module.exports.Piece {
    constructor(props) {
        props.defaultMovementLists = [
            new MovementList([
                new DependentMovement({
                    mustPerform: true,
                    mustComplete: false,
                    possibleDirections: new DirectionSet(dirSets.orthogonal),
                    maxDistance: null,
                    setFromResults: null,
                    setFromMoveCount: null,
                    setFromBoardSize: function (board) {
                        this.maxDistance = Math.max(board.length-1, board[0].length-1);
                    },
                }),
            ]),
        ];
        props.attackingMovementLists = null;
        props.canJump = false;
        super(props);
    }
};

module.exports.Queen = class Queen extends module.exports.Piece {
    constructor(props) {
        props.defaultMovementLists = [
            new MovementList([
                new DependentMovement({
                    mustPerform: true,
                    mustComplete: false,
                    possibleDirections: new DirectionSet(dirSets.all),
                    maxDistance: null,
                    setFromResults: null,
                    setFromMoveCount: null,
                    setFromBoardSize: function (board) {
                        this.maxDistance = Math.max(board.length-1, board[0].length-1);
                    },
                }),
            ]),
        ];
        props.attackingMovementLists = null;
        props.canJump = false;
        super(props);
    }
};

module.exports.King = class King extends module.exports.Piece {
    constructor(props) {
        props.defaultMovementLists = [
            new MovementList([
                new Movement({
                    mustPerform: true,
                    mustComplete: true,
                    possibleDirections: new DirectionSet(dirSets.all),
                    maxDistance: 1,
                }),
            ]),
        ];
        props.attackingMovementLists = null;
        props.canJump = false;
        super(props);
    }
};

module.exports.Bishop = class Bishop extends module.exports.Piece {
    constructor(props) {
        props.defaultMovementLists = [
            new MovementList([
                new DependentMovement({
                    mustPerform: true,
                    mustComplete: false,
                    possibleDirections: new DirectionSet(dirSets.diagonal),
                    maxDistance: 7,
                    setFromResults: null,
                    setFromMoveCount: null,
                    setFromBoardSize: function (board) {
                        this.maxDistance = Math.max(board.length-1, board[0].length-1);
                    },
                }),
            ]),
        ];
        props.attackingMovementLists = null;
        props.canJump = false;
        super(props);
    }
};

module.exports.Pawn = class Pawn extends module.exports.Piece {
    constructor(props) {
        props.defaultMovementLists = [
            new MovementList([
                new DependentMovement({
                    mustPerform: true,
                    mustComplete: false,
                    possibleDirections: new DirectionSet(dirSets.straight),
                    maxDistance: null,
                    setFromResults: null,
                    setFromMoveCount: function (moveCount) {
                        this.maxDistance = moveCount > 0 ? 1 : 2;
                    },
                    setFromBoardSize: null,
                }),
            ]),
        ];
        props.attackingMovementLists = [
            new MovementList([
                new Movement({
                    mustPerform: true,
                    mustComplete: true,
                    possibleDirections: new DirectionSet(dirSets.diagonalEncroach),
                    maxDistance: 1,
                }),
            ]),
        ];
        props.canJump = false;
        super(props);
    }
};