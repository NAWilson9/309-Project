/**
 * Created by ajrmatt on 3/15/17.
 */
import { Movement, DependentMovement } from './Movement'
import MovementList from './MovementList'
import { DirectionSet, dirSets } from './DirectionSet'


export default class Piece {
    constructor(props) {
        this.name = props.name;
        this.userID = props.userID;
        this._id = props._id;
        this.player = props.player;
        this.moveCount = 0;
        this.abilities = {
            defaultMovementLists: props.defaultMovementLists,
            attackingMovementLists: props.attackingMovementLists,
        };
        this.generateRelativeLocations = generateRelativeLocations;
    }
}
/**
 * MovementList choice dependent on attacking and numMoves
 *
 */
function generateRelativeLocations(isAttacking) {
    let destinations = [];
    let location = { x: 0, y: 0, };
    let applicableMovementLists;
    if (isAttacking && this.abilities.attackingMovementLists !== null) applicableMovementLists = this.abilities.attackingMovementLists;
    else applicableMovementLists = this.abilities.defaultMovementLists;
    // console.log(applicableMovementLists);
    for (let movementListIndex in applicableMovementLists) {
        let movementList = applicableMovementLists[movementListIndex];
        for (let direction in movementList.first.possibleDirections.dirSet) {
            if (movementList.first.possibleDirections.dirSet[direction] > 0) {
                generateRelativeLocationsRecursive(this, movementList.first, direction, Object.assign({}, location), destinations);
            }
        }
    }
    console.log(destinations);
    return destinations;
}
function generateRelativeLocationsRecursive(piece, movement, direction, currentLocation, destinations) {
    console.log('Direction', direction);
    if (movement instanceof DependentMovement && movement.setFromMoveCount !== null) {
        movement.setFromMoveCount(piece.moveCount);
    }
    let location = currentLocation;
    for (let distance = 1; distance <= movement.maxDistance; distance++) {
        console.log('Distance', distance);
        updateRelativeLocation(piece.player, direction, location);
        // If distance is not yet max distance and the movement need not be completed or
        // distance is max distance
        if (distance < movement.maxDistance && !movement.mustComplete ||
            distance === movement.maxDistance) {
            // If next movement exists and need not be performed or this is final movement
            if (movement.next && !movement.next.mustPerform ||
                !movement.next) {
                console.log('Location', location);
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
                        generateRelativeLocationsRecursive(piece, movement.next, nextDirection, Object.assign({}, location), destinations);
                    }
                }
            }
        }
    }
}
function updateRelativeLocation(player, direction, location) {
    // let newLocation = Object.assign({}, location);
    // console.log(direction);
    if (player.isBottomPlayer) {
        switch (direction) {
            case '0' :
                // console.log('direction 1');
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
        console.log('anything?');
        switch (direction) {
            case '0' :
                // console.log('direction 1');
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
    // return location;
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
                        // console.log(this.prev);
                        this.possibleDirections = this.prev.possibleDirections.copyAndRemoveDirection(results.direction);
                        // console.log(this.possibleDirections.dirSet);
                        this.maxDistance = 3-results.distance;
                    },
                    setFromMoveCount: null,
                }),
            ]),
        ];
        props.attackingMovementLists = null;
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
                        // console.log('NumMoves', moveCount);
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
        super(props);
    }
}

// export class KnightStep extends Piece {
//     constructor(props) {
//         super(props);
//         this.abilities = {
//             steps: [
//                 new Step({
//                     directions: directionSets.orthogonal,
//                     repsLeft: 2,
//                     nextSteps: (directionChosen) => {
//                         if (this.repsLeft === 0) {
//                             this.repsLeft = this.repsLeft - 1;
//                             let directions = this.directions.slice();
//                             directions[directionChosen-1] = 0;
//                             return [
//                                 this,
//                                 new Step({
//                                     directions: directions,
//                                     repsLeft:
//                                 })
//                             ]
//                         }
//                     },
//                 })
//             ],
//         }
//     }
// }