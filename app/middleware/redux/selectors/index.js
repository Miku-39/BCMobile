export const getSession = store => store.session.toJS()

export const getTickets = store => store.tickets.toJS()

export const getTicket = store => store.ticket.toJS()

export const getCompanyId = store => store.session.get('companyId')

export const getEmployeeId = store => store.session.get('userId')

export const getIsTicketAdding = store => store.ticket.get('isAdding')

export const getIsFileAdding = store => store.ticket.get('fileIsAdding')

export const getIsTicketAdded = store => store.ticket.get('added')

export const getIsFileAdded = store => store.ticket.get('fileAdded')

export const getFileId = store => store.ticket.get('fileId')

export const getIsTicketAddingFailed = store => store.ticket.get('error')

export const getIsFileAddingFailed = store => store.ticket.get('error')
