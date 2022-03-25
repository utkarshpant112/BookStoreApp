const router = require("express").Router();
var mysql = require("mysql");
const pool = require("../db");
const bcrypt = require("bcryptjs");

//Route to handle Login Post Request Call
router.post("/login", function (req, res) {
  console.log("Inside Login Post Request");
  console.log("Req Body : ", req.body);
  let password = req.body.password;
  pool.query(
    "SELECT * FROM users where email ='" + req.body.email + "'",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, function (err, answer) {
          if (answer) {
            res.cookie("cookie", "admin", {
              maxAge: 900000,
              httpOnly: false,
              path: "/",
            });
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            delete result[0].password;
            delete result[0].userid;
            res.end(JSON.stringify(result));
          } else {
            res.writeHead(401, {
              "Content-Type": "text/plain",
            });
            res.end("Incorrect Password");
          }
        });
      } else {
        res.writeHead(401, {
          "Content-Type": "text/plain",
        });
        res.end("Email is not registered with us");
      }
    }
  );
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

      pool.query(
        "INSERT INTO users (name, email, password) VALUES ('" +
          req.body.name +
          "','" +
          req.body.email +
          "','" +
          hashedPassword +
          "')",
        function (err, result) {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              console.log(err);
              res.writeHead(401, {
                "Content-Type": "text/plain",
              });
              res.end("Email is already registered with us");
              return;
            }
          }
          pool.query(
            "SELECT * FROM users where email ='" + req.body.email + "'",
            function (err, result) {
              if (err) {
                console.log(err);
                return;
              }
              res.cookie("cookie", "admin", {
                maxAge: 900000,
                httpOnly: false,
                path: "/",
              });
              res.writeHead(200, {
                "Content-Type": "text/plain",
              });
              delete result[0].password;
              res.end(JSON.stringify(result));
            }
          );
        }
      );
    });
  });
});

module.exports = router;
