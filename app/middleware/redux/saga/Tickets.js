import { call, put, select } from 'redux-saga/effects'

import { isFetching, fetched, fetchFailed, fetch } from '../actions/Tickets'
import api from '../../api'
import { getSession } from '../selectors'


function * fetchTicketsSaga() {
    yield put(isFetching())
    const store = yield select()
    const session = getSession(store)
    var response
    try {

        if(session.roles.includes('bolshevikSecurityChief')){
              response = yield call(api.fetchTicketsForSecurityChief)
        } else {
              response = session.roles.includes('mobileCheckpoint') ?
              yield call(api.fetchTicketsForCheckpoint)
              : yield call(api.fetchAllTickets, session.companyId)
        }

        yield put(fetched(response.data))
    }
    catch(error) {
        yield put(fetchFailed(error))
    }
}

export default fetchTicketsSaga
