export default function reducer(state={
    page: 'game'
}, action) {

    switch (action.type) {
        case 'changeView': {
            return {...state, page: action.payload}
        } default: {
            return state
        }
    }
}