import { combineReducers } from 'redux'
import session from './Session'
import tickets from './Tickets'
import ticket from './Ticket'

const root = combineReducers({
  session,
  tickets,
  ticket
})

export default root
