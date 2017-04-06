export default function reducer(state={
    current: 'home',
    inQueue: false,
    inGame: false,
}, action) {

    switch (action.type) {
        case 'changeView': {
            return {...state, current: action.payload}
        } case 'findGame': {
           return {...state, inQueue: true}
        } case 'gameFound': {
            return {...state, inGame: true, inQueue: false}
        } case 'leaveGame': {
            return {...state, inGame: false}
        } case 'leaveQueue': {
            return {...state, inQueue: false}
        } default: {
            return state
        }
    }
}