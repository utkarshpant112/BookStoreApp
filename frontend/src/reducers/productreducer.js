import {
  SET_PRODUCTS,
  SHOP_PAGE_PRODUCTS_UPDATED,
} from "../constants/userConstants";

export const productreducer = (state = {}, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return action.payload;
    default:
      return state;
  }
};

export const shopPageProductsUpdatedreducer = (state = {}, action) => {
  switch (action.type) {
    case SHOP_PAGE_PRODUCTS_UPDATED:
      return action.payload;
    default:
      return state;
  }
};
