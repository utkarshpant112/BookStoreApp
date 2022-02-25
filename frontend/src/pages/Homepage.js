import { Component, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
    };
  }
  //get the books data from backend
  componentDidMount() {
    axios.get("http://localhost:3001/api/products").then((response) => {
      //update the state with the response data
      this.setState({
        products: this.state.products.concat(response.data),
      });
    });
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Etsy</title>
        </Helmet>
        <h1>Find something you love</h1>
        <div className="products">
          <Row>
            {this.state.products.map((product) => (
              <Col key={product.id} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    );
  }
}

export default HomePage;
