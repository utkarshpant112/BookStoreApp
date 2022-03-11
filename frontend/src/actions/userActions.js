import axios from "axios";
import cookie, { setRawCookie } from "react-cookies";
import { createBrowserHistory } from "history";

import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAIL,
} from "../constants/userConstants";

export const login = (email, password) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST, payload: { email, password } });
  try {
    const data = {
      email: email,
      password: password,
    };
    console.log(email, password);
    axios.defaults.withCredentials = true;
    axios.post("http://localhost:3001/login", data).then((response) => {
      console.log("Status Code : ", response.status);
      console.log("Status data : ", response.data);
      if (response.status === 200) {
        localStorage.setItem("email", email);
        dispatch({ type: USER_LOGIN_SUCCESS, payload: response.data });
      } else {
        dispatch({ type: USER_LOGIN_FAIL, payload: response.data });
      }
    });
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = (email, password) => async (dispatch) => {
  cookie.remove("cookie", { path: "/" });
  localStorage.removeItem("email");
  localStorage.removeItem("cartItems");
  dispatch({ type: USER_LOGOUT });
};

export const signup = (name, email, password) => async (dispatch) => {
  dispatch({ type: USER_SIGNUP_REQUEST, payload: { name, email, password } });
  try {
    const data = {
      name: name,
      email: email,
      password: password,
    };
    console.log(name, email, password);
    axios.defaults.withCredentials = true;

    axios.post("http://localhost:3001/signup", data).then((response) => {
      console.log("Status Code : ", response.status);
      if (response.status === 200) {
        localStorage.setItem("email", email);
        dispatch({ type: USER_SIGNUP_SUCCESS, payload: response.data });
      } else {
        dispatch({ type: USER_SIGNUP_FAIL, payload: response.data });
      }
    });
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
