export default function reducer(state={
    username: 'ur trash',
}, action) {

    switch (action.type) {
        case 'login.jsx': {
            return {...state, username: action.payload}
        } case 'logout': {
            return {...state, username: null}
        } default: {
            return state
        }
    }
}