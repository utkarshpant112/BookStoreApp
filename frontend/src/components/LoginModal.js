import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, signin } from "../actions/userActions";

import { Navigate } from "react-router";

export default function LoginModal(props) {
  const [show, setShow] = useState(props.show);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isloggedin, setisloggedin] = useState(false);

  const dispatch = useDispatch();

  //name change handler to update state variable with the text entered by the user
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  //name change handler to update state variable with the text entered by the user
  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
  };

  //submit Login handler to send a request to the node backend
  const submitLogin = (e) => {
    dispatch(login(email, password));
    setisloggedin(true);
  };

  return isloggedin ? (
    <Navigate to={props.redirectTo} />
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
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div class="container">
              <div class="login-form">
                <div class="main-div">
                  <div class="panel">
                    <p>Please enter your username and password</p>
                  </div>

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
                  <Button variant="success" onClick={submitLogin}>
                    Login
                  </Button>
                  <div class={message ? "visible" : "invisible"}>
                    <div class="alert alert-danger">{message}</div>
                  </div>
                  <div className="mb-3">
                    New customer?{" "}
                    <Link to={`/signup`} onClick={handleClose}>
                      Create your account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
