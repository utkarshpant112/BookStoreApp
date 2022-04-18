import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router";
import Select from "react-select";
import Card from "react-bootstrap/Card";
import countryList from "react-select-country-list";
import { storage_bucket } from "../Utilities/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo } from "../actions/userActions";
import validator from "validator";
import Button from "react-bootstrap/esm/Button";

//Define a Profile Page Component
function ProfilePage(props) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [options, setOptions] = useState(countryList().getData());
  const [dob, setDob] = useState("");
  const userInfo = useSelector((state) => state.userInfo);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    let useremail = userInfo.email;
    axios.get("/api/user/userprofile/" + useremail).then((response) => {
      setName(response.data.name);
      setDob(response.data.dob);
      setCity(response.data.city);
      setEmail(response.data.email);
      setPhone(response.data.phone);
      setAddress(response.data.address);
      setCountry(response.data.country);
      setAbout(response.data.about);
      setImage(response.data.pic);
      setPassword(response.data.password);
      setId(response.data.id);
    });
  }, []);

  //name change handler to update state variable with the text entered by the user
  const nameChangeHandler = (e) => {
    setName(e.target.value);
    setMessage("");
  };
  //dob change handler to update state variable with the text entered by the user
  const dobChangeHandler = (e) => {
    setDob(e.target.value);
    setMessage("");
  };
  //city change handler to update state variable with the text entered by the user
  const cityChangeHandler = (e) => {
    setCity(e.target.value);
    setMessage("");
  };
  //email change handler to update state variable with the text entered by the user
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
    setMessage("");
  };
  //phone change handler to update state variable with the text entered by the user
  const phoneChangeHandler = (e) => {
    setPhone(e.target.value);
    setMessage("");
  };
  //address change handler to update state variable with the text entered by the user
  const addressChangeHandler = (e) => {
    setAddress(e.target.value);
    setMessage("");
  };
  //country change handler to update state variable with the text entered by the user
  const countryChangeHandler = (e) => {
    setCountry(e.label);
    setMessage("");
  };
  //about change handler to update state variable with the text entered by the user
  const aboutChangeHandler = (e) => {
    setAbout(e.target.value);
    setMessage("");
  };
  //image change handler to update state variable with the text entered by the user
  const onImageChange = (event) => {
    setMessage("");
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0] == null) return;
      const storageRef = ref(storage_bucket, event.target.files[0].name);
      uploadBytes(storageRef, event.target.files[0])
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("Download URL", downloadURL);
          setImage(downloadURL);
        });
    }
  };

  //submit Login handler to send a request to the node backend
  const submitProfile = (e) => {
    if (!validator.isAlpha(name, "en-US", { ignore: " " })) {
      setMessage("Name must have letters only.");
    } else if (!validator.isAlpha(city, "en-US", { ignore: " " })) {
      setMessage("City must have letters only.");
    } else if (phone ? !validator.isMobilePhone(phone, "any") : false) {
      setMessage("Your mobile number is not valid.");
    } else if (!validator.isEmail(email)) {
      setMessage("Email entered is not valid.");
    } else {
      //prevent page from refresh
      e.preventDefault();
      const data = {
        id: id,
        name: name,
        dob: dob,
        city: city,
        phone: phone,
        currentemail: userInfo.email,
        email: email,
        address: address,
        country: country,
        about: about,
        image: image,
        password: password,
      };
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios
        .post("/api/user/updateprofile", data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            setMessage(response.data);
            axios
              .get("/api/user/userprofile/" + userInfo.email)
              .then((response) => {
                dispatch(updateUserInfo(response.data));
              });
          }
        })
        .catch((error) => {
          console.log(error.response.data);
          setMessage(error.response.data);
        });
    }
  };

  return !isLoggedIn ? (
    <Navigate to="/" />
  ) : (
    <div>
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
                    image
                      ? image
                      : "https://firebasestorage.googleapis.com/v0/b/etsy-lab1.appspot.com/o/blank-profile-picture-973460_1280.png?alt=media&token=7127f000-8f23-447d-8587-e7a803ee957e"
                  }
                  className="card-img-top"
                  alt="description of image"
                />
                <h6>Profile Image</h6>
                <input type="file" name="myImage" onChange={onImageChange} />
              </Card>
            </div>
            <div></div>
            <br></br>
            <div class="form-group" style={{ width: "40%" }}>
              <input
                onChange={nameChangeHandler}
                type="text"
                class="form-control"
                name="name"
                value={name}
                placeholder="Name"
              />
            </div>
            <br></br>
            <div class="form-group" style={{ width: "40%" }}>
              <input
                onChange={dobChangeHandler}
                type="date"
                class="form-control"
                name="dateofbirth"
                max={"2015-01-01"}
                value={dob}
              />
            </div>
            <br></br>
            <div class="form-group" style={{ width: "40%" }}>
              <input
                onChange={emailChangeHandler}
                type="email"
                class="form-control"
                name="email"
                value={email}
                placeholder="Email"
              />
            </div>
            <br></br>
            <div class="form-group" style={{ width: "40%" }}>
              <input
                onChange={phoneChangeHandler}
                type="phone"
                class="form-control"
                name="phone"
                value={phone}
                placeholder="Phone No"
              />
            </div>
            <br></br>
            <div class="form-group" style={{ width: "40%" }}>
              <input
                onChange={addressChangeHandler}
                type="text"
                class="form-control"
                name="address"
                value={address}
                placeholder="Full Address"
              />
            </div>
            <br></br>
            <div class="form-group" style={{ width: "40%" }}>
              <input
                onChange={cityChangeHandler}
                type="text"
                class="form-control"
                value={city}
                name="city"
                placeholder="City"
              />
            </div>
            <br></br>
            <div class="form-group" style={{ width: "40%" }}>
              <Select
                onChange={countryChangeHandler}
                options={options}
                value={country}
                placeholder={country}
              />
            </div>
            <br></br>
            <div class="form-group" style={{ width: "40%", height: "300%" }}>
              <input
                onChange={aboutChangeHandler}
                type="text"
                class="form-control"
                value={about}
                name="about"
                placeholder="About yourself"
              />
            </div>
            <br></br>
            <div>
              <Button onClick={submitProfile} class="outline-primary">
                {" "}
                Update Profile
              </Button>
            </div>
            <br></br>
            <div class={message ? "visible" : "invisible"}>
              <div class="alert alert-primary">{message}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
