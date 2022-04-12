import axios from "axios";

import {
  SET_PRODUCTS,
  SHOP_PAGE_PRODUCTS_UPDATED,
} from "../constants/userConstants";

export const setproductaction = (products) => async (dispatch) => {
  dispatch({ type: SET_PRODUCTS, payload: { products } });
};

export const getAllProductsaction = () => async (dispatch) => {
  axios.get("/api/products").then((response) => {
    dispatch({ type: SET_PRODUCTS, payload: response.data });
  });
};

export const getOtherSellerProductsaction = (shopname) => async (dispatch) => {
  axios
    .get("/api/products/othersellerproducts/" + shopname)
    .then((response) => {
      dispatch({ type: SET_PRODUCTS, payload: response.data });
    });
};

export const shopPageProductsUpdated = (data) => async (dispatch) => {
  dispatch({ type: SHOP_PAGE_PRODUCTS_UPDATED, payload: { data } });
};
