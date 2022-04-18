import { Component, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function CartPage(props) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [text, setText] = useState("");
  const [cartItems, setcartitems] = useState([]);
  const [message, setmessage] = useState("");
  const currency = useSelector((state) => state.currency.currency);
  const userInfo = useSelector((state) => state.userInfo);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  useEffect(() => {
    if (localStorage.getItem("cartItems") != null) {
      setcartitems(
        cartItems.concat(JSON.parse(localStorage.getItem("cartItems")))
      );
    }
  }, []);

  useEffect(() => {}, [cartItems]);

  const reducequantity = async (_id) => {
    setmessage("");
    axios.get("/api/products/id/" + _id).then((response) => {
      //update the state with the response data
      if (!isLoggedIn) {
        setmessage("You must be logged in to add items to cart.");
      } else if (localStorage.getItem("cartItems") != null) {
        var cartItems = JSON.parse(localStorage.getItem("cartItems"));
        const existItem = cartItems.find((x) => x._id === response.data._id);
        const quantity = parseInt(existItem.quantity) - 1;
        console.log(quantity);
        const index = cartItems
          ? cartItems.findIndex((item) => item._id === response.data._id)
          : 0;
        if (quantity > 0) {
          cartItems[index] = {
            quantity: quantity,
            ...response.data,
          };
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
          if (localStorage.getItem("cartItems") != null) {
            setcartitems(JSON.parse(localStorage.getItem("cartItems")));
          }
        } else {
          var newArray = JSON.parse(localStorage.getItem("cartItems")).filter(
            function (element) {
              return element._id !== response.data._id;
            }
          );
          localStorage.setItem("cartItems", JSON.stringify(newArray));
          if (localStorage.getItem("cartItems") === "") {
            localStorage.removeItem("cartItems");
          }
          if (localStorage.getItem("cartItems") != null) {
            setcartitems(JSON.parse(localStorage.getItem("cartItems")));
          } else {
            setcartitems([]);
          }
        }
      }
    });
  };

  const addquantity = async (_id) => {
    setmessage("");
    axios.get("/api/products/id/" + _id).then((response) => {
      //update the state with the response data
      if (!isLoggedIn) {
        setmessage("You must be logged in to add items to cart.");
      } else if (localStorage.getItem("cartItems") != null) {
        var cartItems = JSON.parse(localStorage.getItem("cartItems"));
        const existItem = cartItems.find((x) => x._id === response.data._id);
        const quantity = parseInt(existItem.quantity) + 1;
        console.log(response.data.instock);
        const index = cartItems
          ? cartItems.findIndex((item) => item._id === response.data._id)
          : 0;
        if (quantity <= response.data.instock) {
          cartItems[index] = {
            quantity: quantity,
            ...response.data,
          };
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
          if (localStorage.getItem("cartItems") != null) {
            setcartitems(JSON.parse(localStorage.getItem("cartItems")));
          }
        } else {
          setmessage(
            "More quantity of " + response.data.name + " are not available."
          );
        }
      }
    });
  };

  const removeProduct = async (_id) => {
    setmessage("");
    axios.get("/api/products/id/" + _id).then((response) => {
      var newArray = JSON.parse(localStorage.getItem("cartItems")).filter(
        function (element) {
          return element._id !== response.data._id;
        }
      );
      localStorage.setItem("cartItems", JSON.stringify(newArray));
      if (localStorage.getItem("cartItems") === "") {
        localStorage.removeItem("cartItems");
      }
      if (localStorage.getItem("cartItems") != null) {
        setcartitems(JSON.parse(localStorage.getItem("cartItems")));
      } else {
        setcartitems([]);
      }
    });
  };

  const checkoutHandler = (e) => {
    if (
      userInfo.country === "" ||
      userInfo.city === "" ||
      userInfo.address === ""
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
        email: userInfo.email,
        isgiftwrapped: checked,
        description: text,
      };

      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios
        .post("/api/order/createorder", data)
        .then((response) => {
          console.log("Status Code : ", response.status);
          if (response.status === 200 && response.data === "order Created") {
            setmessage("Order Created");
            localStorage.removeItem("cartItems");
          } else {
            setmessage(response.data);
            localStorage.removeItem("cartItems");
          }
        })
        .then(navigate("/mypurchases"));
    });
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
                <Col md={5}>
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
                <Col md={1}></Col>
              </Row>
            </ListGroupItem>

            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row className="align-items-center">
                  <Col md={5}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-fluid rounded img-thumbnail"
                      style={{ width: "70px", height: "70px" }}
                    ></img>{" "}
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>
                    <Button
                      onClick={() => reducequantity(item._id)}
                      variant="outline-primary"
                    >
                      -
                    </Button>{" "}
                    <span>{item.quantity}</span>{" "}
                    <Button
                      onClick={() => addquantity(item._id)}
                      variant="outline-primary"
                    >
                      +
                    </Button>
                  </Col>
                  <Col md={2}>
                    {currency} {item.price}
                  </Col>
                  <Col md={2}>
                    {currency}{" "}
                    {parseFloat(item.price * item.quantity).toFixed(2)}
                  </Col>
                  <Col md={1}>
                    <Button
                      onClick={() => removeProduct(item._id)}
                      variant="outline-primary"
                    >
                      <img
                        src="/images/trash.png"
                        style={{
                          position: "sticky",
                          height: "25px",
                          width: "25px",
                        }}
                      />
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col md={9}>
                    <Row>
                      <Col md={5}>
                        <label>
                          Gift wrap your item{" "}
                          <input
                            name="checkbox"
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              if (checked) {
                                setText("");
                              }
                              setChecked(!checked);
                            }}
                          />
                        </label>
                      </Col>
                      <Col md={4}>
                        {" "}
                        <label>
                          <input
                            name="input"
                            type="text"
                            disabled={!checked}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                          />
                        </label>
                      </Col>
                    </Row>
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
                      variant="outline-primary"
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
