export default function reducer(state={
    current: 'home'
}, action) {

    switch (action.type) {
        case 'changeView': {
            return {...state, current: action.payload}
        } default: {
            return state
        }
    }
}