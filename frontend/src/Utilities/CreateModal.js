import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { storage_bucket } from "../Utilities/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { shopPageProductsUpdated } from "../actions/productactions";
import { useNavigate } from "react-router";
import validator from "validator";
import { addProductMutation } from "../graphql/mutations";

export default function CreateModal(props) {
  const { shopname } = props;
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setName("");
    setPrice("");
    setImage("");
    setCategory("");
    setDescription("");
    setCountInStock("");
    setMessage("");
    navigate("/shoppage/" + shopname);
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [name, setName] = useState("");
  const [image, setImage] = useState(undefined);
  const [category, setCategory] = useState("Category of product");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [options, setOptions] = useState("");
  const [message, setMessage] = useState("");
  const [otherCategoryTexDisabled, setotherCategoryTextDisabled] =
    useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const qlQuery = async (query, variables = {}) => {
    const resp = await fetch("http://localhost:4001", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    return (await resp.json()).data;
  };

  //name change handler to update state variable with the text entered by the user
  const nameChangeHandler = (e) => {
    setName(e.target.value);
    setMessage("");
  };
  //category change handler to update state variable with the text entered by the user
  const categoryChangeHandler = (e) => {
    if (e.label === "Others") {
      setotherCategoryTextDisabled(true);
    }
    setCategory(e.label);

    setMessage("");
  };
  //category change handler to update state variable with the text entered by the user
  const othercategoryChangeHandler = (e) => {
    setCategory(e.target.value);
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
  //instock change handler to update state variable with the text entered by the user
  const countInStockChangeHandler = (e) => {
    setCountInStock(e.target.value);
    setMessage("");
  };
  //image change handler to update state variable with the text entered by the user
  const imageChangeHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0] == null) return;
      console.log(e.target.files[0]);
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

  useEffect(() => {
    dispatch(shopPageProductsUpdated(false));
    axios.get("/api/products/categories").then((response) => {
      //update the state with the response data
      setOptions(response.data);
    });
  }, []);

  const addProduct = async (e) => {
    if (!validator.isNumeric(price) || !validator.isDecimal(price)) {
      setMessage("Price can only have numbers");
    } else if (!validator.isAlpha(category, "en-US", { ignore: " " })) {
      setMessage("Category must have letters only.");
    } else if (!validator.isNumeric(countInStock)) {
      setMessage("Quantity can only be a number");
    } else {
      //prevent page from refresh
      e.preventDefault();
      const data = {
        name: name,
        price: parseFloat(price),
        image: image,
        category: category,
        description: description,
        instock: parseInt(countInStock),
        shopname: shopname,
      };
      //set the with credentials to true
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      console.log(addProductMutation);
      console.log(data);
      const addRes = await qlQuery(addProductMutation, data);
      console.log(addRes);
      if (addRes.addProduct.token === "Product Added") {
        setMessage("Product has been added");
        dispatch(shopPageProductsUpdated(true));
        setTimeout(() => {
          handleClose();
        }, 500);
      }
      //   axios
      //     .post("/api/products/addproduct", data)
      //     .then((response) => {
      //       console.log("Status Code : ", response.status);
      //
      //       } else {
      //         setMessage("Product not added");
      //       }
      //     })
      //     .catch((error) => {
      //       console.log(error.response.data);
      //       this.setState({
      //         message: error.response.data,
      //       });
      //     });
    }
  };

  return (
    <>
      <Button variant="success" onClick={handleShow}>
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
            <Select
              value={category}
              options={options}
              placeholder={category}
              onChange={categoryChangeHandler}
            ></Select>
          </div>
          <br></br>
          <div
            class={otherCategoryTexDisabled ? "visible" : "invisible"}
            style={{ width: "100%" }}
          >
            <input
              onChange={othercategoryChangeHandler}
              type="text"
              class="form-control"
              name="category"
              value={category}
              placeholder="Other Categories"
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
              placeholder="Quantity of product"
            />
          </div>
          <br></br>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={addProduct}>
              Add Product
            </Button>
          </div>
          <br></br>
        </Modal.Footer>
        <div class={message ? "visible" : "invisible"}>
          <div class="alert alert-primary">{message}</div>
        </div>
      </Modal>
    </>
  );
}
