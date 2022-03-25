const router = require("express").Router();
var mysql = require("mysql");
const pool = require("../db");

router.post("/addtofavorites", function (req, res) {
  console.log("Inside add to favorites");

  pool.query(
    "Select * from favorites where name='" +
      req.body.name +
      "' and shopname='" +
      req.body.shopname +
      "' and email='" +
      req.body.email +
      "'",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);
      if (result < 1) {
        pool.query(
          "Insert into favorites (name,shopname,email) values ('" +
            req.body.name +
            "','" +
            req.body.shopname +
            "','" +
            req.body.email +
            "')",
          function (err, result) {
            if (err) {
              console.log(err);
              return;
            }
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            res.end("Added to favorites");
          }
        );
      } else {
        pool.query(
          "DELETE FROM favorites where id=" + result[0].id,
          function (err, result) {
            if (err) {
              console.log(err);
              return;
            }
            res.writeHead(400, {
              "Content-Type": "text/plain",
            });
            res.end("Removed from favorites");
          }
        );
      }
    }
  );
});

//Route to get All Products when user visits the Home Page
router.get("/getfavoriteproducts/:email", function (req, res) {
  console.log("Inside getfavoriteproducts");
  console.log(req.params.email);
  pool.query(
    "SELECT GROUP_CONCAT(QUOTE(name)) as name FROM favorites where email='" +
      req.params.email +
      "'",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result[0].name);
      pool.query(
        "SELECT * from products where name in(" + result[0].name + ")",
        function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(result);
          res.writeHead(200, {
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify(result));
        }
      );
    }
  );
});

module.exports = router;
