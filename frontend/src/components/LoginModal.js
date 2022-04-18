import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cleearerrormessage, login, signup } from "../actions/userActions";
import { Navigate } from "react-router";

export default function LoginModal(props) {
  const [show, setShow] = useState(props.show);
  const handleShow = () => setShow(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState("");
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
    console.log(props.redirectTo);
    dispatch(cleearerrormessage());
  };

  //Closing the modal
  const handleClose = () => {
    dispatch(cleearerrormessage());
    setIsSignUp(false);
    setShow(false);
  };

  //Changing to Sign Up  modal
  const handleOpenSignUp = async (e) => {
    dispatch(cleearerrormessage());
    setIsSignUp(true);
  };

  //Changing back to login modal
  const handleOpenLogin = async (e) => {
    dispatch(cleearerrormessage());
    setIsSignUp(false);
  };

  //submit Login handler to send a request to the node backend
  const submitLogin = async (e) => {
    dispatch(cleearerrormessage());
    dispatch(login(email, password)).then((response) => {});
  };

  //submit Login handler to send a request to the node backend
  const submitSignUp = async (e) => {
    dispatch(signup(name, email, password));
  };

  return isLoggedIn ? (
    <Navigate to={props.redirectTo} state={"loggedin"} />
  ) : (
    <>
      <Link to={""} onClick={handleShow} className="nav-link">
        {props.buttonName}
      </Link>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          {isSignUp ? (
            <Modal.Title>Create Your Account</Modal.Title>
          ) : (
            <Modal.Title>Login</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          <div>
            <div class="container">
              <div class="login-form">
                <div class="main-div">
                  <div class="panel">
                    {isSignUp ? (
                      <p>Please enter your details</p>
                    ) : (
                      <p>Please enter your username and password</p>
                    )}
                  </div>
                  {isSignUp ? (
                    <div class="form-group" style={{ width: "70%" }}>
                      <input
                        onChange={nameChangeHandler}
                        type="text"
                        class="form-control"
                        name="name"
                        placeholder="Full Name"
                      />
                    </div>
                  ) : (
                    <p></p>
                  )}
                  <br></br>
                  <div class="form-group" style={{ width: "70%" }}>
                    <input
                      onChange={emailChangeHandler}
                      type="email"
                      class="form-control"
                      name="email"
                      placeholder="Email Address"
                    />
                  </div>
                  <br></br>
                  <div class="form-group" style={{ width: "70%" }}>
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
                    {isSignUp ? (
                      <Button onClick={submitSignUp} variant="success">
                        Create Account
                      </Button>
                    ) : (
                      <Button variant="success" onClick={submitLogin}>
                        Login
                      </Button>
                    )}
                  </div>
                  <br></br>
                  <div class={error ? "visible" : "invisible"}>
                    <div class="alert alert-danger">{error}</div>
                  </div>
                  {isSignUp ? (
                    <div className="mb-3">
                      Already have an account?{" "}
                      <Button onClick={handleOpenLogin} variant="link">
                        Login
                      </Button>{" "}
                    </div>
                  ) : (
                    <div className="mb-3">
                      New customer?{" "}
                      <Button onClick={handleOpenSignUp} variant="link">
                        Create your account
                      </Button>{" "}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
