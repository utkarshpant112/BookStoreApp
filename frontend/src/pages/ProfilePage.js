import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Navigate } from "react-router";
import CountrySelector from "../Utilities/CountrySelector";

//Define a Login Component
class ProfilePage extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      username: "",
      authFlag: false,
      message: undefined,
    };
    //Bind the handlers to this class
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.submitSignUp = this.submitSignUp.bind(this);
  }
  //Call the Will Mount to set the auth Flag to false
  componentWillMount() {
    this.setState({
      authFlag: false,
    });
  }
  //username change handler to update state variable with the text entered by the user
  usernameChangeHandler = (e) => {
    this.setState({
      username: e.target.value,
    });
  };
  //submit Login handler to send a request to the node backend
  submitSignUp = (e) => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    const data = {
      username: this.state.username,
      password: this.state.password,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post("http://localhost:3001/login", data).then((response) => {
      console.log("Status Code : ", response.status);
      if (response.status === 200 && response.data === "Successful Login") {
        this.setState({
          authFlag: true,
        });
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
          <div class="profile-form">
            <div class="main-div">
              <div class="panel">
                <h2>Your Public Profile</h2>
                <p>Everything on this page can be seen by anyone</p>
              </div>

              <div class="form-group">
                <input
                  onChange={this.usernameChangeHandler}
                  type="text"
                  class="form-control"
                  name="name"
                  placeholder="Name"
                />
              </div>
              <div class="form-group">
                <input
                  onChange={this.usernameChangeHandler}
                  type="date"
                  class="form-control"
                  name="dateofbirth"
                />
              </div>
              <div class="form-group">
                <input
                  onChange={this.usernameChangeHandler}
                  type="text"
                  class="form-control"
                  name="city"
                  placeholder="City"
                />
              </div>
              <div class="form-group">
                <input
                  onChange={this.usernameChangeHandler}
                  type="email"
                  class="form-control"
                  name="email"
                  placeholder="Email"
                />
              </div>
              <div class="form-group">
                <input
                  onChange={this.usernameChangeHandler}
                  type="phone"
                  class="form-control"
                  name="phone"
                  placeholder="Phone No"
                />
              </div>
              <div class="form-group">
                <input
                  onChange={this.usernameChangeHandler}
                  type="text"
                  class="form-control"
                  name="address"
                  placeholder="Full Address"
                />
              </div>
              <div class="form-group">
                <CountrySelector></CountrySelector>
              </div>
              <button onClick={this.submitSignUp} class="btn btn-primary">
                Login
              </button>
              <div class={this.state.message ? "visible" : "invisible"}>
                <div class="alert alert-danger">{this.state.message}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
//export Login Component
export default ProfilePage;
