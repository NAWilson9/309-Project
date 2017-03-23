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
        this.abilities = {};
        this.abilities.movements = props.movements;
        this.abilities.destinations = generateRelativeLocations(props.movements);
    }
}
function generateRelativeLocations(movementList) {
    let destinations = [];
    let location = { x: 0, y: 0, };
    for (let direction in movementList.first.possibleDirections.dirSet) {
        if (movementList.first.possibleDirections.dirSet[direction] > 0) {
            generateRelativeLocationsRecursive(movementList.first, direction, Object.assign({}, location), destinations);
        }
    }
    console.log(destinations);
    return destinations;
}
function generateRelativeLocationsRecursive(movement, direction, currentLocation, destinations) {
    console.log('Direction', direction);
    // let location = movement.prev === null ? { x: 0, y: 0, } : currentLocation;
    let location = currentLocation;
    for (let distance = 1; distance <= movement.maxDistance; distance++) {
        console.log('Distance', distance);
        updateRelativeLocation(direction, location);
        // console.log(distance, location);
        // If distance is not yet max distance and the movement need not be completed or
        // distance is max distance
        if (distance < movement.maxDistance && !movement.mustComplete ||
            distance === movement.maxDistance) {
            // console.log(movement.next);
            // If next movement exists and need not be performed or this is final movement
            if (movement.next && !movement.next.mustPerform ||
                !movement.next) {
                // console.log('inside movement.next check');
                // console.log('Direction', direction);
                // console.log('Distance', distance);
                console.log('Location', location);
                destinations.push(Object.assign({}, location));
            }
            if (movement.next !== null) {
                if (movement.next instanceof DependentMovement) {
                    // console.log('instanceof');
                    movement.next.setFromResults({
                        direction: direction,
                        distance: distance,
                    });
                    // console.log(movement.next);
                }
                for (let nextDirection in movement.next.possibleDirections.dirSet) {
                    if (movement.next.possibleDirections.dirSet[nextDirection] > 0) {
                        generateRelativeLocationsRecursive(movement.next, nextDirection, Object.assign({}, location), destinations);
                    }
                }
            }
        }
    }
}
function updateRelativeLocation(direction, location) {
    // let newLocation = Object.assign({}, location);
    // console.log(direction);
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
    // return location;
}

// function containsEquivalentObject() {
//
// }

export class Knight extends Piece {
    constructor(props) {
        props.movements = new MovementList([
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
                    // console.log(this.prev);
                    this.possibleDirections = this.prev.possibleDirections.copyAndRemoveDirection(results.direction);
                    // console.log(this.possibleDirections.dirSet);
                    this.maxDistance = 3-results.distance;
                },
            }),
        ]);
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