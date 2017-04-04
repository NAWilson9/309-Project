/**
 * Created by ajrmatt on 3/18/17.
 */

module.exports.Movement = class Movement {
    constructor(props) {
        this.next = null;
        this.prev = null;
        this.mustPerform = props.mustPerform;
        this.mustComplete = props.mustComplete;
        this.possibleDirections = props.possibleDirections;
        this.maxDistance = props.maxDistance;
    }
};

module.exports.DependentMovement = class DependentMovement extends module.exports.Movement {
    constructor(props) {
        super(props);
        this.setFromResults = props.setFromResults;
        this.setFromMoveCount = props.setFromMoveCount;
        this.setFromBoardSize = props.setFromBoardSize;
    }
};