/**
 * Created by ajrmatt on 3/23/17.
 */
export default class GameState {
    constructor(props) {
        this.board = props.board;
        this.activePlayer = props.activePlayer;
        this.moveSuccessful = props.moveSuccessful;
        this.errMsg = props.errMsg;
    }
}