/**
 * Created by ajrmatt on 3/17/17.
 */

export default class Player {
    constructor(props) {
        this.userData = props.userData;
        this.isBottomPlayer = props.isBottomPlayer;
        this.opponent = null;
        this.pieces = [];
        this.king = null;
        this.isInCheck = false;
        this.isInCheckmate = false;
    }
}