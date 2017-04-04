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
        case 'newChatMessage': {
            // todo: Supposed to be log.slice()? - Adam
            let newLog = state.log.splice();
            newLog.push(action.payload);
            return {...state, log: newLog}
        }
        default: {
            return state
        }
    }
}