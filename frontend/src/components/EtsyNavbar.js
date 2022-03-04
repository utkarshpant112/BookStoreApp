import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import { Component, useContext } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import cookie from "react-cookies";
import { Navigate } from "react-router";

class EtsyNavbar extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  //handle logout to destroy the cookie
  handleLogout = () => {
    cookie.remove("cookie", { path: "/" });
    window.location.reload();
    window.open("/login", "_self");
  };

  render() {
    //if Cookie is set render Logout Button
    let navLogin = null;
    if (cookie.load("cookie")) {
      console.log("Able to read cookie");
      navLogin = (
        <ul class="nav navbar-nav navbar-right">
          <li>
            <Link to="/" onClick={this.handleLogout}>
              <span class="glyphicon glyphicon-user"></span>Logout
            </Link>
          </li>
        </ul>
      );
    } else {
      //Else display login button
      console.log("Not Able to read cookie");
      navLogin = (
        <ul class="nav navbar-nav navbar-right">
          <li>
            <Link to="/login">
              <span class="glyphicon glyphicon-log-in"></span> Login
            </Link>
          </li>
        </ul>
      );
    }
    let redirectVar = null;
    if (cookie.load("cookie")) {
      redirectVar = <Navigate to="/" />;
    }
    return (
      <div>
        {redirectVar}
        <Navbar bg="white" variant="white">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand className="logo">Etsy</Navbar.Brand>
            </LinkContainer>
            <Nav className="me-auto">
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
            </Nav>
            <Nav className="me-auto">
              <Link to="/cart" className="nav-link">
                Cart
              </Link>
            </Nav>
            {navLogin}
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default EtsyNavbar;
