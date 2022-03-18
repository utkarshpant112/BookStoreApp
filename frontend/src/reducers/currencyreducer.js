import { CURRENCY_CHANGE_REQUEST } from "../constants/userConstants";

export const currencyReducer = (state = {}, action) => {
  switch (action.type) {
    case CURRENCY_CHANGE_REQUEST:
      return action.payload;
    default:
      return state;
  }
};
