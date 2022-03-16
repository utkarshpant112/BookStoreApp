import React, { Component } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Navigate } from "react-router";
import Select from "react-select";
import Card from "react-bootstrap/Card";
import countryList from "react-select-country-list";
import { storage_bucket } from "../Utilities/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

//Define a Profile Page Component
class ProfilePage extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);

    this.state = {
      name: "",
      dob: "",
      city: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      about: "",
      image: "",
      message: undefined,
      options: countryList().getData(),
    };
    //Bind the handlers to this class
    this.nameChangeHandler = this.nameChangeHandler.bind(this);
    this.dobChangeHandler = this.dobChangeHandler.bind(this);
    this.cityChangeHandler = this.cityChangeHandler.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
    this.addressChangeHandler = this.addressChangeHandler.bind(this);
    this.countryChangeHandler = this.countryChangeHandler.bind(this);
    this.aboutChangeHandler = this.aboutChangeHandler.bind(this);
    this.aboutChangeHandler = this.aboutChangeHandler.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.submitProfile = this.submitProfile.bind(this);
  }

  componentDidMount() {
    let useremail = localStorage.getItem("email");
    axios
      .get("http://localhost:3001/userprofile/" + useremail)
      .then((response) => {
        //update the state with the response data
        this.setState({
          name: response.data.name,
          dob: response.data.dob,
          city: response.data.city,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
          country: response.data.country,
          about: response.data.about,
          image: response.data.pic,
        });
      });
  }

  //name change handler to update state variable with the text entered by the user
  nameChangeHandler = (e) => {
    this.setState({
      name: e.target.value,
    });
  };
  //dob change handler to update state variable with the text entered by the user
  dobChangeHandler = (e) => {
    this.setState({
      dob: e.target.value,
    });
  };
  //city change handler to update state variable with the text entered by the user
  cityChangeHandler = (e) => {
    this.setState({
      city: e.target.value,
    });
  };
  //email change handler to update state variable with the text entered by the user
  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  //phone change handler to update state variable with the text entered by the user
  phoneChangeHandler = (e) => {
    this.setState({
      phone: e.target.value,
    });
  };
  //address change handler to update state variable with the text entered by the user
  addressChangeHandler = (e) => {
    this.setState({
      address: e.target.value,
    });
  };
  //country change handler to update state variable with the text entered by the user
  countryChangeHandler = (e) => {
    this.setState({
      country: e.label,
    });
  };
  //about change handler to update state variable with the text entered by the user
  aboutChangeHandler = (e) => {
    this.setState({
      about: e.target.value,
    });
  };
  //image change handler to update state variable with the text entered by the user
  onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0] == null) return;
      const storageRef = ref(storage_bucket, event.target.files[0].name);
      uploadBytes(storageRef, event.target.files[0])
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("Download URL", downloadURL);
          this.setState({
            image: downloadURL,
          });
        });
    }
  };

  //submit Login handler to send a request to the node backend
  submitProfile = (e) => {
    //prevent page from refresh
    e.preventDefault();
    const data = {
      name: this.state.name,
      dob: this.state.dob,
      city: this.state.city,
      phone: this.state.phone,
      currentemail: localStorage.getItem("email"),
      email: this.state.email,
      address: this.state.address,
      country: this.state.country,
      about: this.state.about,
      image: this.state.image,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios
      .post("http://localhost:3001/updateprofile", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          localStorage.setItem("email", this.state.email);
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
  };

  render() {
    //redirect based on successful login
    let redirectVar = null;
    if (!cookie.load("cookie")) {
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
              <div style={{ width: "25.45%" }}>
                <Card>
                  <img
                    src={
                      this.state.image
                        ? this.state.image
                        : "https://firebasestorage.googleapis.com/v0/b/etsy-lab1.appspot.com/o/blank-profile-picture-973460_1280.png?alt=media&token=7127f000-8f23-447d-8587-e7a803ee957e"
                    }
                    className="card-img-top"
                    alt="description of image"
                  />
                  <h6>Profile Image</h6>
                  <input
                    type="file"
                    name="myImage"
                    onChange={this.onImageChange}
                  />
                </Card>
              </div>
              <div></div>
              <br></br>
              <div class="form-group" style={{ width: "40%" }}>
                <input
                  onChange={this.nameChangeHandler}
                  type="text"
                  class="form-control"
                  name="name"
                  value={this.state.name}
                  placeholder="Name"
                />
              </div>
              <br></br>
              <div class="form-group" style={{ width: "40%" }}>
                <input
                  onChange={this.dobChangeHandler}
                  type="date"
                  class="form-control"
                  name="dateofbirth"
                  value={this.state.dob}
                />
              </div>
              <br></br>
              <div class="form-group" style={{ width: "40%" }}>
                <input
                  onChange={this.emailChangeHandler}
                  type="email"
                  class="form-control"
                  name="email"
                  value={this.state.email}
                  placeholder="Email"
                />
              </div>
              <br></br>
              <div class="form-group" style={{ width: "40%" }}>
                <input
                  onChange={this.phoneChangeHandler}
                  type="phone"
                  class="form-control"
                  name="phone"
                  value={this.state.phone}
                  placeholder="Phone No"
                />
              </div>
              <br></br>
              <div class="form-group" style={{ width: "40%" }}>
                <input
                  onChange={this.addressChangeHandler}
                  type="text"
                  class="form-control"
                  name="address"
                  value={this.state.address}
                  placeholder="Full Address"
                />
              </div>
              <br></br>
              <div class="form-group" style={{ width: "40%" }}>
                <input
                  onChange={this.cityChangeHandler}
                  type="text"
                  class="form-control"
                  value={this.state.city}
                  name="city"
                  placeholder="City"
                />
              </div>
              <br></br>
              <div class="form-group" style={{ width: "40%" }}>
                <Select
                  onChange={this.countryChangeHandler}
                  options={this.state.options}
                  value={this.state.country}
                  placeholder={this.state.country}
                />
              </div>
              <br></br>
              <div class="form-group" style={{ width: "40%", height: "300%" }}>
                <input
                  onChange={this.aboutChangeHandler}
                  type="text"
                  class="form-control"
                  value={this.state.about}
                  name="about"
                  placeholder="About yourself"
                />
              </div>
              <br></br>
              <div>
                <button onClick={this.submitProfile} class="btn btn-primary">
                  Update Profile
                </button>
              </div>
              <br></br>
              <div class={this.state.message ? "visible" : "invisible"}>
                <div class="alert alert-primary">{this.state.message}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//export ProfilePage Component
export default ProfilePage;
