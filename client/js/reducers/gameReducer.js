export default function reducer(state={
    players: [],
    board: [
        [1,2,3,4,5,6,7,8],
        [1,2,3,4,5,6,7,8],
        [1,2,3,4,5,6,7,8],
        [1,2,3,4,5,6,7,8],
        [1,2,3,4,5,6,7,8],
        [1,2,3,4,5,6,7,8],
        [1,2,3,4,5,6,7,8],
        [1,2,3,4,5,6,7,8]
    ],
    over: false
}, action) {

    switch (action.type) {
        case "gg": {
            return {...state, over: true}
        }
        default: {
            return state
        }
    }
}