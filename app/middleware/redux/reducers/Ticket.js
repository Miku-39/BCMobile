import { Map } from 'immutable'
import { UPDATE_REQUEST, IS_UPDATING, UPDATED, UPDATE_FAILED, CLEAR_FLAGS } from '../actions/Ticket'
import { ADD_TICKET_REQUEST, ADD_FILE_REQUEST, IS_ADDING, FILE_IS_ADDING,
         ADDED, FILE_ADDED, ADDING_FAILED, FILE_ADDING_FAILED } from '../actions/Ticket'

const initialState = Map({
    item: null,
    isUpdating: false,
    updated: false,
    isAdding: false,
    fileIsAdding: false,
    added: false,
    fileAdded: false,
    fileId: null,
    error: null
})

export default ticketReducer = (state = initialState, action) => {
    switch (action.type){
        case UPDATE_REQUEST:
            return initialState

        case IS_UPDATING:
            return state.merge({ isUpdating: true })

        case UPDATED:
            return state.merge({ isUpdating: false, updated: true })

        case UPDATE_FAILED:
            return state.merge({ isUpdating: false, error: action.payload })

        case CLEAR_FLAGS:
            return state.merge({ updated: false, added: false })

        case ADD_FILE_REQUEST:
            return initialState

        case ADD_TICKET_REQUEST:
            return initialState

        case IS_ADDING:
            return state.merge({ isAdding: true })

        case ADDED:
            return state.merge({ isAdding: false, added: true })

        case ADDING_FAILED:
            return state.merge({ isAdding: false, error: action.payload })

        case FILE_IS_ADDING:
            return state.merge({ fileIsAdding: true })

        case FILE_ADDED:
            return state.merge({ fileIsAdding: false, fileAdded: true, fileId: action.payload })

        case FILE_ADDING_FAILED:
            return state.merge({ fileIsAdding: false, error: action.payload })

        default: return state
    }
}
