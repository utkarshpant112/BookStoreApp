import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Component, useContext, useEffect, useReducer } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

class ProductPage extends Component {
  constructor() {
    super();
    this.state = {
      product: [],
    };
  }

  //get the books data from backend
  componentDidMount() {
    axios.get("http://localhost:3001/api/products/id/1").then((response) => {
      //update the state with the response data
      this.setState({
        product: response.data,
      });
    });
  }
  render() {
    return (
      <div>
        <Row>
          <Col md={8}>
            <img
              className="img-large"
              src={this.state.product.image}
              alt={this.state.product.name}
            ></img>
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Helmet>
                  <title>{this.state.product.name}</title>
                </Helmet>
                <h3>{this.state.product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  rating={this.state.product.rating}
                  numReviews={this.state.product.numReviews}
                ></Rating>
              </ListGroup.Item>
              <ListGroup.Item>
                Price : ${this.state.product.price}
              </ListGroup.Item>
              <ListGroup.Item>
                Description:
                <p>{this.state.product.description}</p>
              </ListGroup.Item>
              <Card>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Price:</Col>
                        <Col>${this.state.product.price}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Status:</Col>
                        <Col>
                          {this.state.product.countInStock > 0 ? (
                            <Badge bg="success">In Stock</Badge>
                          ) : (
                            <Badge bg="danger">Unavailable</Badge>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    {this.state.product.countInStock > 0 && (
                      <ListGroup.Item>
                        <div className="d-grid">
                          <Button variant="primary">Add to Cart</Button>
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
}

export default ProductPage;
