export default function reducer(state={
    username: null, //Todo: define data and defaults
}, action) {

    switch (action.type) {
        case 'login': {
            return {...state, username: action.payload.username} //Todo: set data
        } case 'logout': {
            return {...state, username: null} //Todo: clear data
        } default: {
            return state
        }
    }
}