import { CURRENCY_CHANGE_REQUEST } from "../constants/userConstants";

export const currencychange = (currency) => async (dispatch) => {
  dispatch({ type: CURRENCY_CHANGE_REQUEST, payload: { currency } });
};
