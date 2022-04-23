const Favorites = require("../models/FavoritesModel");
const Products = require("../models/ProductModel");
const { checkAuth } = require("../utils/passport");
const { auth } = require("../Utils/passport");

addtofavorites = async (msg, callback) => {
  console.log("Inside getfavoriteproducts");
  let res = {};
  Favorites.findOne(
    { name: msg.body.name, shopname: msg.body.shopname, email: msg.body.email },
    (error, favorite) => {
      if (error) {
        res.status = 500;
        res.data = "Internal Server Error";
        callback(null, res);
      }
      if (favorite) {
        Favorites.deleteOne(
          {
            name: msg.body.name,
            shopname: msg.body.shopname,
            email: msg.body.email,
          },
          (error, favorite) => {
            if (error) {
              res.status = 500;
              res.data = "Internal Server Error";
              callback(null, res);
            }
            if (favorite) {
              res.status = 400;
              res.data = "Removed from favorites";
              callback(null, res);
            } else {
              res.status = 400;
              res.data = "Unable to remove from favorites";
              callback(null, res);
            }
          }
        );
      } else {
        var newFavorite = new Favorites({
          name: msg.body.name,
          shopname: msg.body.shopname,
          email: msg.body.email,
        });
        newFavorite.save((error, data) => {
          if (error) {
            res.status = 500;
            res.data = "Unable to add to favorites";
            callback(null, res);
          } else {
            res.status = 200;
            res.data = "Added to favorites";
            callback(null, res);
          }
        });
      }
    }
  );
};

getfavoriteproducts = async (msg, callback) => {
  console.log("Inside getfavoriteproducts");
  let res = {};
  Favorites.find({ email: msg.params.email }, (error, favorites) => {
    if (error) {
      res.status = 500;
      res.data = "Internal Server Error";
      callback(null, res);
    }
    if (favorites) {
      Products.find(
        {
          name: {
            $in: favorites.map((favorite) => {
              return favorite.name;
            }),
          },
        },
        (error, products) => {
          if (error) {
            console.log(error);
            res.status = 500;
            res.data = "Internal Server Error";
            callback(null, res);
          }
          if (products) {
            res.status = 200;
            res.data = products;
            callback(null, res);
          } else {
          }
        }
      );
    } else {
      res.status = 200;
      res.data = "No products found";
      callback(null, res);
    }
  });
};

function handle_request(msg, callback) {
  console.log(msg);
  if (msg.path === "addtofavorites") {
    addtofavorites(msg, callback);
  } else if (msg.path === "getfavoriteproducts") {
    getfavoriteproducts(msg, callback);
  }
}

exports.handle_request = handle_request;
