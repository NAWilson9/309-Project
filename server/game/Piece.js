/**
 * Created by ajrmatt on 3/15/17.
 */
import Movement from './Movement'
import Step from './Step'

export default class Piece {
    constructor(props) {
        this.name = props.name;
        this.userID = props.userID;
        this.abilities = props.abilities;
        this._id = props._id;
    }
}

export class KnightMove extends Piece {
    constructor(props) {
        super(props);
        this.abilities = {
            movements: [
                new Movement({
                    possibleDirections: new DirectionSet(dirSets.orthogonal),
                    maxDistance: 2,
                    execute: () => {

                    }
                }),
                new Movement({
                    possibleDirections
                }),
            ]
        }
    }
}

export class KnightStep extends Piece {
    constructor(props) {
        super(props);
        this.abilities = {
            steps: [
                new Step({
                    directions: directionSets.orthogonal,
                    repsLeft: 2,
                    nextSteps: (directionChosen) => {
                        if (this.repsLeft === 0) {
                            this.repsLeft = this.repsLeft - 1;
                            let directions = this.directions.slice();
                            directions[directionChosen-1] = 0;
                            return [
                                this,
                                new Step({
                                    directions: directions,
                                    repsLeft:
                                })
                            ]
                        }
                    },
                })
            ],
        }
    }
}

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
