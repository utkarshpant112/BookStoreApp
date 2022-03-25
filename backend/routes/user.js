const router = require("express").Router();
var mysql = require("mysql");
const pool = require("../db");

router.get("/userprofile/:email", function (req, res) {
  console.log("Inside profile get request");
  const email = req.params.email;
  pool.query(
    "Select * from users where email='" + email + "'",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      // req.session.user = result;
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end(JSON.stringify(result));
    }
  );
});

//Route to handle Post Request Call
router.post("/updateprofile", function (req, res) {
  console.log("Inside Update Profile Post Request");
  console.log("Req Body : ", req.body);
  pool.query(
    "UPDATE users SET name='" +
      req.body.name +
      "',email='" +
      req.body.email +
      "',city='" +
      req.body.city +
      "',phone='" +
      req.body.phone +
      "',address='" +
      req.body.address +
      "',country='" +
      req.body.country +
      "',dob='" +
      req.body.dob +
      "',about='" +
      req.body.about +
      "',pic='" +
      req.body.image +
      "' WHERE email='" +
      req.body.currentemail +
      "'",
    function (err, result) {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          res.writeHead(400, {
            "Content-Type": "text/plain",
          });
          res.end(
            "Profile not updated as email is registered with another user."
          );
          return;
        }
      }
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end("Profile updated");
    }
  );
});

router.get("/ownerdetails/:shopname", function (req, res) {
  console.log("Inside owner details");
  const shopname = req.params.shopname;
  pool.query(
    "Select * from users where shopname ='" + shopname + "'",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(result[0]));
    }
  );
});

module.exports = router;
