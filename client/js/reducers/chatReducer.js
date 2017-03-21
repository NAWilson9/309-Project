export default function reducer(state={
    log: [
        {
            'username':'Player 1',
            'time': '11:45AM',
            'content': 'Ur trash'
        },
        {
            'username':'Player 2',
            'time': '11:45AM',
            'content': 'i know'
        },
        {
            'username':'Player 1',
            'time': '11:46AM',
            'content': 'Git Gud'
        },
        {
            'username':'Player 2',
            'time': '11:45AM',
            'content': 'I\'m trying but I can\'t'
        }
    ]
}, action) {

    switch (action.type) {
        case 'newMessage': {
            return {...state, log: [state.log].push(action.payload)}
        }
        default: {
            return state
        }
    }
}