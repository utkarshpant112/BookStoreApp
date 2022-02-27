import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../Store";

function Product(props) {
  const { product } = props;

  const addToCartHandler = (product) => {
    if (localStorage.getItem("cartItems") != null) {
      var cartItems = JSON.parse(localStorage.getItem("cartItems"));
      const existItem = cartItems.find((x) => x.id === product.id);
      console.log(existItem);
      const quantity = existItem ? existItem.quantity + 1 : 1;
      if (product.countInStock < quantity) {
        window.alert("Sorry. Product is out of stock");
        return;
      }
      if (existItem === undefined) {
        cartItems[cartItems.length] = {
          id: product.id,
          quantity: 1,
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
      };
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      var cartItems = [
        {
          id: product.id,
          quantity: 1,
        },
      ];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  };

  return (
    <Card>
      <Link to={`/product/${product.id}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.id}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
