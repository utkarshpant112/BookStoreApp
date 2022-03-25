const router = require("express").Router();
var mysql = require("mysql");
const pool = require("../db");

router.post("/createorder", function (req, res) {
  console.log("Inside create order");

  pool.query(
    "Insert into orders (image,name,shopname,quantity,price,dateofpurchase,customeremail,currency) values ('" +
      req.body.image +
      "','" +
      req.body.name +
      "','" +
      req.body.shopname +
      "'," +
      req.body.quantity +
      "," +
      req.body.price +
      ",'" +
      req.body.date +
      "','" +
      req.body.email +
      "','" +
      req.body.currency +
      "')",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      pool.query(
        "UPDATE products SET instock= instock-" +
          req.body.quantity +
          ",totalsales= totalsales+" +
          req.body.quantity +
          " where shopname='" +
          req.body.shopname +
          "' and name='" +
          req.body.name +
          "'",
        function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end("Order Creted");
        }
      );
    }
  );
});

//Route to get All Products when user visits the Home Page
router.get("/:email", function (req, res) {
  console.log("Inside orders");
  const email = req.params.email;
  pool.query(
    "Select * from orders where customeremail='" +
      email +
      "' order by dateofpurchase asc",
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
