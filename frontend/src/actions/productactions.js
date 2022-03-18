import {
  SET_PRODUCTS,
  SHOP_PAGE_PRODUCTS_UPDATED,
} from "../constants/userConstants";

export const setproductaction = (products) => async (dispatch) => {
  dispatch({ type: SET_PRODUCTS, payload: { products } });
};

export const shopPageProductsUpdated = (data) => async (dispatch) => {
  dispatch({ type: SHOP_PAGE_PRODUCTS_UPDATED, payload: { data } });
};
