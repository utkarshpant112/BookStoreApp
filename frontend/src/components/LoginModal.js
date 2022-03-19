import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cleearerrormessage, login } from "../actions/userActions";
import { Navigate } from "react-router";

export default function LoginModal(props) {
  const [show, setShow] = useState(props.show);
  const handleShow = () => setShow(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const error = useSelector((state) => state.error);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const dispatch = useDispatch();

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
    setShow(false);
  };

  //submit Login handler to send a request to the node backend
  const submitLogin = async (e) => {
    dispatch(cleearerrormessage());
    dispatch(login(email, password)).then((response) => {});
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
                  <div class={error ? "visible" : "invisible"}>
                    <div class="alert alert-danger">{error}</div>
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
