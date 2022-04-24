import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { favoritesupdated } from "../actions/favoritesaction";

export default function FavoriteModal(props) {
  const [show, setShow] = useState(props.show);
  const handleShow = () => setShow(true);
  const userInfo = useSelector((state) => state.userInfo);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  //Closing the modal
  const handleClose = () => {
    dispatch(favoritesupdated(false));
    setMessage("");
    setShow(false);
  };

  //submit Login handler to send a request to the node backend
  const favoritebuttonclick = (e) => {
    if (userInfo === null) {
      setMessage("Please login first.");
    } else if (userInfo.shopname === props.shopname) {
      setMessage("You cannot add your own item to your favorites");
    } else {
      //prevent page from refresh
      e.preventDefault();
      console.log(props._id);
      console.log(userInfo._id);
      const data = {
        product_id: props._id,
        name: props.name,
        shopname: props.shopname,
        user_id: userInfo._id,
        email: userInfo.email,
      };
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      axios
        .post("/api/favorite/addtofavorites", data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            console.log("here");
            setMessage("Added to favorites");
          }
        })

        .catch((error) => {
          console.log(error.response.data);
          setMessage(error.response.data);
        });
    }
    dispatch(favoritesupdated(true));
    handleShow();
    setTimeout(() => {
      handleClose();
    }, 700);
  };

  return (
    <>
      <img
        src="/images/heart.jpg"
        class={props.class}
        onClick={favoritebuttonclick}
        style={{
          position: "sticky",
          height: "25px",
          width: "25px",
        }}
      />

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <div class={message ? "visible" : "invisible"}>
            <div class="alert alert-primary">{message}</div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
