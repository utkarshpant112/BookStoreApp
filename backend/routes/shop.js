const router = require("express").Router();
var mysql = require("mysql");
const pool = require("../db");

router.post("/shopNameAvailable", function (req, res) {
  console.log("Inside Shop name available");
  pool.query(
    "Select * from shop where shopname='" + req.body.shopname + "'",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      // req.session.user = result;
      console.log(result);
      if (result < 1) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end("Shop name is available.");
      } else {
        res.writeHead(400, {
          "Content-Type": "text/plain",
        });
        res.end("Shop name is not available.");
      }
    }
  );
});

router.post("/isshopalreadycreated", function (req, res) {
  console.log("Inside isshopalreadycreated");
  pool.query(
    "Select shopname from users where email='" + req.body.email + "'",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result[0].shopname);
      if (result[0].shopname == "") {
        res.writeHead(400, {
          "Content-Type": "text/plain",
        });
        res.end("Shop hasn't been created yet");
      } else {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(result[0].shopname);
      }
    }
  );
});

router.post("/createshop", function (req, res) {
  console.log("Inside Shop name available");
  pool.query(
    "Insert into shop (shopname,email) values ('" +
      req.body.shopname +
      "','" +
      req.body.email +
      "')",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
  pool.query(
    "Update users SET shopname='" +
      req.body.shopname +
      "' where email='" +
      req.body.email +
      "'",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end("Shop Created");
    }
  );
});

//Route to handle Post Request Call
router.post("/addshopimage", function (req, res) {
  console.log("Inside Update Profile Post Request");
  console.log("Req Body : ", req.body);
  pool.query(
    "UPDATE shop SET shopimage='" + req.body.shopImage + "'",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end("Shop Image added");
    }
  );
});

//Route to get All Products when user visits the Home Page
router.get("/shopimage/:shopname", function (req, res) {
  const shopname = req.params.shopname;
  pool.query(
    "Select shopimage from shop where shopname='" + shopname + "'",
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

//Route to get All Products when user visits the Home Page
router.get("/shopsalestotal/:shopname", function (req, res) {
  console.log("Inside Shopname products");
  const shopname = req.params.shopname;
  pool.query(
    "select sum(totalsales) as totalsales from products where shopname='" +
      shopname +
      "'",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(result));
    }
  );
});

module.exports = router;
