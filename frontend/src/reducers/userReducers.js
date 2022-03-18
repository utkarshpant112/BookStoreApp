import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAIL,
  CLEAR_ERROR_MESSAGE,
  UPDATE_USER_INFO,
} from "../constants/userConstants";

export const userSigninReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      return action.payload;
    case USER_LOGOUT:
      return null;
    case USER_SIGNUP_SUCCESS:
      return action.payload;
    case UPDATE_USER_INFO:
      console.log(action.payload.data);
      return action.payload.data;

    default:
      return state;
  }
};

export const usererror = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_FAIL:
      return action.payload;
    case USER_SIGNUP_FAIL:
      return action.payload;
    case CLEAR_ERROR_MESSAGE:
      return "";
    default:
      return state;
  }
};

export const loginstatusReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      return true;
    case USER_LOGOUT:
      return false;
    case USER_SIGNUP_SUCCESS:
      return true;
    default:
      return state;
  }
};
