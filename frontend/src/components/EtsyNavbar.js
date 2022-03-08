import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import { Component, useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import cookie from "react-cookies";
import { Navigate, withRouter } from "react-router";
import SearchBox from "./Searchbox";
import LoginModal from "./LoginModal";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { logout, signin, signout } from "../actions/userActions";
import { connect } from "react-redux";

function EtsyNavbar(props) {
  const [isLoggedIn, setisLoggedIn] = useState("");
  const dispatch = useDispatch();

  //handle logout to destroy the cookie
  const handleLogout = (e) => {
    console.log("Inside logout");
    dispatch(logout());
    cookie.remove("cookie", { path: "/" });
  };

  return (
    <div className="EtsyNavbar">
      <Navbar bg="white" variant="white">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="logo">Etsy</Navbar.Brand>
          </LinkContainer>
          <SearchBox></SearchBox>
          <Nav className="me-auto">
            {!cookie.load("cookie") ? (
              <LoginModal
                buttonName={"Favourites"}
                redirectTo={"/favorites"}
              ></LoginModal>
            ) : (
              <Link to="/favorites" className="nav-link">
                Favourites
              </Link>
            )}
          </Nav>
          <Nav className="me-auto">
            {!cookie.load("cookie") ? (
              <LoginModal
                buttonName={"Sell"}
                redirectTo={"/createshop"}
              ></LoginModal>
            ) : (
              <Link to="/createshop" className="nav-link">
                Sell
              </Link>
            )}
          </Nav>
          <Nav className="me-auto">
            {!cookie.load("cookie") ? (
              <LoginModal
                buttonName={"My Purchases"}
                redirectTo={"/mypurchases"}
              ></LoginModal>
            ) : (
              <Link to="/mypurchases" className="nav-link">
                My Purchases
              </Link>
            )}
          </Nav>
          <Nav className="me-auto">
            {!cookie.load("cookie") ? (
              <LoginModal
                buttonName={"Profile"}
                redirectTo={"/profile"}
              ></LoginModal>
            ) : (
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
            )}
          </Nav>
          <Nav className="me-auto">
            <Link to="/cart" className="nav-link">
              Cart
            </Link>
          </Nav>
          {props.user ? (
            <ul class="nav navbar-nav navbar-right">
              <li>
                <Link to="/" onClick={handleLogout} className="nav-link">
                  Logout
                </Link>
              </li>
            </ul>
          ) : (
            <ul class="nav navbar-nav navbar-right">
              <li>
                <LoginModal buttonName={"Login"} redirectTo={"/"}></LoginModal>
              </li>
            </ul>
          )}
        </Container>
      </Navbar>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.userSignin.userInfo,
  };
};

export default connect(mapStateToProps)(EtsyNavbar);
