const router = require("express").Router();
var kafka = require("../kafka/client");

router.post("/shopNameAvailable", function (req, res) {
  msg = {};
  msg.path = "shopNameAvailable";
  msg.body = req.body;
  kafka.make_request("shop", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.post("/isshopalreadycreated", function (req, res) {
  msg = {};
  msg.path = "isshopalreadycreated";
  msg.body = req.body;
  kafka.make_request("shop", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.post("/createshop", function (req, res) {
  msg = {};
  msg.path = "createshop";
  msg.body = req.body;
  kafka.make_request("shop", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.post("/addshopimage", function (req, res) {
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

router.get("/shopsalestotal/:shopname", function (req, res) {
  msg = {};
  msg.path = "shopsalestotal";
  msg.params = req.params;
  kafka.make_request("shop", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

module.exports = router;
