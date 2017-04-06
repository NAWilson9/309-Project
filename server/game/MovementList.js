/**
 * Created by ajrmatt on 3/21/17.
 */
module.exports.MovementList = class MovementList {
    constructor(movements) {
        this.first = movements[0];
        if (movements.length > 1) {
            for (let i = 0; i < movements.length; i++) {
                if (i !== 0) movements[i].prev = movements[i-1];
                else if (i !== movements.length-1) movements[i].next = movements[i+1];
            }
        }
    }
}