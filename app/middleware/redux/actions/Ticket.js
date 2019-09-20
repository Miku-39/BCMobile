export const UPDATE_TICKET_REQUEST = 'updateTicket'
export const IS_UPDATING = 'isUpdating'
export const UPDATED = 'updated'
export const UPDATE_FAILED = 'updateFailed'
export const CLEAR_FLAGS = 'clearFlags'
export const ADD_TICKET_REQUEST = 'addTicket'
export const ADD_FILE_REQUEST = 'addFile'
export const IS_ADDING = 'isAdding'
export const FILE_IS_ADDING = 'fileIsAdding'
export const ADDED = 'added'
export const FILE_ADDED = 'fileAdded'
export const ADDING_FAILED = 'addingFailed'
export const FILE_ADDING_FAILED = 'fileAddingFailed'


export const update = (ticket) => {
    return {
        type: UPDATE_TICKET_REQUEST,
        payload: ticket
    }
}

export const isUpdating = (isUpdated) => {
    return {
        type: IS_UPDATING,
        payload: isUpdating
    }
}

export const updated = () => {
    return {
        type: UPDATED
    }
}

export const updateFailed = (error) => {
    return {
        type: UPDATE_FAILED,
        payload: error
    }
}

export const dismiss = () => {
    return {
        type: CLEAR_FLAGS
    }
}

export const add = (ticket) => {
    return {
        type: ADD_TICKET_REQUEST,
        payload: ticket
    }
}

export const addFile = (file) => {
  return {
      type: ADD_FILE_REQUEST,
      payload: (file)
  }
}

export const isAdding = (isAdding) => {
    return {
        type: IS_ADDING,
        payload: isAdding
    }
}

export const fileIsAdding = (fileIsAdding) => {
    return {
        type: FILE_IS_ADDING,
        payload: fileIsAdding
    }
}

export const added = () => {
    return {
        type: ADDED
    }
}

export const fileAdded = (fileId) => {
    return {
        type: FILE_ADDED,
        payload: fileId
    }
}

export const addingFailed = (error) => {
    return {
        type: ADDING_FAILED,
        payload: error
    }
}

export const fileAddingFailed = (error) => {
    return {
        type: FILE_ADDING_FAILED,
        payload: error
    }
}
