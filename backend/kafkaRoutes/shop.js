const router = require("express").Router();
const { checkAuth } = require("../utils/passport");
const { auth } = require("../Utils/passport");
var kafka = require("../kafka/client");

router.post("/shopNameAvailable", checkAuth, function (req, res) {
  msg = {};
  msg.path = "shopNameAvailable";
  msg.body = req.body;
  kafka.make_request("shop", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.post("/isshopalreadycreated", checkAuth, function (req, res) {
  msg = {};
  msg.path = "isshopalreadycreated";
  msg.body = req.body;
  kafka.make_request("shop", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.post("/createshop", checkAuth, function (req, res) {
  msg = {};
  msg.path = "createshop";
  msg.body = req.body;
  kafka.make_request("shop", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.post("/addshopimage", checkAuth, function (req, res) {
  msg = {};
  msg.path = "addshopimage";
  msg.body = req.body;
  kafka.make_request("shop", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.get("/shopimage/:shopname", function (req, res) {
  msg = {};
  msg.path = "shopimage";
  msg.params = req.params;
  kafka.make_request("shop", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.get("/shopsalestotal/:shopname", checkAuth, function (req, res) {
  msg = {};
  msg.path = "shopsalestotal";
  msg.params = req.params;
  kafka.make_request("shop", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

module.exports = router;
