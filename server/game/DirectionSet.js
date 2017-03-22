/**
 * Created by ajrmatt on 3/22/17.
 */


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

export class DirectionSet {
    constructor(set) {
        this.set = set;
        // for (let dirIndex in set) {
        //     this.push(set[dirIndex]);
        // }
        // this.copyAndRemoveDirection = this.handleRemoveDirection.bind(this);
    }
    copyAndRemoveDirection(direction) {
        // console.log(this);
        let newDirectionSet = new DirectionSet(this.set.slice());
        newDirectionSet.set[direction] = 0;
        return newDirectionSet;
    }
}

export class DependentDirectionSet {
    constructor(previousDirection) {
        this.p
    }
}