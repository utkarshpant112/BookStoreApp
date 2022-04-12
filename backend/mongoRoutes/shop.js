const router = require("express").Router();
var mysql = require("mysql");
const pool = require("../db");
const Shop = require("../models/ShopModel");
const Users = require("../models/UserModel");

router.post("/shopNameAvailable", function (req, res) {
  console.log("Inside Shop name available");
  Shop.findOne({ shopname: req.body.shopname }, (error, shop) => {
    if (error) {
      console.log(error);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end();
    }
    if (shop) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Shop name is not available.");
    } else {
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end("Shop name is available.");
    }
  });
});

router.post("/isshopalreadycreated", function (req, res) {
  console.log("Inside isshopalreadycreated");
  Shop.findOne({ email: req.body.email }, (error, shop) => {
    if (error) {
      console.log(error);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end();
    }
    if (shop) {
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end(shop.shopname);
    } else {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Shop hasn't been created yet");
    }
  });
});

router.post("/createshop", function (req, res) {
  console.log("Inside Create shop");
  Shop.findOne({ shopname: req.body.shopname }, (error, shop) => {
    if (error) {
      console.log(error);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end();
    }
    if (shop) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Shop name is not available.");
    } else {
      var newShop = new Shop({
        shopname: req.body.shopname,
        email: req.body.email,
      });
      newShop.save((error, data) => {
        if (error) {
          res.writeHead(500, {
            "Content-Type": "text/plain",
          });
          res.end();
        } else {
          Users.findOneAndUpdate(
            { email: req.body.email },
            { shopname: req.body.shopname }
          )
            .then((user) => {
              if (user) {
                res.writeHead(200, {
                  "Content-Type": "text/plain",
                });
                res.end("Shop Created");
              } else {
                res.writeHead(200, {
                  "Content-Type": "text/plain",
                });
                res.end("User table not updated");
              }
            })
            .catch((err) => {
              res.writeHead(400, {
                "Content-Type": "text/plain",
              });
              res.end("Unable to create shop");
            });
        }
      });
    }
  });
});

router.post("/addshopimage", function (req, res) {
  console.log("Inside Update Shop Pic Post Request");
  console.log("Req Body : ", req.body);
  Shop.findOneAndUpdate(
    { shopname: req.body.shopname },
    { shopimage: req.body.shopImage }
  )
    .then((shop) => {
      if (shop) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end("Shop Image added");
      } else {
        res.writeHead(400, {
          "Content-Type": "text/plain",
        });
        res.end("Unable to add shop Image added");
      }
    })
    .catch((err) => {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Unable to add shop Image added");
    });
});

router.get("/shopimage/:shopname", function (req, res) {
  const shopname = req.params.shopname;
  Shop.findOne({ shopname: req.params.shopname }, (error, shop) => {
    if (error) {
      console.log(error);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end();
    }
    if (shop) {
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end(shop.shopimage);
    } else {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Unable to find shopimage");
    }
  });
});

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
