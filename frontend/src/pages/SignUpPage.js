import React, { Component, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Navigate } from "react-router";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signup } from "../actions/userActions";

//Define a Login Component
function SignUpPage(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authFlag, setaAthFlag] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setisLoggedIn] = useState(false);

  const dispatch = useDispatch();

  //name change handler to update state variable with the text entered by the user
  const nameChangeHandler = (e) => {
    setName(e.target.value);
  };
  //email change handler to update state variable with the text entered by the user
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  };
  //password change handler to update state variable with the text entered by the user
  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
  };
  //submit Login handler to send a request to the node backend
  const submitSignUp = (e) => {
    dispatch(signup(name, email, password));
    setisLoggedIn(true);
  };

  return isLoggedIn ? (
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
            <button onClick={submitSignUp} class="btn btn-primary">
              Create Account
            </button>
            <div class={message ? "visible" : "invisible"}>
              <div class="alert alert-danger">{message}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
//export Singup Component
export default SignUpPage;
