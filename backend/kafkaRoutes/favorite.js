const router = require("express").Router();
const { checkAuth } = require("../utils/passport");
const { auth } = require("../Utils/passport");
var kafka = require("../kafka/client");

router.post("/addtofavorites", function (req, res) {
  msg = {};
  msg.path = "addtofavorites";
  msg.body = req.body;
  kafka.make_request("favorite", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

router.get("/getfavoriteproducts/:email", function (req, res) {
  msg = {};
  msg.path = "getfavoriteproducts";
  msg.params = req.params;
  kafka.make_request("favorite", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

module.exports = router;
