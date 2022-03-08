import { Component, useContext } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MessageBox from "../components/MessageBox";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import axios from "axios";

class CartPage extends Component {
  constructor() {
    super();
    this.state = {
      cartItems: [],
    };
  }
  componentDidMount() {
    if (localStorage.getItem("cartItems") != null) {
      this.setState({
        cartItems: this.state.cartItems.concat(
          JSON.parse(localStorage.getItem("cartItems"))
        ),
      });
    }
  }

  checkoutHandler = (e) => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    this.state.cartItems.map((item) => {
      const data = {
        name: item.name,
        price: item.price * item.quantity,
        image: item.image,
        shopname: item.shopname,
        quantity: item.quantity,
        date: new Date().toLocaleDateString(),
        email: localStorage.getItem("email"),
      };

      axios.defaults.withCredentials = true;
      //make a post request with the user data
      axios.post("http://localhost:3001/createorder", data).then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200 && response.data === "order Created") {
          this.setState({
            authFlag: true,
            message: "Order Created",
          });
          localStorage.removeItem("cartItems");
        } else {
          this.setState({
            authFlag: false,
            message: response.data,
          });
          localStorage.removeItem("cartItems");
        }
      });
    });

    let url = "/mypurchases";
    window.location.href = url;
  };

  render() {
    return this.state.cartItems.length === 0 ? (
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

              {this.state.cartItems.map((item) => (
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
                    <Col md={2}>${item.price}</Col>
                    <Col md={2}>${item.price * item.quantity}</Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>
                      Subtotal (
                      {this.state.cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                      items) : $
                      {this.state.cartItems.reduce(
                        (a, c) => a + c.price * c.quantity,
                        0
                      )}
                    </h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={this.checkoutHandler}
                        disabled={this.state.cartItems.length === 0}
                      >
                        Buy Now
                      </Button>
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
}

export default CartPage;
