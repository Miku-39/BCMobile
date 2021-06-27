import { call, put, select } from "redux-saga/effects";

import { isFetching, fetched, fetchFailed, fetch } from "../actions/Tickets";
import api from "../../api";
import { getSession } from "../selectors";

function* fetchTicketsSaga() {
  yield put(isFetching());
  const store = yield select();
  const session = getSession(store);
  try {
    var regularTicketsResponse;
    var onCreateTicketsResponse;
    var openTicketsResponse;
    var newTicketsResponse;
    var completedTicketsResponse;
    var activeTicketsResponse;

    if (session.isLesnaya) {
      regularTicketsResponse = yield call(
        api.fetchAllTickets,
        session.companyId
      );
      if (session.roles.includes("restrictedAdministratorBC")) {
        openTicketsResponse = yield call(
          api.fetchOpenTicketsRestricted,
          session.companyId
        );
      } else {
        openTicketsResponse = yield call(
          api.fetchOpenTickets,
          session.companyId
        );
      }
    } else {
      if (session.roles.includes("mobileCheckpoint")) {
        regularTicketsResponse = yield call(
          api.fetchTicketsForCheckpoint,
          session.companyId
        );
      } else {
        regularTicketsResponse = yield call(
          api.fetchAllTickets,
          session.companyId
        );
      }

      if (session.roles.includes("bolshevikSecurityChief")) {
        regularTicketsResponse = yield call(
          api.fetchTicketsForSecurityChief,
          session.companyId
        );
      }
    }

    if (
      session.roles.includes("serviceRequestsManager") ||
      session.roles.includes("administratorBC")
    ) {
      newTicketsResponse = yield call(api.fetchNewTickets);
      completedTicketsResponse = yield call(api.fetchCompletedTickets);
      activeTicketsResponse = yield call(api.fetchActiveTickets);
    }

    var tickets = {
      regularTickets: regularTicketsResponse ? regularTicketsResponse.data : [],
      //onCreateTickets: onCreateTicketsResponse ? onCreateTicketsResponse.data : [],
      openTickets: openTicketsResponse ? openTicketsResponse.data : [],
      newTickets: newTicketsResponse ? newTicketsResponse.data : [],
      completedTickets: completedTicketsResponse
        ? completedTicketsResponse.data
        : [],
      activeTickets: activeTicketsResponse ? activeTicketsResponse.data : [],
    };

    console.log(
      tickets.newTickets.length +
        " " +
        tickets.completedTickets.length +
        " " +
        tickets.activeTickets.length
    );

    if (tickets.openTickets) {
      tickets.onCreateTickets = tickets.openTickets.filter((ticket) => {
        if (ticket.status.id == "4285215000") {
          if (session.roles.includes("restrictedAdministratorBC")) {
            return ticket.department == session.departmentId;
          } else {
            return true;
          }
        } else {
          return false;
        }
      });
    }
    yield put(fetched(tickets));
    yield put(fetched(tickets));
  } catch (error) {
    console.warn(error);
    yield put(fetchFailed(error));
  }
}

export default fetchTicketsSaga;
