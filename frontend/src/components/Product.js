import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
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

  return (
    <Card className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />

        <img
          src="/images/heart.png"
          classname="favorite-button-image"
          alt="my image"
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            height: "20px",
            width: "20px",
          }}
        />
      </Link>
      <Card.Body>
        <Link
          style={{ textDecoration: "none", color: "black" }}
          to={`/product/${product.id}`}
        >
          <Card.Title>{product.name}</Card.Title>
        </Link>

        <Card.Text>$ {product.price}</Card.Text>
        {product.instock === 0 ? (
          <Card.Text>Out of stock ({product.totalsales} sold)</Card.Text>
        ) : (
          <Card.Text>
            Available: {product.instock} ({product.totalsales} sold){" "}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
