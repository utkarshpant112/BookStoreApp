import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Navigate } from "react-router";
import Button from "react-bootstrap/Button";

//Define a Create Shop Component
class CreateShopPage extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);

    this.state = {
      shopname: "",
      shopcreated: undefined,
      message: undefined,
    };
    //Bind the handlers to this class
    this.shopnameChangeHandler = this.shopnameChangeHandler.bind(this);
    this.shopnameAvailable = this.shopnameAvailable.bind(this);
    this.createShop = this.createShop.bind(this);
  }

  //shop name change handler to update state variable with the text entered by the user
  shopnameChangeHandler = (e) => {
    this.setState({
      shopname: e.target.value,
      message: "",
    });
  };

  componentWillMount() {
    const data = {
      email: localStorage.getItem("email"),
    };
    if (localStorage.getItem("email") != null) {
      axios.post("/isshopalreadycreated", data).then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.setState({
            shopcreated: true,
            shopname: response.data,
          });
        }
      });
    }
  }

  shopnameAvailable = (e) => {
    if (
      this.state.shopname === "" ||
      this.state.shopname === "null" ||
      this.state.shopname === null
    ) {
      this.setState({
        message: "Shop name cannnot be empty",
      });
    } else {
      //prevent page from refresh
      e.preventDefault();
      const data = {
        shopname: this.state.shopname,
      };
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios
        .post("/shopNameAvailable", data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            this.setState({
              message: response.data,
            });
          }
        })
        .catch((error) => {
          console.log(error.response.data);
          this.setState({
            message: error.response.data,
          });
        });
    }
  };

  //submit Shop Name to send a request to the node backend
  createShop = (e) => {
    //prevent page from refresh
    e.preventDefault();
    const data = {
      shopname: this.state.shopname,
      email: localStorage.getItem("email"),
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;

    axios
      .post("/createshop", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.setState({
            message: response.data,
            shopcreated: true,
          });
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        this.setState({
          message: error.response.data,
        });
      });
  };

  render() {
    //redirect based on successful login
    let redirectVar = null;
    if (!cookie.load("cookie")) {
      redirectVar = <Navigate to="/" />;
    }
    if (this.state.shopcreated) {
      redirectVar = <Navigate to={"/shoppage/" + this.state.shopname} />;
    }
    return (
      <div>
        {redirectVar}
        <div class="container">
          <div class="profile-form">
            <div class="main-div">
              <div class="panel">
                <h2>Name Your shop</h2>
                <p>Choose a memorable name that suits your style</p>
                <div class="form-inline my-2 my-lg-0">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      onChange={this.shopnameChangeHandler}
                      placeholder="Shop Name"
                    />
                    <Button
                      type="button"
                      variant="success"
                      onClick={this.shopnameAvailable}
                    >
                      Check Availability
                    </Button>
                  </div>
                </div>
                <br></br>
                <div class={this.state.message ? "visible" : "invisible"}>
                  <div class="alert alert-primary">{this.state.message}</div>
                </div>
                <div
                  class={
                    this.state.message === "Shop name is available."
                      ? "visible"
                      : "invisible"
                  }
                >
                  <Button
                    type="button"
                    variant="outline-primary"
                    onClick={this.createShop}
                  >
                    Create Shop
                  </Button>
                  <p>
                    Your shop name will appear in your shop and next to each of
                    your listing throughout Etsy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
//export CreateShop Component
export default CreateShopPage;
