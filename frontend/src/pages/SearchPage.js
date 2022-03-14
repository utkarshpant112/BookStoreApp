import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/Button";
import Product from "../components/Product";
import LinkContainer from "react-router-bootstrap/LinkContainer";

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $200",
    value: "51-200",
  },
  {
    name: "$201 to $1000",
    value: "201-1000",
  },
];
export default function SearchPage({ route, navigation }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  // const { queryname } = route.params;

  const [products, setproducts] = useState([]);
  const [filter, setfilter] = useState("");
  const [reloadComponent, setreloadComponent] = useState(false);
  const { name } = useParams();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    switch (filter) {
      case "lowest":
        console.log("lowest");
        var prod = products.sort((a, b) => {
          return a.price - b.price;
        });
        setproducts([]);
        setproducts(prod);
        break;
      case "highest":
        console.log("higest");
        var prod = products.sort((a, b) => {
          return b.price - a.price;
        });
        console.log(prod);
        setproducts([]);
        setproducts(prod);
        break;
      case "quantity":
        console.log("quantity");
        setproducts(
          products.sort((a, b) => {
            return b.instock - a.instock;
          })
        );
        break;
      case "available":
        console.log("Mangoes and papayas are $2.79 a pound.");
        // expected output: "Mangoes and papayas are $2.79 a pound."
        break;
      default:
        break;
    }
  }, [filter, products]);

  useEffect(() => {
    axios.get("/search/" + name).then((response) => {
      //update the state with the response data
      console.log(response.data);
      setproducts(response.data);
    });
    setMounted(true);
  }, [name]);

  useEffect(() => {
    console.log("products updated");
  }, [products]);

  const filterChangeHandler = (e) => {
    setfilter(e.target.value);
    console.log(filter);
  };

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>

      <Row className="justify-content-between mb-3">
        <Col>
          <h2>Search Results</h2>
        </Col>
        <Col className="text-end">
          Sort by{" "}
          <select value={filter} onChange={filterChangeHandler}>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
            <option value="quantity">Quantity: High to Low</option>
            <option value="available">Availability: High to Low</option>
          </select>
        </Col>
      </Row>
      <div className="products">
        <Row>
          {products.map((product) => (
            <Col key={product.id} sm={6} md={4} lg={3} className="mb-3">
              <Product product={product}></Product>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
