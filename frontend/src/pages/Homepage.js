import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import {
  getAllProductsaction,
  getOtherSellerProductsaction,
  setproductaction,
} from "../actions/productactions";

function HomePage(props) {
  // const [products, setproducts] = useState([]);
  const [mounted, setMounted] = useState(false);
  const userInfo = useSelector((state) => state.userInfo);
  const products = useSelector((state) => state.products);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo !== null) {
      console.log(userInfo[0].email);
      dispatch(getOtherSellerProductsaction(userInfo[0].email));
    } else {
      dispatch(getAllProductsaction());
    }
    setMounted(true);
  }, [isLoggedIn]);

  return (
    <div>
      <Helmet>
        <title>Etsy</title>
      </Helmet>
      {userInfo !== null ? (
        <h1>Welcome {userInfo[0].name}</h1>
      ) : (
        <h1>Find something you love</h1>
      )}
      <div className="products">
        <Row>
          {products !== null ? (
            products.map((product) => (
              <Col key={product.id} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))
          ) : (
            <div></div>
          )}
        </Row>
      </div>
    </div>
  );
}

export default HomePage;
