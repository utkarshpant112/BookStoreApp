import axios from "axios";
import validator from "validator";
import jwt_decode from "jwt-decode";

import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  CLEAR_ERROR_MESSAGE,
  UPDATE_USER_INFO,
  USER_SIGNUP_FAIL,
} from "../constants/userConstants";

export const login = (email, password) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST, payload: { email, password } });

  if (!validator.isEmail(email)) {
    dispatch({ type: USER_LOGIN_FAIL, payload: "Email is not valid" });
  } else {
    const data = {
      email: email,
      password: password,
    };
    console.log(email, password);
    axios.defaults.withCredentials = true;
    axios
      .post("/api/auth/login", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        console.log("Status data : ", response.data);
        if (response.status === 200) {
          localStorage.setItem("token", response.data);

          var decoded = jwt_decode(response.data.split(" ")[1]);
          dispatch({ type: USER_LOGIN_SUCCESS, payload: decoded });
        }
        return "";
      })
      .catch((error) => {
        console.log(error);
        dispatch({ type: USER_LOGIN_FAIL, payload: error.response.data });
        return error.response.data;
      });
  }
};

export const signup = (name, email, password) => async (dispatch) => {
  dispatch({ type: USER_SIGNUP_REQUEST, payload: { name, email, password } });
  if (!validator.isEmail(email)) {
    dispatch({ type: USER_SIGNUP_FAIL, payload: "Email entered is not valid" });
  } else if (!validator.isStrongPassword(password)) {
    dispatch({
      type: USER_SIGNUP_FAIL,
      payload: "Password entered is not strong enough",
    });
  } else if (!validator.isAlpha(name, "en-US", { ignore: " " })) {
    dispatch({
      type: USER_SIGNUP_FAIL,
      payload: "Name must have letters only",
    });
  } else {
    const data = {
      name: name,
      email: email,
      password: password,
    };
    console.log(name, email, password);
    axios.defaults.withCredentials = true;

    axios
      .post("/api/auth/signup", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          localStorage.setItem("token", response.data);
          var decoded = jwt_decode(response.data.split(" ")[1]);
          dispatch({ type: USER_SIGNUP_SUCCESS, payload: decoded });
          return "";
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        dispatch({ type: USER_SIGNUP_FAIL, payload: error.response.data });
        return error.response.data;
      });
  }
};

export const logout = (email, password) => async (dispatch) => {
  localStorage.removeItem("cartItems");
  dispatch({ type: USER_LOGOUT });
};

export const cleearerrormessage = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERROR_MESSAGE });
};

export const updateUserInfo = (data) => async (dispatch) => {
  console.log(data);
  dispatch({ type: UPDATE_USER_INFO, payload: { data } });
};
