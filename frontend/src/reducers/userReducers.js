import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAIL,
} from "../constants/userConstants";

export const userSigninReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      return { userInfo: action.payload };
    case USER_LOGIN_FAIL:
      return { error: action.payload };
    case USER_LOGOUT:
      return {};
    case USER_SIGNUP_SUCCESS:
      return { userInfo: action.payload };
    case USER_SIGNUP_FAIL:
      return { error: action.payload };
    default:
      return state;
  }
};
