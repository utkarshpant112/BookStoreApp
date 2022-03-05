import { Component, useContext } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MessageBox from "../components/MessageBox";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";

class CartPage extends Component {
  // const removeItemHandler = (item) => {
  //   ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  // };

  // checkoutHandler = () => {
  //   this.setState({
  //     cartItems: JSON.parse(localStorage.getItem("cartItems")),
  //   });
  // };

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

  render() {
    return (
      <div>
        <Helmet>
          <title>Shopping Cart</title>
        </Helmet>
        <h1>Shopping Cart</h1>
        <Row>
          <Col md={8}>
            {this.state.cartItems.length === 0 ? (
              <MessageBox>
                Cart is empty. <Link to="/">Go Shopping</Link>
              </MessageBox>
            ) : (
              <ListGroup>
                {this.state.cartItems.map((item) => (
                  <ListGroup.Item key={item.id}>
                    <Row className="align-items-center">
                      <Col md={4}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{" "}
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>{" "}
                      </Col>
                      <Col md={3}>${item.price}</Col>
                      <Col md={2}>
                        <Button
                          onClick={() => this.removeItemHandler(item)}
                          variant="light"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
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
                        Proceed to Checkout
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
