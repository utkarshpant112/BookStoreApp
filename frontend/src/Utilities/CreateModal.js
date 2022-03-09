import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { storage_bucket } from "../Utilities/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router";

export default function CreateModal(props) {
  const { shopname } = props;
  const [isOpen, setIsOpen] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [name, setName] = useState("");
  const [image, setImage] = useState(undefined);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [message, setMessage] = useState("");

  //name change handler to update state variable with the text entered by the user
  const nameChangeHandler = (e) => {
    setName(e.target.value);
  };

  //name change handler to update state variable with the text entered by the user
  const imageChangeHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0] == null) return;
      console.log(e.target.files[0]);
      const storage = getStorage();
      const storageRef = ref(storage_bucket, e.target.files[0].name);
      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, e.target.files[0])
        .then((snapshot) => {
          return getDownloadURL(snapshot.ref);
        })
        .then((downloadURL) => {
          console.log("Download URL", downloadURL);
          setImage(downloadURL);
        });
    }
  };
  //name change handler to update state variable with the text entered by the user
  const categoryChangeHandler = (e) => {
    setCategory(e.target.value);
  };
  //name change handler to update state variable with the text entered by the user
  const priceChangeHandler = (e) => {
    setPrice(e.target.value);
  };
  //name change handler to update state variable with the text entered by the user
  const descriptionChangeHandler = (e) => {
    setDescription(e.target.value);
  };

  //name change handler to update state variable with the text entered by the user
  const countInStockChangeHandler = (e) => {
    setCountInStock(e.target.value);
  };

  const addProduct = (e) => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    const data = {
      name: name,
      price: price,
      image: image,
      category: category,
      description: description,
      instock: countInStock,
      shopname: shopname,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post("http://localhost:3001/addproduct", data).then((response) => {
      console.log("Status Code : ", response.status);
      if (response.status === 200 && response.data === "Product Added") {
        setMessage("Product has been added");
      } else {
        setMessage("Product not added");
      }
    });
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Product
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ width: "54%", height: "35%" }}>
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
              <h6>Product Image</h6>
              <input type="file" name="myImage" onChange={imageChangeHandler} />
            </Card>
          </div>
          <br></br>
          <div class="form-group" style={{ width: "100%" }}>
            <input
              onChange={nameChangeHandler}
              type="text"
              class="form-control"
              name="name"
              value={name}
              placeholder="Name of product"
            />
          </div>
          <br></br>
          <div class="form-group" style={{ width: "100%" }}>
            <input
              onChange={priceChangeHandler}
              type="text"
              class="form-control"
              name="price"
              value={price}
              placeholder="Price of product"
            />
          </div>
          <br></br>
          <div class="form-group" style={{ width: "100%" }}>
            <input
              onChange={descriptionChangeHandler}
              type="text"
              class="form-control"
              name="description"
              value={description}
              placeholder="Description of product"
            />
          </div>
          <br></br>
          <div class="form-group" style={{ width: "100%" }}>
            <input
              onChange={categoryChangeHandler}
              type="text"
              class="form-control"
              name="category"
              value={category}
              placeholder="Category of product"
            />
          </div>
          <br></br>
          <div class="form-group" style={{ width: "100%" }}>
            <input
              onChange={countInStockChangeHandler}
              type="text"
              class="form-control"
              name="countInStock"
              value={countInStock}
              placeholder="Count of InStock product"
            />
          </div>
          <br></br>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={addProduct}>
            Add Product
          </Button>
          <br></br>
          <div class={message ? "visible" : "invisible"}>
            <div class="alert alert-primary">{message}</div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
