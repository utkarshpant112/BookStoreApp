import { FAVORITES_UPDATED } from "../constants/userConstants";

export const favoritesupdatedreducer = (state = {}, action) => {
  switch (action.type) {
    case FAVORITES_UPDATED:
      return action.payload;
    default:
      return state;
  }
};
