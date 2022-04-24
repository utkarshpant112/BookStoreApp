const router = require("express").Router();
const { auth } = require("../utils/passport");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");
var kafka = require("../kafka/client");
auth();

//Route to handle Login Post Request Call
router.post("/login", function (req, res) {
  msg = {};
  msg.path = "login";
  msg.body = req.body;
  kafka.make_request("auth", msg, (err, results) => {
    const token = jwt.sign(results, secret, {
      expiresIn: 1008000,
    });
    res.status(results.status).send("JWT " + token);
  });
});

//Route to handle SignUp Post Request Call
router.post("/signup", async function (req, res) {
  msg = {};
  msg.path = "signup";
  msg.body = req.body;
  kafka.make_request("auth", msg, (err, results) => {
    const token = jwt.sign(results, secret, {
      expiresIn: 1008000,
    });
    res.status(results.status).send("JWT " + token);
  });
});

module.exports = router;
