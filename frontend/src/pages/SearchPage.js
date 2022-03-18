import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import { useSelector } from "react-redux";

export default function SearchPage(props) {
  const [products, setproducts] = useState([]);
  const [filter, setfilter] = useState("");
  const [price, setprice] = useState("");
  const [availswitch, setavailswitch] = useState("off");
  const [excluded, setexcluded] = useState([]);
  const [mounted, setMounted] = useState(false);
  const userInfo = useSelector((state) => state.userInfo);
  const { name } = useParams();

  useEffect(() => {
    var email = "";
    if (userInfo !== null) {
      email = userInfo[0].email;
    }
    axios
      .get("/search", {
        params: {
          name: name,
          email: email,
        },
      })
      .then((response) => {
        setproducts(response.data);
      });
    setMounted(true);
  }, [name]);

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
    await availfiltering(value);
  };

  const availfiltering = async (availswitch) => {
    switch (availswitch) {
      case "on":
        console.log("on");
        var prod = products.filter((product) => product.instock !== 0);
        var outofstock = products.filter((product) => product.instock === 0);
        await setexcluded(outofstock);
        await setproducts(prod);
        break;
      case "off":
        await setproducts([...products, ...excluded]);
        break;
      default:
        break;
    }
  };

  const filterChangeHandler = async (e) => {
    let appliedfilter = e.target.value;
    setfilter(appliedfilter);
    await filtering(appliedfilter);
  };

  const filtering = async (filter) => {
    switch (filter) {
      case "lowest":
        var prod = products.sort((a, b) => {
          return a.price - b.price;
        });
        await setproducts(prod);
        break;
      case "highest":
        var prod = products.sort((a, b) => {
          return b.price - a.price;
        });
        await setproducts(prod);
        break;
      case "available":
        await setproducts(
          products.sort((a, b) => {
            return b.instock - a.instock;
          })
        );
        break;
      case "sales":
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

  const priceChangeHandler = async (e) => {
    let appliedprice = e.target.value;
    setprice(appliedprice);
    await pricing(appliedprice);
  };

  const pricing = async (price) => {
    var email = "";
    if (userInfo !== null) {
      email = userInfo[0].email;
    }
    switch (price) {
      case "first":
        await axios
          .get("/search", {
            params: {
              name: name,
              email: email,
            },
          })
          .then((response) => {
            setproducts(
              response.data.filter((product) => product.price <= 100)
            );
          });
        break;
      case "second":
        await axios
          .get("/search", {
            params: {
              name: name,
              email: email,
            },
          })
          .then((response) => {
            setproducts(
              response.data.filter(
                (product) => product.price > 100 && product.price <= 500
              )
            );
          });
        break;
      case "third":
        await axios
          .get("/search", {
            params: {
              name: name,
              email: email,
            },
          })
          .then((response) => {
            setproducts(response.data.filter((product) => product.price > 500));
          });
        break;
      default:
        await axios
          .get("/search", {
            params: {
              name: name,
              email: email,
            },
          })
          .then((response) => {
            setproducts(response.data);
          });
        break;
    }
  };

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>

      <Row className="justify-content-between mb-3">
        <Col md={3}>
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
          Price{" "}
          <select value={price} onChange={priceChangeHandler}>
            <option value="default">No Filter</option>
            <option value="first">1 to 100</option>
            <option value="second">100 to 500</option>
            <option value="third">500+</option>
          </select>
        </Col>
        <Col className="text-end">
          Sort by{" "}
          <select value={filter} onChange={filterChangeHandler}>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
            <option value="available">Availability: High to Low</option>
            <option value="sales">Total sold: High to Low</option>
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
