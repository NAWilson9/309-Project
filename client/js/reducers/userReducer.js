export default function reducer(state={
    draws: 0,
    losses: 0,
    rating: 0,
    username: null,
    wins: 0
}, action) {

    switch (action.type) {
        case 'login': {
            return action.payload; /*{...state, username: action.payload.username}*/
        } case 'logout': {
            return {...state, username: null}
        } default: {
            return state
        }
    }
}