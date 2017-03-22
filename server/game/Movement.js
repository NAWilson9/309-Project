/**
 * Created by ajrmatt on 3/18/17.
 */

export default class Movement {
    constructor(props) {
        this.next = null;
        this.prev = null;
        this.mustPerform = props.mustPerform;
        this.mustComplete = props.mustComplete;
        this.possibleDirections = props.possibleDirections;
        this.maxDistance = props.maxDistance;
        this.perform = (distanceTravelled, results) => {
            return props.perform(distanceTravelled, results);
        }
    }
}

// export class dependentMovement extends Movement {
//     constructor(props) {
//         super(props);
//     }
// }