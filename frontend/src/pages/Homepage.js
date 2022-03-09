import { Component, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import { useSelector } from "react-redux";
import Store from "../Store";

import { connect } from "react-redux";

function HomePage(props) {
  const [products, setproducts] = useState([]);
  const [mounted, setMounted] = useState(false);
  const userInfo = useSelector((state) => state.userInfo);

  useEffect(() => {
    console.log(userInfo);
    axios.get("http://localhost:3001/api/products").then((response) => {
      //update the state with the response data
      setproducts(products.concat(response.data));
    });
    setMounted(true);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Etsy</title>
      </Helmet>
      {userInfo === "" ? (
        <h1>Welcome back</h1>
      ) : (
        <h1>Find something you love</h1>
      )}
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
  );
}

export default HomePage;
