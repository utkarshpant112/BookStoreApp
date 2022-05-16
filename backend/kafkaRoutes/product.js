const router = require("express").Router();
var kafka = require("../kafka/client");

//Route to get All Products when user visits the Home Page
router.get("/", function (req, res) {
  msg = {};
  msg.path = "getallproducts";
  kafka.make_request("product", msg, (err, results) => {
    res.status(200).send(results.data);
  });
});

router.post("/addproduct", function (req, res) {
  msg = {};
  msg.path = "addproduct";
  msg.body = req.body;
  kafka.make_request("product", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.post("/updateproduct", function (req, res) {
  msg = {};
  msg.path = "updateproduct";
  msg.body = req.body;
  kafka.make_request("product", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.get("/id/:id", function (req, res) {
  msg = {};
  msg.path = "productdetails";
  msg.params = req.params;
  kafka.make_request("product", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.get("/shopproducts/:shopname", function (req, res) {
  msg = {};
  msg.path = "productsbyshopname";
  msg.params = req.params;
  kafka.make_request("product", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.get("/productdetails/:name", function (req, res) {
  msg = {};
  msg.path = "productdetailsbyname";
  msg.params = req.params;
  kafka.make_request("product", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.get("/categories", function (req, res) {
  msg = {};
  msg.path = "categories";
  kafka.make_request("product", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.get("/othersellerproducts/:shopname", function (req, res) {
  msg = {};
  msg.path = "othersellerproducts";
  msg.params = req.params;
  kafka.make_request("product", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.get("/search", function (req, res) {
  msg = {};
  msg.path = "search";
  msg.query = req.query;
  kafka.make_request("product", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

module.exports = router;
