/**
 * Created by ajrmatt on 3/18/17.
 */
export default class Step {
    constructor(props) {
        this.nextSteps = [];
        this.prev = props.prev;
        this.relativeLocation = props.relativeLocation;
        this.canMoveHere = props.canMoveHere;
    }
}