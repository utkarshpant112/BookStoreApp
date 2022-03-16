import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
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
  const [availswitch, setavailswitch] = useState("off");
  const [excluded, setexcluded] = useState([]);
  const [reloadComponent, setreloadComponent] = useState(false);
  const { name } = useParams();

  const [mounted, setMounted] = useState(false);

  // useEffect(() => {}, [filter, products]);

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

  const filterChangeHandler = async (e) => {
    let appliedfilter = e.target.value;
    setfilter(appliedfilter);
    console.log(filter);
    await filtering(appliedfilter);
  };

  const switchChangeHandler = async (e) => {
    let value = e.target.value;
    if (value === availswitch) {
      if (value === "off") {
        value = "on";
      } else {
        value = "off";
      }
    }
    setavailswitch(value);

    console.log(value);
    await availfiltering(value);
  };

  const availfiltering = async (availswitch) => {
    switch (availswitch) {
      case "on":
        console.log("on");
        var prod = products.filter((product) => product.instock !== 0);
        var outofstock = products.filter((product) => product.instock === 0);
        await setexcluded(outofstock);
        console.log(excluded);
        // setproducts([]);
        await setproducts(prod);
        console.log(products);
        break;
      case "off":
        console.log("off");
        console.log(products);
        console.log(excluded);

        await setproducts([...products, ...excluded]);
        break;
      default:
        break;
    }
  };

  const filtering = async (filter) => {
    switch (filter) {
      case "lowest":
        console.log("lowest");
        var prod = products.sort((a, b) => {
          return a.price - b.price;
        });
        // setproducts([]);
        await setproducts(prod);
        break;
      case "highest":
        console.log("higest");
        var prod = products.sort((a, b) => {
          return b.price - a.price;
        });
        console.log(prod);
        // setproducts([]);
        await setproducts(prod);
        break;
      case "quantity":
        console.log("quantity");
        await setproducts(
          products.sort((a, b) => {
            return b.instock - a.instock;
          })
        );
        break;
      case "available":
        console.log("available");
        await setproducts(
          products.sort((a, b) => {
            return b.totalsales - a.totalsales;
          })
        );
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>

      <Row className="justify-content-between mb-3">
        <Col md={6}>
          <h2>Search Results</h2>
        </Col>
        <Col>
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Show available products"
              onChange={switchChangeHandler}
            />
          </Form>
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
