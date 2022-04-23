import { SET_CART } from "../constants/userConstants";

export const setcartaction = (products) => async (dispatch) => {
  dispatch({ type: SET_CART, payload: { products } });
};
