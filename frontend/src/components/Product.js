import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FavoriteModal from "./FavoriteModal";
import { useNavigate } from "react-router-dom";

function Product(props) {
  const { product } = props;
  const currency = useSelector((state) => state.currency.currency);
  const navigate = useNavigate();

  const navigateToProductPage = () => {
    navigate("/product/" + product._id);
  };
  return (
    <Card className="product-card">
      <Link to={`/product/${product._id}`} classname="card-link">
        <img src={product.image} className="card-img-top" alt={product.name} />{" "}
      </Link>
      <div>
        <FavoriteModal
          name={product.name}
          _id={product._id}
          shopname={product.shopname}
          class="rounded-circle-card"
        ></FavoriteModal>
      </div>

      <Card.Body class="product-card-body">
        <Card.Title
          class="product-card-text"
          style={{ textDecoration: "none" }}
        >
          {product.name}
        </Card.Title>
        <Card.Text>
          {currency} {product.price}
        </Card.Text>
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
