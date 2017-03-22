/**
 * Created by ajrmatt on 3/15/17.
 */
import { Movement, DependentMovement } from './Movement'
import MovementList from './MovementList'

export default class Piece {
    constructor(props) {
        this.name = props.name;
        this.userID = props.userID;
        this._id = props._id;
        this.abilities.movements = props.movements;
        this.abilities.destinations = generateRelativeLocations(props.movements);
    }
}
function generateRelativeLocations(movementList) {
    let locations = [];
    generateRelativeLocationsRecursive(movementList.first, locations);
    return locations;
}
function generateRelativeLocationsRecursive(movement, locations) {
    if (movement !== null) {
        let results = {
            direction: null,
            distance: null,
        };
        if (movement instanceof DependentMovement) {
            movement.setFromResults(results);
        }
        for (let dirIndex in movement.possibleDirections) {
            console.log(movement.possibleDirections[dirIndex]);
            if (movement.possibleDirections[dirIndex] > 0) {

            }
        }
    }
}
function getRelativeLocation(direction, distance) {
    let location = { x: 0, y: 0, };
    switch (direction) {
        case 1 :
            location.x = -1*distance;
            location.y = -1*distance;
            break;
        case 2 :
            location.y = -1*distance;
            break;
        case 3 :
            location.x = 1*distance;
            location.y = -1*distance;
            break;
        case 4 :
            location.x = 1*distance;
            break;
        case 5 :
            location.x = 1*distance;
            location.y = 1*distance;
            break;
        case 6 :
            location.y = 1*distance;
            break;
        case 7 :
            location.x = -1*distance;
            location.y = 1*distance;
            break;
        case 8 :
            location.x = -1*distance;
            break;
    }
    return location;
}

function containsEquivalentObject() {

}

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
                setFromResults: (results) => {
                    this.possibleDirections = this.prev.possibleDirections.removeDirection(results.direction);
                    this.maxDistance = 2-results.distance;
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

/**
 * |1|2|3|
 * |8|P|4|
 * |7|6|5|
 */
const dirSets = {
    orthogonal: [0,2,0,4,0,6,0,8],
    diagonal: [1,0,3,0,5,0,7,0],
    encroach: [1,2,3,0,0,0,0,0],
};

export class DirectionSet extends Array {
    constructor(set) {
        super(set);
    }
    removeDirection(direction) {
        let newDirections = this.slice();
        newDirections[direction-1] = 0;
        return newDirections;
    }
}