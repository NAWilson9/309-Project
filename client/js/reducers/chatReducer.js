export default function reducer(state={
    log: []
}, action) {

    switch (action.type) {
        case 'chatMessage': {
            let newLog = state.log.splice();
            newLog.push(action.payload);
            return {...state, log: newLog}
        }
        default: {
            return state
        }
    }
}