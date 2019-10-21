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
        var regularTickets = []
        var onCreatetickets = []
        var openTickets = []

        if(session.roles.includes('mobileCheckpoint')){
          regularTickets = (yield call(api.fetchTicketsForCheckpoint, session.companyId)).data
        }else{
          regularTickets = (yield call(api.fetchAllTickets, session.companyId)).data
        }

        if(session.isLesnaya){
          onCreatetickets = (yield call(api.fetchOnCreateTickets, companyId)).data
          openTickets = (yield call(api.fetchOpenTickets, companyId)).data
        }

        const tickets = {
          regularTickets: regularTickets,
          onCreatetickets: onCreatetickets,
          openTickets: openTickets
        }

        yield put(fetched(tickets))
    }
    catch(error) {
      console.log(error)
        yield put(fetchFailed(error))
    }
}

export default fetchTicketsSaga
