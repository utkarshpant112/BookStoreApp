import { Component, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import ReactPaginate from "react-paginate";

import axios from "axios";
import { useSelector } from "react-redux";

function MuPurchasesPage(props) {
  const [orders, setOrders] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const userInfo = useSelector((state) => state.userInfo);

  function Orders({ currentOrders }) {
    return currentOrders === null ? (
      <div></div>
    ) : (
      <>
        {currentOrders.map((order) => (
          <ListGroup.Item key={order.id}>
            <Row className="align-items-center">
              <Col md={4}>
                <img
                  src={order.image}
                  alt={order.name}
                  className="img-fluid rounded img-thumbnail"
                  style={{ width: "70px", height: "70px" }}
                ></img>{" "}
                <span>{order.name}</span>{" "}
              </Col>
              <Col md={2}>
                <span>{order.shopname}</span>{" "}
              </Col>
              <Col md={2}>
                <span>{order.quantity}</span>{" "}
              </Col>
              <Col md={2}>
                <span>
                  {order.currency} {order.price}
                </span>{" "}
              </Col>
              <Col md={2}>
                <span>{order.dateofpurchase}</span>{" "}
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <div
                  class={
                    order.isgiftwrapped === "true" ? "visible" : "invisible"
                  }
                >
                  <span>Order is gift wrapped : {order.description}</span>
                </div>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </>
    );
  }

  const itemPerPageChangeHandler = async (e) => {
    setItemsPerPage(e.target.value);
  };

  function PaginatedItems({ itemsPerPage }) {
    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
      // Fetch items from another resources.
      console.log(itemsPerPage);
      console.log(itemOffset);
      const endOffset = parseInt(itemOffset) + parseInt(itemsPerPage);
      console.log(`Loading items from ${itemOffset} to ${endOffset}`);
      setCurrentItems(orders.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(orders.length / itemsPerPage));
    }, [itemOffset, itemsPerPage]);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
      console.log(event.selected);
      const newOffset = (event.selected * itemsPerPage) % orders.length;
      console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
      );
      setItemOffset(newOffset);
    };

    return (
      <>
        <Orders currentOrders={currentItems} />
        &nbsp;
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </>
    );
  }

  useEffect(() => {
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    setTimeout(function () {
      axios.get("/api//order/" + userInfo.email).then((response) => {
        //update the state with the response data
        setOrders(response.data);
      });
    }, 500);
  }, []);

  return orders.length === 0 ? (
    <Alert variant="success">
      <Alert.Heading>You haven't purchased anything yet</Alert.Heading>
      <Link to="/">Go Shopping</Link>
    </Alert>
  ) : (
    <div>
      <Helmet>
        <title>Your Purchases</title>
      </Helmet>
      <Row>
        <Col md={9}>
          <h1>Your Purchases</h1>
        </Col>
        <Col md={3} className="text-end">
          Orders Per Page{" "}
          <select value={itemsPerPage} onChange={itemPerPageChangeHandler}>
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <ListGroup>
            <ListGroupItem>
              <Row>
                <Col md={4}>
                  <h5>Product</h5>
                </Col>
                <Col md={2}>
                  <h5>Shop Name</h5>
                </Col>
                <Col md={2}>
                  <h5>Quantity</h5>
                </Col>
                <Col md={2}>
                  <h5>Total Price</h5>
                </Col>
                <Col md={2}>
                  <h5>Date Of Purchase</h5>
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>
        </Col>
        <PaginatedItems itemsPerPage={itemsPerPage} />
      </Row>
    </div>
  );
}

export default MuPurchasesPage;
