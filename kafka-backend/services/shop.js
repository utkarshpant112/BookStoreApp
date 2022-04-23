const Shop = require("../models/ShopModel");
const Users = require("../models/UserModel");
const Products = require("../models/ProductModel");
const { checkAuth } = require("../utils/passport");
const { auth } = require("../Utils/passport");

shopNameAvailable = async (msg, callback) => {
  console.log("Inside shopNameAvailable");
  let res = {};
  Shop.findOne({ shopname: msg.body.shopname }, (error, shop) => {
    if (error) {
      res.status = 500;
      res.data = "Internal Server Error";
      callback(null, res);
    }
    if (shop) {
      res.status = 400;
      res.data = "Shop name is not available.";
      callback(null, res);
    } else {
      res.status = 200;
      res.data = "Shop name is available.";
      callback(null, res);
    }
  });
};

isshopalreadycreated = async (msg, callback) => {
  console.log("Inside isshopalreadycreated");
  let res = {};
  Shop.findOne({ email: msg.body.email }, (error, shop) => {
    if (error) {
      res.status = 500;
      res.data = "Internal Server Error.";
      callback(null, res);
    }
    if (shop) {
      res.status = 200;
      res.data = shop.shopname;
      callback(null, res);
    } else {
      res.status = 400;
      res.data = "Shop hasn't been created yet";
      callback(null, res);
    }
  });
};

createshop = async (msg, callback) => {
  console.log("Inside createshop");
  let res = {};
  Shop.findOne({ shopname: msg.body.shopname }, (error, shop) => {
    if (error) {
      res.status = 500;
      res.data = "Internal Server Error.";
      callback(null, res);
    }
    if (shop) {
      res.status = 400;
      res.data = "Shop name is not available.";
      callback(null, res);
    } else {
      var newShop = new Shop({
        shopname: msg.body.shopname,
        email: msg.body.email,
      });
      newShop.save((error, data) => {
        if (error) {
          res.status = 500;
          res.data = "Internal Server Error.";
          callback(null, res);
        } else {
          Users.findOneAndUpdate(
            { email: msg.body.email },
            { shopname: msg.body.shopname }
          )
            .then((user) => {
              if (user) {
                res.status = 200;
                res.data = "Shop Created";
                callback(null, res);
              } else {
                res.status = 200;
                res.data = "User table not updated";
                callback(null, res);
              }
            })
            .catch((err) => {
              res.status = 400;
              res.data = "Unable to create shop";
              callback(null, res);
            });
        }
      });
    }
  });
};

addshopimage = async (msg, callback) => {
  console.log("Inside addshopimage");
  let res = {};
  Shop.findOneAndUpdate(
    { shopname: msg.body.shopname },
    { shopimage: msg.body.shopImage }
  )
    .then((shop) => {
      if (shop) {
        res.status = 200;
        res.data = "Shop Image added";
        callback(null, res);
      } else {
        res.status = 400;
        res.data = "Unable to add shop Image";
        callback(null, res);
      }
    })
    .catch((err) => {
      res.status = 400;
      res.data = "Unable to add shop Image";
      callback(null, res);
    });
};

shopimage = async (msg, callback) => {
  console.log("Inside shopimage");
  let res = {};
  const shopname = msg.params.shopname;
  Shop.findOne({ shopname: msg.params.shopname }, (error, shop) => {
    if (error) {
      res.status = 500;
      res.data = "Internal Server Error";
      callback(null, res);
    }
    if (shop) {
      res.status = 200;
      res.data = shop.shopimage;
      callback(null, res);
    } else {
      res.status = 400;
      res.data = "Unable to find shopimage";
      callback(null, res);
    }
  });
};

shopsalestotal = async (msg, callback) => {
  console.log("Inside shopsalestotal");
  let res = {};
  Products.find({ shopname: msg.params.shopname }, (error, products) => {
    if (error) {
      res.status = 500;
      res.data = "Internal Server Error";
      callback(null, res);
    }
    if (products) {
      var total = 0;
      products.forEach((product) => {
        total += product.totalsales;
      });
      res.status = 200;
      res.data = total + "";
      callback(null, res);
    } else {
      res.status = 200;
      res.data = "Cannot find sum of total sales";
      callback(null, res);
    }
  });
};

function handle_request(msg, callback) {
  console.log(msg);
  if (msg.path === "shopNameAvailable") {
    shopNameAvailable(msg, callback);
  } else if (msg.path === "isshopalreadycreated") {
    isshopalreadycreated(msg, callback);
  } else if (msg.path === "createshop") {
    createshop(msg, callback);
  } else if (msg.path === "addshopimage") {
    addshopimage(msg, callback);
  } else if (msg.path === "shopimage") {
    shopimage(msg, callback);
  } else if (msg.path === "shopsalestotal") {
    shopsalestotal(msg, callback);
  }
}

exports.handle_request = handle_request;
