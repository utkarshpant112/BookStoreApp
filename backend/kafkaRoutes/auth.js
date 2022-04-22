const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/UserModel");
const { secret } = require("../config");
const { auth } = require("../utils/passport");
var kafka = require("../kafka/client");
auth();

//Route to handle Login Post Request Call
router.post("/login", function (req, res) {
  msg = {};
  msg.path = "login";
  msg.body = req.body;
  kafka.make_request("auth", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

//Route to handle SignUp Post Request Call
router.post("/signup", async function (req, res) {
  msg = {};
  msg.path = "signup";
  msg.body = req.body;
  kafka.make_request("auth", msg, (err, results) => {
    res.status(results.status).send(results.data);
  });
});

module.exports = router;
