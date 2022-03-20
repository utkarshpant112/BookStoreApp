import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Product from "../components/Product";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

//Define Shop Page Component
const FavoritesPage = () => {
  var { shopname } = useParams();

  const [image, setImage] = useState(undefined);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredproducts, setfilteredProducts] = useState([]);
  const favoriteProductsUpdated = useSelector(
    (state) => state.favoritesupdated
  );

  const handleChange = (e) => {
    let currentList = [];
    let newList = [];
    if (e.target.value !== "") {
      currentList = products;
      newList = currentList.filter((product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
    } else {
      newList = products;
    }
    setfilteredProducts(newList);
  };

  const [mounted, setMounted] = useState(false);

  // Function to update state
  const handleUpdate = (text) => {
    setRefresh(text);
  };

  useEffect(() => {
    let useremail = localStorage.getItem("email");
    axios.get("/userprofile/" + useremail).then((response) => {
      setUser(response.data[0]);
    });
    axios.get("/getfavoriteproducts/" + useremail).then((response) => {
      setProducts(response.data);
      setfilteredProducts(response.data);
    });
    setMounted(true);
  }, [favoriteProductsUpdated]);

  return !products ? null : (
    <>
      <div>
        <div></div>
        <div>
          <Row>
            <Col md={3}>
              <div style={{ width: "97%", height: "35%" }}>
                <Card>
                  <img
                    src={
                      user.pic
                        ? user.pic
                        : "https://firebasestorage.googleapis.com/v0/b/etsy-lab1.appspot.com/o/blank-profile-picture-973460_1280.png?alt=media&token=7127f000-8f23-447d-8587-e7a803ee957e"
                    }
                    className="card-img-top"
                    alt="description of image"
                  />
                </Card>
              </div>
            </Col>
            <Col md={3}>
              <h3>{user.name}</h3>
              <Link to="/profile" className="nav-link">
                Edit Your Profile
              </Link>
            </Col>
          </Row>
        </div>
        <br></br>
        <Row>
          <h2>Favorite Items</h2>
        </Row>
        <Row>
          <div className="pa2">
            <input
              style={{ width: "50%" }}
              className="pa3 bb br3 grow b--none bg-lightest-blue ma3"
              type="search"
              placeholder="Search Your favorite items"
              onChange={handleChange}
            />
          </div>
        </Row>
        <br></br>
        <div className="products">
          <Row>
            {filteredproducts.map((product) => (
              <Col key={product.id} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </>
  );
};

export default FavoritesPage;
