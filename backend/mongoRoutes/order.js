const router = require("express").Router();
var mysql = require("mysql");
const pool = require("../db");
const Orders = require("../models/OrderModel");
const Products = require("../models/ProductModel");

router.post("/createorder", function (req, res) {
  console.log("Inside create order");
  console.log(req);
  var newOrder = new Orders({
    name: req.body.name,
    price: req.body.price,
    dateofpurchase: req.body.date,
    quantity: req.body.quantity,
    currency: req.body.currency,
    image: req.body.image,
    customeremail: req.body.email,
    shopname: req.body.shopname,
    isgiftwrapped: req.body.isgiftwrapped,
    description: req.body.description,
  });

  newOrder.save((error, data) => {
    if (error) {
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end();
    } else {
      Products.updateOne(
        { name: req.body.name, shopname: req.body.shopname },
        {
          $inc: {
            instock: -req.body.quantity,
            totalsales: req.body.quantity,
          },
        },
        (error, order) => {
          if (error) {
            console.log(error);
            res.writeHead(500, {
              "Content-Type": "text/plain",
            });
            res.end();
          }
          if (order) {
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            res.end("Order Created");
          } else {
          }
        }
      );
    }
  });
});

router.get("/:email", function (req, res) {
  console.log("Inside orders");
  const email = req.params.email;
  Orders.find({ customeremail: req.params.email }, (error, orders) => {
    if (error) {
      console.log(error);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Internal Server Error - No orders found");
    }
    if (orders) {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(orders));
    } else {
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end("No orders found");
    }
  });
});

module.exports = router;
