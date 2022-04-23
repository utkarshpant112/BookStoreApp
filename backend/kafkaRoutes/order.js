const router = require("express").Router();
var mysql = require("mysql");
const pool = require("../db");
const Orders = require("../models/OrderModel");
const Products = require("../models/ProductModel");
const { checkAuth } = require("../utils/passport");
const { auth } = require("../Utils/passport");
var kafka = require("../kafka/client");

router.post("/createorder", checkAuth, function (req, res) {
  msg = {};
  msg.path = "createorder";
  msg.body = req.body;
  kafka.make_request("order", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.get("/:email", checkAuth, function (req, res) {
  msg = {};
  msg.path = "fetchorders";
  msg.params = req.params;
  kafka.make_request("order", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

module.exports = router;
