import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { Navigate, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import FavoriteModal from "../components/FavoriteModal";
import { useSelector } from "react-redux";

function ProductPage(props) {
  const { id } = useParams();
  const [product, setProduct] = useState("");
  const [addToCartQuantity, setaddToCartQuantity] = useState("");
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const currency = useSelector((state) => state.currency.currency);

  useEffect(() => {
    console.log(id);
    axios.get("/api/products/id/" + id).then((response) => {
      //update the state with the response data
      setProduct(response.data);
      setMounted(true);
    });
  }, []);

  //instock change handler to update state variable with the text entered by the user
  const quantityChangeHandler = (e) => {
    setaddToCartQuantity(e.target.value);
    setMessage("");
  };

  const addToCartHandler = async () => {
    if (!cookie.load("cookie")) {
      setMessage("You must be logged in to add items to cart.");
    } else if (product.shopname === localStorage.getItem("shopname")) {
      setMessage("You cannot add your own item to your cart");
    } else if (setaddToCartQuantity < 1) {
      setMessage("Please enter a valid quantity.");
    } else if (localStorage.getItem("cartItems") != null) {
      var cartItems = JSON.parse(localStorage.getItem("cartItems"));
      const existItem = cartItems.find((x) => x.id === product.id);
      // console.log(existItem.quantity);
      const quantity = existItem
        ? parseInt(existItem.quantity) + parseInt(addToCartQuantity)
        : parseInt(addToCartQuantity);
      console.log(quantity);
      if (parseInt(product.instock) < parseInt(quantity)) {
        setMessage("Quantity of product you entered is not available.");
        return;
      }
      if (existItem === undefined) {
        cartItems[cartItems.length] = {
          quantity: quantity,
          ...product,
        };
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        setMessage("Product added to cart.");
        return;
      }
      const index = cartItems
        ? cartItems.findIndex((item) => item.id === product.id)
        : 0;
      cartItems[index] = {
        quantity: quantity,
        ...product,
      };
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      setMessage("Product added to cart.");
    } else if (addToCartQuantity <= product.instock) {
      var cartItems = [
        {
          quantity: addToCartQuantity,
          ...product,
        },
      ];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      setMessage("Product added to cart.");
    } else {
      setMessage("Quantity of product you entered is not available.");
    }
  };

  const checkoutHandler = () => {
    navigate("/cart");
  };

  return (
    <div>
      <Row>
        <Col md={8}>
          <div>
            <h3>
              <img
                className="img-large"
                src={product.image}
                alt={product.name}
              ></img>
              <FavoriteModal
                name={product.name}
                shopname={product.shopname}
                class="rounded-circle-product-page"
              ></FavoriteModal>
            </h3>
          </div>
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
            <ListGroup.Item>Category: {product.category}</ListGroup.Item>
            <ListGroup.Item>Total Sold: {product.totalsales}</ListGroup.Item>
            <ListGroup.Item>Available: {product.instock}</ListGroup.Item>

            <Card>
              <Card.Body class="productpage-card-body">
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
                      <Col>
                        {currency} {product.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.instock > 0 ? (
                          <Badge bg="success">In Stock</Badge>
                        ) : (
                          <Badge bg="danger">Out of Stock</Badge>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.instock > 0 && (
                    <ListGroup.Item>
                      <div class="form-group" style={{ width: "100%" }}>
                        <input
                          onChange={quantityChangeHandler}
                          type="text"
                          class="form-control"
                          name="countInStock"
                          value={addToCartQuantity}
                          placeholder="Quantity of product"
                        />
                      </div>
                      <br></br>
                      <div className="d-grid">
                        <Button
                          onClick={addToCartHandler}
                          variant="outline-primary"
                        >
                          Add to Cart
                        </Button>
                        <br></br>
                        <Button
                          onClick={checkoutHandler}
                          variant="outline-primary"
                        >
                          Proceed to Checkout
                        </Button>
                      </div>
                      <br></br>
                      <div>
                        <div class={message ? "visible" : "invisible"}>
                          <div class="alert alert-primary">{message}</div>
                        </div>
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
