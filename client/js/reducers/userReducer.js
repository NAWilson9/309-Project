export default function reducer(state={
    username: null,
}, action) {

    switch (action.type) {
        case 'login': {
            return {...state, username: action.payload.username}
        } case 'logout': {
            return {...state, username: null}
        } default: {
            return state
        }
    }
}