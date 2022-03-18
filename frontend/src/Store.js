import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { currencyReducer } from "./reducers/currencyreducer";
import { favoritesupdatedreducer } from "./reducers/favoritesreducer";
import {
  productreducer,
  shopPageProductsUpdatedreducer,
} from "./reducers/productreducer";
import {
  loginstatusReducer,
  usererror,
  userSigninReducer,
} from "./reducers/userReducers";

const initialState = {
  userInfo: null,
  isLoggedIn: false,
  currency: { currency: "$" },
  products: null,
  error: "",
  shopPageProductsUpdated: false,
  favoritesupdated: false,
};
const reducer = combineReducers({
  userInfo: userSigninReducer,
  error: usererror,
  currency: currencyReducer,
  isLoggedIn: loginstatusReducer,
  products: productreducer,
  shopPageProductsUpdated: shopPageProductsUpdatedreducer,
  favoritesupdated: favoritesupdatedreducer,
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const Store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);

export default Store;
