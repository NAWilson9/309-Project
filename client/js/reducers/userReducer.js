export default function reducer(state={
    _id: null,
    draws: 0,
    losses: 0,
    rating: 0,
    username: null,
    wins: 0,
}, action) {

    switch (action.type) {
        case 'findGame': {
            let guid = action.payload;
            return {...state, _id: guid }
        } case 'login': {
            let user = action.payload;
            return {...state, _id: user._id, draws: user.draws, losses: user.losses, rating: user.rating, username: user.username, wins: user.wins }
        } case 'logout': {
            return {...state, _id: null, draws: 0, losses: 0, rating: 0, username: null, wins: 0 }
        } default: {
            return state
        }
    }
}