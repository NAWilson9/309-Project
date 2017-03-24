/**
 * Created by ajrmatt on 3/17/17.
 */

export default class User {
    constructor(props) {
        this.username = props.username;
        this.password = props.password;
        this.rating = props.rating;
        this.wins = props.wins;
        this.losses = props.losses;
        this.draws = props.draws;
        this.friends = props.friends;
        this._id = props._id;
        this.isBottomPlayer = props.isBottomPlayer;
    }
}