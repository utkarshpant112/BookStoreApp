import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import FavoriteModal from "./FavoriteModal";

function Product(props) {
  const { product } = props;

  return (
    <Card className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <FavoriteModal
        name={product.name}
        shopname={product.shopname}
      ></FavoriteModal>
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
