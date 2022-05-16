import axios from "axios";
import validator from "validator";
import jwt_decode from "jwt-decode";
import { loginMutation, signUpMutation } from "../graphql/mutations";

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

const qlQuery = async (query, variables = {}) => {
  const resp = await fetch("http://localhost:4001", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  return (await resp.json()).data;
};

export const login = (email, password) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST, payload: { email, password } });

  if (!validator.isEmail(email)) {
    dispatch({ type: USER_LOGIN_FAIL, payload: "Email is not valid" });
  } else {
    console.log(email, password);

    const userRes = await qlQuery(
      loginMutation,
      { email: email, password: password } //variables need to passed as the second argument
    );
    console.log("userRes", userRes);
    localStorage.setItem("token", userRes.loginUser.token);
    var decoded = jwt_decode(userRes.loginUser.token.split(" ")[1]);
    console.log(decoded);
    dispatch({ type: USER_LOGIN_SUCCESS, payload: decoded });

    // axios.defaults.withCredentials = true;
    // axios
    //   .post("/api/auth/login", data)
    //   .then((response) => {
    //     console.log("Status Code : ", response.status);
    //     console.log("Status data : ", response.data);
    //     if (response.status === 200) {
    //       localStorage.setItem("token", response.data);

    //       var decoded = jwt_decode(response.data.split(" ")[1]);
    //       console.log(decoded);
    //       dispatch({ type: USER_LOGIN_SUCCESS, payload: decoded });
    //     }
    //     return "";
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     dispatch({ type: USER_LOGIN_FAIL, payload: error.response.data });
    //     return error.response.data;
    //   });
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
    // const data = {
    //   email: email,
    //   name: name,
    //   password: password,
    // };
    console.log(name, email, password);
    axios.defaults.withCredentials = true;
    const data = { email: email, password: password, name: name };

    const userRes = await qlQuery(
      signUpMutation,
      { email: email, password: password, name: name } //variables need to passed as the second argument
    );
    console.log("userRes", userRes);
    localStorage.setItem("token", userRes.addUser.token);
    var decoded = jwt_decode(userRes.addUser.token.split(" ")[1]);
    console.log(decoded);
    dispatch({ type: USER_SIGNUP_SUCCESS, payload: decoded });
    // axios
    //   .post("/api/auth/signup", data)
    //   .then((response) => {
    //     console.log("Status Code : ", response.status);
    //     if (response.status === 200) {
    //       localStorage.setItem("token", response.data);
    //       var decoded = jwt_decode(response.data.split(" ")[1]);
    //       dispatch({ type: USER_SIGNUP_SUCCESS, payload: decoded.data });
    //       return "";
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error.response.data);
    //     dispatch({ type: USER_SIGNUP_FAIL, payload: error.response.data });
    //     return error.response.data;
    //   });
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
