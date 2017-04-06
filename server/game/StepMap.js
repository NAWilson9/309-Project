/**
 * Created by ajrmatt on 3/23/17.
 */
const Step = require('./Step').Step;
module.exports.StepMap = class StepMap {
    constructor() {
        this.start = new Step({
            prev: null,
            relativeLocation: { x: 0, y: 0 },
            canStop: false,
        });
    }
    // add(step) {
    //     if (this.first === null)
    // }
}