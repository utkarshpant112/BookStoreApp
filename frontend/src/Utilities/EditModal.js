import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { storage_bucket } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { shopPageProductsUpdated } from "../actions/productactions";
import { useNavigate } from "react-router";

export default function EditModal(props) {
  const { shopname } = props;
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setMessage("");
    setName("");
    setPrice("");
    setImage("");
    setCategory("");
    setDescription("");
    setCountInStock("");
    navigate("/shoppage/" + shopname);
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [name, setName] = useState("");
  const [image, setImage] = useState(undefined);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [message, setMessage] = useState("");
  const [option, setOptions] = useState("");
  const [categoryoptions, setcategoryOptions] = useState("");
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(shopPageProductsUpdated(false));
    axios.get("http://localhost:3001/products/" + shopname).then((response) => {
      //update the state with the response data
      const abc = [];
      response.data.map((product) =>
        abc.push({ value: product.id, label: product.name })
      );
      setOptions(abc);
      setMounted(true);
    });
    axios.get("http://localhost:3001/categories").then((response) => {
      //update the state with the response data
      setcategoryOptions(response.data);
    });
  }, []);

  //name change handler to update state variable with the text entered by the user
  const nameChangeHandler = (e) => {
    setMessage("");
    setName(e.label);
    axios
      .get("http://localhost:3001/productdetails/" + e.label)
      .then((response) => {
        //update the state with the response data
        setImage(response.data.image);
        setCategory(response.data.category);
        setDescription(response.data.description);
        setPrice(response.data.price);
        setCountInStock(response.data.instock);
      });
  };

  //name image handler to update state variable with the image entered by the user
  const imageChangeHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0] == null) return;
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
  //category change handler to update state variable with the text entered by the user
  const categoryChangeHandler = (e) => {
    setCategory(e.label);
    setMessage("");
  };
  //price change handler to update state variable with the text entered by the user
  const priceChangeHandler = (e) => {
    setPrice(e.target.value);
    setMessage("");
  };
  //description change handler to update state variable with the text entered by the user
  const descriptionChangeHandler = (e) => {
    setDescription(e.target.value);
    setMessage("");
  };
  //countinstock change handler to update state variable with the text entered by the user
  const countInStockChangeHandler = (e) => {
    setCountInStock(e.target.value);
    setMessage("");
  };

  const updateProduct = (e) => {
    setMessage("");
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
    axios.post("http://localhost:3001/updateproduct", data).then((response) => {
      console.log("Status Code : ", response.status);
      if (response.status === 200 && response.data === "Product Updated") {
        setMessage("Product has been updated");
        dispatch(shopPageProductsUpdated(true));
      } else {
        setMessage("Product not update");
      }
    });
  };

  return !props.products ? null : (
    <>
      <Button variant="primary" onClick={handleShow}>
        Edit Product
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ width: "59%", height: "35%" }}>
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
            <Select
              value={name}
              options={option}
              placeholder={name}
              onChange={nameChangeHandler}
            ></Select>
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
            <Select
              value={category}
              options={categoryoptions}
              placeholder={category}
              onChange={categoryChangeHandler}
            ></Select>
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
          <Button variant="primary" onClick={updateProduct}>
            Update Product
          </Button>
        </Modal.Footer>
        <div class={message ? "visible" : "invisible"}>
          <div class="alert alert-primary">{message}</div>
        </div>
      </Modal>
    </>
  );
}
