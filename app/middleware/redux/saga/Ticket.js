import { call, put } from 'redux-saga/effects'

import * as actions from '../actions/Ticket'
import api from '../../api'


export function * updateTicketSaga(action) {
    yield put(actions.isUpdating())

    try {
        const response = yield call(api.updateTicketStatus, action.payload)
        yield put(actions.updated())
    }
    catch(error) {
        yield put(actions.updateFailed(error))
    }
}

export function * addTicketSaga(action) {
    yield put(actions.isAdding())

    try {
        const response = yield call(api.addTicket, action.payload)
        yield put(actions.added())
    }
    catch(error) {
        yield put(actions.addingFailed(error))
    }
}

export function * addFileSaga(action){
  yield put(actions.fileIsAdding())

  try {
      const response = yield call(api.addFile, action.payload)
      const ticketId = response.data[0].id
      yield put(actions.fileAdded(ticketId))
  }
  catch(error) {
      yield put(actions.fileAddingFailed(error))
  }
}

export function * getFileSaga(action){
  yield put(actions.fileIsDownloading())
  try {
      const response = yield call(api.getFileLink, action.payload)
      const link = response.data.url
      yield put(actions.fileDownloaded(link))
  }
  catch(error) {
      //console.error(error)
      yield put(actions.fileDownloadingFailed(error))
  }
}
