import React, { useState } from "react";
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { cleearerrormessage, signup } from "../actions/userActions";
import cookie from "react-cookies";
import Button from "react-bootstrap/esm/Button";

//Define a Signup Page Component
export default function SignUpPage(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const error = useSelector((state) => state.error);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();

  //name change handler to update state variable with the text entered by the user
  const nameChangeHandler = (e) => {
    setName(e.target.value);
    dispatch(cleearerrormessage());
  };
  //email change handler to update state variable with the text entered by the user
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
    dispatch(cleearerrormessage());
  };
  //password change handler to update state variable with the text entered by the user
  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
    dispatch(cleearerrormessage());
  };

  //submit Login handler to send a request to the node backend
  const submitSignUp = async (e) => {
    dispatch(signup(name, email, password));
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
            <div>
              <Button onClick={submitSignUp} variant="success">
                Create Account
              </Button>
            </div>
            <br></br>
            <div class={error ? "visible" : "invisible"}>
              <div class="alert alert-danger">{error}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
