import { combineReducers } from "redux"

import chat from './chatReducer'
import game from './gameReducer'

export default combineReducers({
    chat, game
})