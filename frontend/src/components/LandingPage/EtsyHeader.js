import React, { Component } from "react";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/Nav";

//create the Navbar Component
class EtsyHeader extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  //handle logout to destroy the cookie
  handleLogout = () => {
    cookie.remove("cookie", { path: "/" });
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
        <Link to="/login" className="nav-link">
          Login
        </Link>
      );
    }
    let redirectVar = null;
    if (cookie.load("cookie")) {
      redirectVar = <Link to="/home" />;
    }
    return (
      <div>
        {redirectVar}
        <header>
          <Navbar bg="white" variant="white">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand className="logo">Etsy</Navbar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/signin" className="nav-link">
                  Profile
                </Link>
                {navLogin}
              </Nav>
            </Container>
          </Navbar>
        </header>
      </div>
    );
  }
}

export default EtsyHeader;
