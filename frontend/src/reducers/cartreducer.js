import { SET_CART } from "../constants/userConstants";

export const cartreducer = (state = {}, action) => {
  switch (action.type) {
    case SET_CART:
      return action.payload;
    default:
      return state;
  }
};
