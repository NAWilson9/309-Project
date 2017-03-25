/**
 * Created by ajrmatt on 3/15/17.
 */
import { Movement, DependentMovement } from './Movement'
import MovementList from './MovementList'
import { DirectionSet, dirSets } from './DirectionSet'
import Step from './Step'
import StepMap from './StepMap'


export default class Piece {
    constructor(props) {
        this.name = props.name;
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
        this.isInPlay = null;
        this.generateRelativeStepMap = generateRelativeStepMap;
    }
}
/**
 * MovementList choice dependent on attacking and numMoves
 *
 */
function generateRelativeStepMap(isAttacking) {
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
    if (movement instanceof DependentMovement && movement.setFromMoveCount !== null) {
        movement.setFromMoveCount(piece.moveCount);
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

export class Knight extends Piece {
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
                    isResultDependent: true,
                    isMoveCountDependent: false,
                    setFromResults: function (results) {
                        this.possibleDirections = this.prev.possibleDirections.copyAndRemoveDirection(results.direction);
                        this.maxDistance = 3-results.distance;
                    },
                    setFromMoveCount: null,
                }),
            ]),
        ];
        props.attackingMovementLists = null;
        props.canJump = true;
        super(props);
    }
}

export class Rook extends Piece {
    constructor(props) {
        props.defaultMovementLists = [
            new MovementList([
                new Movement({
                    mustPerform: true,
                    mustComplete: false,
                    possibleDirections: new DirectionSet(dirSets.orthogonal),
                    maxDistance: 7,
                }),
            ]),
        ];
        props.attackingMovementLists = null;
        props.canJump = false;
        super(props);
    }
}

export class Queen extends Piece {
    constructor(props) {
        props.defaultMovementLists = [
            new MovementList([
                new Movement({
                    mustPerform: true,
                    mustComplete: false,
                    possibleDirections: new DirectionSet(dirSets.all),
                    maxDistance: 7,
                }),
            ]),
        ];
        props.attackingMovementLists = null;
        props.canJump = false;
        super(props);
    }
}

export class King extends Piece {
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
}

export class Bishop extends Piece {
    constructor(props) {
        props.defaultMovementLists = [
            new MovementList([
                new Movement({
                    mustPerform: true,
                    mustComplete: false,
                    possibleDirections: new DirectionSet(dirSets.diagonal),
                    maxDistance: 7,
                }),
            ]),
        ];
        props.attackingMovementLists = null;
        props.canJump = false;
        super(props);
    }
}

export class Pawn extends Piece {
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
}