import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Component, useContext, useEffect, useReducer, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";

import cookie from "react-cookies";
import { Navigate } from "react-router";
import { Link } from "react-router-dom";

function ProductPage(props) {
  const { id } = useParams();
  const [product, setProduct] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log(id);
    axios
      .get("http://localhost:3001/api/products/id/" + id)
      .then((response) => {
        //update the state with the response data
        setProduct(response.data);
        setMounted(true);
      });
  }, []);

  const addToCartHandler = async () => {
    if (localStorage.getItem("cartItems") != null) {
      var cartItems = JSON.parse(localStorage.getItem("cartItems"));
      const existItem = cartItems.find((x) => x.id === product.id);
      console.log(existItem);
      const quantity = existItem ? existItem.quantity + 1 : 1;
      if (product.instock < quantity) {
        window.alert("Sorry. Product is out of stock");
        return;
      }
      if (existItem === undefined) {
        cartItems[cartItems.length] = {
          id: product.id,
          quantity: 1,
          ...product,
        };
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        return;
      }
      const index = cartItems
        ? cartItems.findIndex((item) => item.id === product.id)
        : 0;
      cartItems[index] = {
        id: product.id,
        quantity: quantity,
        ...product,
      };
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      var cartItems = [
        {
          id: product.id,
          quantity: 1,
          ...product,
        },
      ];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  };

  const checkoutHandler = () => {
    let url = "/cart";
    window.location.href = url;
  };

  return (
    <div>
      <Row>
        <Col md={8}>
          <img
            className="img-large"
            src={product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
            <Card>
              <Card.Body>
                <ListGroup.Item>
                  <Row>
                    <Col>Seller:</Col>
                    <Col>
                      <Link to={`/shoppage/${product.shopname}`}>
                        <Card.Title>{product.shopname}</Card.Title>
                      </Link>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>${product.price}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.instock > 0 ? (
                          <Badge bg="success">In Stock</Badge>
                        ) : (
                          <Badge bg="danger">Unavailable</Badge>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.instock > 0 && (
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button onClick={addToCartHandler} variant="primary">
                          Add to Cart
                        </Button>
                        <br></br>
                        <Button onClick={checkoutHandler} variant="primary">
                          Proceed to Checkout
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
}

export default ProductPage;
