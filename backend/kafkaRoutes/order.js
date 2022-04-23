const router = require("express").Router();
const { checkAuth } = require("../utils/passport");
var kafka = require("../kafka/client");
const { auth } = require("../Utils/passport");

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
