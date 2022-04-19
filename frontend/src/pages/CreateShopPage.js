import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";

//Define a Create Shop Component
function CreateShopPage(props) {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const userInfo = useSelector((state) => state.userInfo);
  const [shopname, setShopname] = useState("");
  const [shopcreated, setShopcreated] = useState(false);
  const [message, setMessage] = useState(undefined);

  //shop name change handler to update state variable with the text entered by the user
  const shopnameChangeHandler = (e) => {
    setShopname(e.target.value);
    setMessage("");
  };

  useEffect(() => {
    const data = {
      email: userInfo.email,
    };
    if (userInfo != null) {
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      axios
        .post("/api/shop/isshopalreadycreated", data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            setShopcreated(true);
            setShopname(response.data);
          }
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  }, []);

  const shopnameAvailable = (e) => {
    if (shopname === "" || shopname === "null" || shopname === null) {
      setMessage("Shop name cannnot be empty");
    } else {
      //prevent page from refresh
      e.preventDefault();
      const data = {
        shopname: shopname,
      };
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      axios
        .post("/api/shop/shopNameAvailable", data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            setMessage(response.data);
          }
        })
        .catch((error) => {
          console.log(error.response.data);
          setMessage(error.response.data);
        });
    }
  };

  //submit Shop Name to send a request to the node backend
  const createShop = (e) => {
    //prevent page from refresh
    e.preventDefault();
    const data = {
      shopname: shopname,
      email: userInfo.email,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    axios
      .post("/api/shop/createshop", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          setMessage(response.data);
          setShopcreated(true);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        setMessage(error.response.data);
      });
  };

  return !isLoggedIn ? (
    <Navigate to="/" />
  ) : shopcreated ? (
    <Navigate to={"/shoppage/" + shopname} />
  ) : (
    <div>
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
                    onChange={shopnameChangeHandler}
                    placeholder="Shop Name"
                  />
                  <Button
                    type="button"
                    variant="success"
                    onClick={shopnameAvailable}
                  >
                    Check Availability
                  </Button>
                </div>
              </div>
              <br></br>
              <div class={message ? "visible" : "invisible"}>
                <div class="alert alert-primary">{message}</div>
              </div>
              <div
                class={
                  message === "Shop name is available."
                    ? "visible"
                    : "invisible"
                }
              >
                <Button
                  type="button"
                  variant="outline-primary"
                  onClick={createShop}
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
//export CreateShop Component
export default CreateShopPage;
