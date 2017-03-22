export default function reducer(state={
    page: 'home'
}, action) {

    switch (action.type) {
        case 'changeView': {
            return {...state, page: action.payload}
        } default: {
            return state
        }
    }
}