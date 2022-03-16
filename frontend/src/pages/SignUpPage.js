import React, { useState } from "react";
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../actions/userActions";
import cookie from "react-cookies";

//Define a Signup Page Component
export default function SignUpPage(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const counter = useSelector((state) => state.userSignin.error);
  const dispatch = useDispatch();

  //name change handler to update state variable with the text entered by the user
  const nameChangeHandler = (e) => {
    setName(e.target.value);
    setMessage("");
  };
  //email change handler to update state variable with the text entered by the user
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
    setMessage("");
  };
  //password change handler to update state variable with the text entered by the user
  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
    setMessage("");
  };

  //submit Login handler to send a request to the node backend
  const submitSignUp = async (e) => {
    await setMessage("");
    dispatch(signup(name, email, password)).then((response) => {
      console.log(counter);
      if (response !== "") {
        setMessage(counter);
      }
    });
  };

  return cookie.load("cookie") ? (
    <Navigate to="/home" />
  ) : (
    <div>
      <div class="container">
        <div class="login-form">
          <div class="main-div">
            <div class="panel">
              <h2>Create Your Account</h2>
              <p>Please enter your details</p>
            </div>
            <div class="form-group" style={{ width: "40%" }}>
              <input
                onChange={nameChangeHandler}
                type="text"
                class="form-control"
                name="name"
                placeholder="Full Name"
              />
            </div>
            <br></br>
            <div class="form-group" style={{ width: "40%" }}>
              <input
                onChange={emailChangeHandler}
                type="email"
                class="form-control"
                name="email"
                placeholder="Email Address"
              />
            </div>
            <br></br>
            <div class="form-group" style={{ width: "40%" }}>
              <input
                onChange={passwordChangeHandler}
                type="password"
                class="form-control"
                name="password"
                placeholder="Password"
              />
            </div>
            <br></br>
            <div>
              <button onClick={submitSignUp} class="btn btn-primary">
                Create Account
              </button>
            </div>
            <br></br>
            <div class={message ? "visible" : "invisible"}>
              <div class="alert alert-danger">{message}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
