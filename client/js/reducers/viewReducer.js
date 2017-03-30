export default function reducer(state={
    current: 'home',
    inQueue: false,
    inGame: false
}, action) {

    switch (action.type) {
        case 'changeView': {
            return {...state, current: action.payload}
        } case 'findGame': {
            return {...state, inQueue: true}
        } case 'cancelGameSearch': {
            return {...state, inQueue: false}
        } case 'gameFound': {
            return {...state, inGame: true, inQueue: false}
        } default: {
            return state
        }
    }
}