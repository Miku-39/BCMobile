export const FETCH_REQUEST = "fetchRequest";
export const IS_FETCHING = "isFetching";
export const FETCHED = "fetched";
export const FETCH_FAILED = "fetchFailed";

export const fetch = () => {
  return {
    type: FETCH_REQUEST,
  };
};

export const isFetching = () => {
  return {
    type: IS_FETCHING,
  };
};

export const fetched = (tickets) => {
  return {
    type: FETCHED,
    payload: tickets,
  };
};

export const fetchFailed = (error) => {
  return {
    type: FETCH_FAILED,
    payload: error,
  };
};
