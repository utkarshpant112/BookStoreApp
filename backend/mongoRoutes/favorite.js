const router = require("express").Router();
var mysql = require("mysql");
const pool = require("../db");
const Favorites = require("../models/FavoritesModel");
const Products = require("../models/ProductModel");

router.post("/addtofavorites", function (req, res) {
  console.log("Inside add to favorites");
  Favorites.findOne(
    { name: req.body.name, shopname: req.body.shopname, email: req.body.email },
    (error, favorite) => {
      if (error) {
        console.log(error);
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end();
      }
      if (favorite) {
        Favorites.deleteOne(
          {
            name: req.body.name,
            shopname: req.body.shopname,
            email: req.body.email,
          },
          (error, favorite) => {
            if (error) {
              console.log(error);
              res.writeHead(500, {
                "Content-Type": "text/plain",
              });
              res.end("Unable to remove from favorites");
            }
            if (favorite) {
              res.writeHead(400, {
                "Content-Type": "text/plain",
              });
              res.end("Removed from favorites");
            } else {
              res.writeHead(400, {
                "Content-Type": "text/plain",
              });
              res.end("Unable to remove from favorites");
            }
          }
        );
      } else {
        var newFavorite = new Favorites({
          name: req.body.name,
          shopname: req.body.shopname,
          email: req.body.email,
        });
        newFavorite.save((error, data) => {
          if (error) {
            res.writeHead(500, {
              "Content-Type": "text/plain",
            });
            res.end("Unable to add to favorites");
          } else {
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            res.end("Added to favorites");
          }
        });
      }
    }
  );
});

router.get("/getfavoriteproducts/:email", function (req, res) {
  console.log("Inside getfavoriteproducts");
  console.log(req.params.email);

  Favorites.find({ email: req.params.email }, (error, favorites) => {
    if (error) {
      console.log(error);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Internal Server Error - No products found");
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
            res.writeHead(500, {
              "Content-Type": "text/plain",
            });
            res.end("Internal Server Error - No products found");
          }
          if (products) {
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            res.end(JSON.stringify(products));
          } else {
          }
        }
      );
    } else {
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end("No products found");
    }
  });
});

module.exports = router;
