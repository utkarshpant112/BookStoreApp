import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import CreateModal from "../Utilities/CreateModal";
import EditModal from "../Utilities/EditModal";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Product from "../components/Product";
import { storage_bucket } from "../Utilities/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSelector } from "react-redux";

//Define Shop Page Component
const ShopPage = (props) => {
  var { shopname } = useParams();

  const [image, setImage] = useState(undefined);
  const [owner, setOwner] = useState("");
  const [message, setMessage] = useState("");
  const [salescount, setsalescount] = useState("");
  const [products, setProducts] = useState([]);
  const shopPageProductsUpdated = useSelector(
    (state) => state.shopPageProductsUpdated
  );

  // const [mounted, setMounted] = useState(false);

  // // useEffect(() => {
  // //   setMounted(true);
  // //   setMounted(false);
  // // }, [shopPageProductsUpdated]);

  useEffect(() => {
    console.log(shopname);
    axios.get("/api/user/ownerdetails/" + shopname).then((response) => {
      //update the state with the response data
      setOwner(response.data);
      if (response.data.email === localStorage.getItem("email")) {
        setMessage("Shop owner viewing");
      }
    });
    axios.get("/api/shop/shopimage/" + shopname).then((response) => {
      setImage(response.data.shopimage);
    });
    axios.get("/api/products/" + shopname).then((response) => {
      setProducts(response.data);
    });
    axios.get("/api/shop/shopsalestotal/" + shopname).then((response) => {
      setsalescount(response.data[0].totalsales);
    });
  }, [shopPageProductsUpdated]);

  //image change handler to update state variable with the text entered by the user
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
          //prevent page from refresh
          e.preventDefault();
          const data = {
            shopImage: downloadURL,
          };
          //set the with credentials to true
          axios.defaults.withCredentials = true;
          //make a post request with the user data
          axios.post("/api/shop/addshopimage", data).then((response) => {
            console.log("Status Code : ", response.status);
          });
        });
    }
  };

  return !products ? null : (
    <>
      <div>
        <div>
          <h2>{shopname}</h2>
        </div>
        <div>
          <Row>
            <Col md={3}>
              <div style={{ width: "106.5%", height: "35%" }}>
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
                  <div
                    class={
                      message === "Shop owner viewing" ? "visible" : "invisible"
                    }
                  >
                    <input
                      type="file"
                      name="myImage"
                      onChange={imageChangeHandler}
                    />
                  </div>
                </Card>
              </div>
            </Col>
            <Col md={3}>
              <h3>Owner details</h3>
              <h6>{owner.name}</h6>
              <h6>{owner.email}</h6>
              <h6>{owner.phone}</h6>
              <div
                class={
                  message === "Shop owner viewing" ? "visible" : "invisible"
                }
              >
                <h6>Items Sold: {salescount ? salescount : 0}</h6>
              </div>
              <br></br>
              <br></br>
              <br></br>
              <div
                class={
                  message === "Shop owner viewing" ? "visible" : "invisible"
                }
              >
                <Row>
                  <Col md={6}>
                    <CreateModal shopname={shopname}></CreateModal>
                  </Col>
                  <Col md={6}>
                    <EditModal
                      shopname={shopname}
                      products={products}
                    ></EditModal>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
        <br></br>
        <br></br>
        <h3>Products</h3>
        <div>
          <div className="products">
            <Row>
              {products.map((product) => (
                <Col key={product.id} sm={6} md={4} lg={3} className="mb-3">
                  <Product product={product}></Product>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopPage;
