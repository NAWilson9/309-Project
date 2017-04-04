import { combineReducers } from "redux"

import chat from './chatReducer'
import game from './gameReducer'
import user from './userReducer'
import view from './viewReducer'

export default combineReducers({
    chat, game, user, view
})