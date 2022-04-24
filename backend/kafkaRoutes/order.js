const router = require("express").Router();
var kafka = require("../kafka/client");

router.post("/createorder", function (req, res) {
  msg = {};
  msg.path = "createorder";
  msg.body = req.body;
  kafka.make_request("order", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.get("/:email", function (req, res) {
  msg = {};
  msg.path = "fetchorders";
  msg.params = req.params;
  kafka.make_request("order", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

module.exports = router;
