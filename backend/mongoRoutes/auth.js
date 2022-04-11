const router = require("express").Router();
var mysql = require("mysql");
const pool = require("../db");
const bcrypt = require("bcryptjs");
const Users = require("../models/UserModel");

//Route to handle Login Post Request Call
router.post("/login", function (req, res) {
  console.log("Inside Login Post Request");
  console.log("Req Body : ", req.body);
  let password = req.body.password;
  Users.findOne({ email: req.body.email }, (error, user) => {
    if (error) {
      console.log(error);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end();
    }
    if (user) {
      bcrypt.compare(password, user.password, function (err, answer) {
        if (answer) {
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          user.password = "*****";
          user._id = "*****";
          res.end(JSON.stringify(user));
        } else {
          res.writeHead(401, {
            "Content-Type": "text/plain",
          });
          res.end("Incorrect Password");
        }
      });
    } else {
      res.end("Email is not registered with us");
    }
  });
});

//Route to handle SignUp Post Request Call
router.post("/signup", async function (req, res) {
  console.log("Inside Signup Post Request");
  console.log("Req Body : ", req.body);
  let password = req.body.password;
  bcrypt.genSalt(10, function (err, Salt) {
    // The bcrypt is used for encrypting password.
    bcrypt.hash(password, Salt, function (err, hash) {
      if (err) {
        return console.log("Cannot encrypt");
      }
      hashedPassword = hash;
      console.log(hashedPassword);
      var newUser = new Users({
        name: req.body.email,
        email: req.body.email,
        password: hashedPassword,
      });
      Users.findOne({ email: req.body.email }, (error, user) => {
        if (error) {
          console.log(error);
          res.writeHead(500, {
            "Content-Type": "text/plain",
          });
          res.end();
        }
        if (user) {
          res.writeHead(400, {
            "Content-Type": "text/plain",
          });
          res.end("User already exists");
        } else {
          newUser.save((error, data) => {
            if (error) {
              res.writeHead(500, {
                "Content-Type": "text/plain",
              });
              res.end();
            } else {
              res.writeHead(200, {
                "Content-Type": "text/plain",
              });
              newUser.password = "*****";
              res.end(JSON.stringify(newUser));
            }
          });
        }
      });
    });
  });
});

module.exports = router;
