/**
 * Created by ajrmatt on 3/18/17.
 */

export default class Movement {
    constructor(props) {
        this.mustComplete = props.mustComplete;
        this.possibleDirections = props.possibleDirections;
        this.maxDistance = props.maxDistance;
        this.execute = (results) => {
            return props.execute(results);
        }
    }
}

export class dependentMovement extends Movement {
    constructor(props) {
        super(props);
    }
}