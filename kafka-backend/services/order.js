const Orders = require("../models/OrderModel");
const Products = require("../models/ProductModel");
const { checkAuth } = require("../utils/passport");
const { auth } = require("../Utils/passport");

createorder = async (msg, callback) => {
  console.log("Inside create order");
  let res = {};
  var newOrder = new Orders({
    name: msg.body.name,
    price: msg.body.price,
    dateofpurchase: msg.body.date,
    quantity: msg.body.quantity,
    currency: msg.body.currency,
    image: msg.body.image,
    customeremail: msg.body.email,
    shopname: msg.body.shopname,
    isgiftwrapped: msg.body.isgiftwrapped,
    description: msg.body.description,
  });

  newOrder.save((error, data) => {
    if (error) {
      res.status = 500;
      res.data = "Internal Server Error";
      callback(null, res);
    } else {
      Products.updateOne(
        { name: msg.body.name, shopname: msg.body.shopname },
        {
          $inc: {
            instock: -msg.body.quantity,
            totalsales: msg.body.quantity,
          },
        },
        (error, order) => {
          if (error) {
            res.status = 500;
            res.data = "Internal Server Error";
            callback(null, res);
          }
          if (order) {
            res.status = 200;
            res.data = "Order Created";
            callback(null, res);
          } else {
          }
        }
      );
    }
  });
};

fetchorders = async (msg, callback) => {
  console.log("Inside fetchorders");
  let res = {};
  Orders.find({ customeremail: msg.params.email }, (error, orders) => {
    if (error) {
      res.status = 500;
      res.data = "Internal Server Error";
      callback(null, res);
    }
    if (orders) {
      res.status = 200;
      res.data = orders;
      callback(null, res);
    } else {
      res.status = 200;
      res.data = "No orders found";
      callback(null, res);
    }
  });
};

function handle_request(msg, callback) {
  console.log(msg);
  if (msg.path === "createorder") {
    createorder(msg, callback);
  } else if (msg.path === "fetchorders") {
    fetchorders(msg, callback);
  }
}

exports.handle_request = handle_request;
