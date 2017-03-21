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
    over: false,
    moves: 0,
    time: 0
}, action) {

    switch (action.type) {
        case "gg": {
            return {...state, over: !state.over}
        }
        case 'move': {
            return {...state, moves: state.moves + 1}
        }
        case 'tick': {
            return {...state, time: state.time + 1}
        }
        default: {
            return state
        }
    }
}