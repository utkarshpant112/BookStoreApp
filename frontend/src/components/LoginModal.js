import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/userActions";
import { Navigate } from "react-router";
import cookie from "react-cookies";

export default function LoginModal(props) {
  const [show, setShow] = useState(props.show);
  const handleShow = () => setShow(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errormessage, seterrorMessage] = useState("");
  const counter = useSelector((state) => state.userSignin.error);

  const dispatch = useDispatch();

  //email change handler to update state variable with the text entered by the user
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
    //remove error message if any
    seterrorMessage("");
  };

  //password change handler to update state variable with the text entered by the user
  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
    //remove error message if any
    seterrorMessage("");
  };

  //Closing the modal
  const handleClose = () => {
    seterrorMessage("");
    setShow(false);
  };

  //submit Login handler to send a request to the node backend
  const submitLogin = async (e) => {
    await seterrorMessage("");
    dispatch(login(email, password)).then((response) => {
      if (response !== "") {
        seterrorMessage(counter);
      }
    });
  };

  return cookie.load("cookie") ? (
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
                  <div>
                    <Button variant="success" onClick={submitLogin}>
                      Login
                    </Button>
                  </div>
                  <br></br>
                  <div class={errormessage ? "visible" : "invisible"}>
                    <div class="alert alert-danger">{errormessage}</div>
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
