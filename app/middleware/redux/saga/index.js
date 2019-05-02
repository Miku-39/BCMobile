import { takeLatest } from 'redux-saga/effects'

import { LOGIN_REQUEST } from '../actions/Session'
import { FETCH_REQUEST } from '../actions/Tickets'
import { UPDATE_TICKET_REQUEST, ADD_TICKET_REQUEST, ADD_FILE_REQUEST } from '../actions/Ticket'
import loginSaga from './Session'
import ticketsSaga from './Tickets'
import { updateTicketSaga, addTicketSaga, addFileSaga } from './Ticket'


function * sagaWatcher() {
    yield [
        takeLatest(LOGIN_REQUEST, loginSaga),
        takeLatest(FETCH_REQUEST, ticketsSaga),
        takeLatest(UPDATE_TICKET_REQUEST, updateTicketSaga),
        takeLatest(ADD_TICKET_REQUEST, addTicketSaga),
        takeLatest(ADD_FILE_REQUEST, addFileSaga)
    ]
}

export default sagaWatcher
