import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Navigate } from "react-router";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

//Define a Login Component
class LoginPage extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      email: "",
      password: "",
      authFlag: false,
      message: undefined,
    };
    //Bind the handlers to this class
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }
  //Call the Will Mount to set the auth Flag to false
  componentWillMount() {
    this.setState({
      authFlag: false,
    });
  }
  //username change handler to update state variable with the text entered by the user
  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  //password change handler to update state variable with the text entered by the user
  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  //submit Login handler to send a request to the node backend
  submitLogin = (e) => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post("http://localhost:3001/login", data).then((response) => {
      console.log("Status Code : ", response.status);
      if (response.status === 200 && response.data === "Successful Login") {
        localStorage.setItem("email", this.state.email);
        this.setState({
          authFlag: true,
        });
        let url = "/";
        window.location.href = url;
      } else {
        this.setState({
          authFlag: false,
          message: response.data,
        });
      }
    });
  };

  render() {
    //redirect based on successful login
    let redirectVar = null;
    if (cookie.load("cookie")) {
      redirectVar = <Navigate to="/" />;
    }
    return (
      <div>
        {redirectVar}
        <div class="container">
          <div class="login-form">
            <div class="main-div">
              <div class="panel">
                <h2>Login</h2>
                <p>Please enter your username and password</p>
              </div>

              <div class="form-group" style={{ width: "40%" }}>
                <input
                  onChange={this.emailChangeHandler}
                  type="email"
                  class="form-control"
                  name="email"
                  placeholder="Email Address"
                />
              </div>
              <br></br>
              <div class="form-group" style={{ width: "40%" }}>
                <input
                  onChange={this.passwordChangeHandler}
                  type="password"
                  class="form-control"
                  name="password"
                  placeholder="Password"
                />
              </div>
              <br></br>
              <button onClick={this.submitLogin} class="btn btn-primary">
                Login
              </button>
              <div class={this.state.message ? "visible" : "invisible"}>
                <div class="alert alert-danger">{this.state.message}</div>
              </div>
              <div className="mb-3">
                New customer? <Link to={`/signup`}>Create your account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
//export Login Component
export default LoginPage;
