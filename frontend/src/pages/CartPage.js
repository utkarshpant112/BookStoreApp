import { Component, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function CartPage(props) {
  const navigate = useNavigate();
  const [cartItems, setcartitems] = useState([]);
  const [message, setmessage] = useState("");
  const currency = useSelector((state) => state.currency.currency);
  const userInfo = useSelector((state) => state.userInfo);

  useEffect(() => {
    if (localStorage.getItem("cartItems") != null) {
      setcartitems(
        cartItems.concat(JSON.parse(localStorage.getItem("cartItems")))
      );
    }
  }, []);

  const checkoutHandler = (e) => {
    if (
      userInfo[0].country === "" ||
      userInfo[0].city === "" ||
      userInfo[0].address === ""
    ) {
      setmessage("Please update your full address in your profile.");
      return;
    }
    //prevent page from refresh
    console.log(cartItems);
    e.preventDefault();
    cartItems.map((item) => {
      console.log(item.image);
      const data = {
        name: item.name,
        price: item.price * item.quantity,
        image: item.image,
        shopname: item.shopname,
        currency: currency,
        quantity: item.quantity,
        date: new Date().toLocaleDateString(),
        email: localStorage.getItem("email"),
      };

      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.post("http://localhost:3001/createorder", data).then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200 && response.data === "order Created") {
          setmessage("Order Created");
          localStorage.removeItem("cartItems");
        } else {
          setmessage(response.data);
          localStorage.removeItem("cartItems");
        }
      });
    });
    localStorage.removeItem("cartItems");
    navigate("/mypurchases");
  };

  return cartItems.length === 0 ? (
    <Alert variant="success">
      <Alert.Heading>Cart is empty.</Alert.Heading>
      <Link to="/">Go Shopping</Link>
    </Alert>
  ) : (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          <ListGroup>
            <ListGroupItem>
              <Row>
                <Col md={6}>
                  <h5>Item</h5>
                </Col>
                <Col md={2}>
                  <h5>Quantity</h5>
                </Col>
                <Col md={2}>
                  <h5>Price</h5>
                </Col>
                <Col md={2}>
                  <h5>Total Price</h5>
                </Col>
              </Row>
            </ListGroupItem>

            {cartItems.map((item) => (
              <ListGroup.Item key={item.id}>
                <Row className="align-items-center">
                  <Col md={6}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-fluid rounded img-thumbnail"
                      style={{ width: "70px", height: "70px" }}
                    ></img>{" "}
                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>
                    <span>{item.quantity}</span>{" "}
                  </Col>
                  <Col md={2}>
                    {currency} {item.price}
                  </Col>
                  <Col md={2}>
                    {currency}{" "}
                    {parseFloat(item.price * item.quantity).toFixed(2)}
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body class="cartpage-card-body">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal (
                    {cartItems.reduce(
                      (a, c) => parseInt(a) + parseInt(c.quantity),
                      0
                    )}{" "}
                    items) : {currency}
                    {parseFloat(
                      cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
                    ).toFixed(2)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Buy Now
                    </Button>
                  </div>
                  <br></br>
                  <div class={message ? "visible" : "invisible"}>
                    <div class="alert alert-primary">{message}</div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CartPage;
