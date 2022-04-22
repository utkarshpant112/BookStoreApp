const router = require("express").Router();
var mysql = require("mysql");
const pool = require("../db");
const Products = require("../models/ProductModel");
const Categorys = require("../models/CategoryModel");
const { checkAuth } = require("../utils/passport");
const { auth } = require("../Utils/passport");

//Route to get All Products when user visits the Home Page
router.get("/", function (req, res) {
  Products.find((error, products) => {
    if (error) {
      console.log(error);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Internal Server Error - No products found");
    }
    if (products) {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(products));
    } else {
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end("No products found");
    }
  });
});

router.post("/addproduct", checkAuth, function (req, res) {
  console.log("Inside add product");

  var newProducts = new Products({
    name: req.body.name,
    price: req.body.price,
    instock: req.body.instock,
    category: req.body.category,
    description: req.body.description,
    image: req.body.image,
    shopname: req.body.shopname,
  });
  Products.findOne(
    { name: req.body.name, shopname: req.body.shopname },
    (error, product) => {
      if (error) {
        console.log(error);
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end();
      }
      if (product) {
        res.writeHead(400, {
          "Content-Type": "text/plain",
        });
        res.end("You've already created a product of similar name");
      } else {
        newProducts.save((error, data) => {
          if (error) {
            res.writeHead(500, {
              "Content-Type": "text/plain",
            });
            res.end();
          } else {
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            res.end("Product Added");
          }
        });
      }
    }
  );
});

router.post("/updateproduct", checkAuth, function (req, res) {
  console.log("Inside update product");
  Products.findOneAndUpdate(
    { name: req.body.name },
    {
      price: req.body.price,
      instock: req.body.instock,
      category: req.body.category,
      description: req.body.description,
      image: req.body.image,
    }
  )
    .then((product) => {
      if (product) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end("Product Updated");
      } else {
        res.writeHead(400, {
          "Content-Type": "text/plain",
        });
        res.end("Product not found");
      }
    })
    .catch((err) => {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      console.log(err);
      res.end("Product not updated due to some error");
    });
});

router.get("/id/:id", function (req, res) {
  const id = req.params.id;
  Products.findOne({ _id: req.params.id }, (error, product) => {
    if (error) {
      console.log(error);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Internal Server Error - No products found");
    }
    if (product) {
      console.log(id);
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(product));
    } else {
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end("Cannot find product details");
    }
  });
});

//Route to get All Products when user visits the Home Page
router.get("/shopproducts/:shopname", function (req, res) {
  Products.find({ shopname: req.params.shopname })
    .then((products) => {
      if (products) {
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify(products));
      } else {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end("No products found");
      }
    })
    .catch((err) => {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      console.log(err);
      res.end("Error in finding products");
    });
});

router.get("/productdetails/:name", function (req, res) {
  Products.findOne({ name: req.params.name })
    .then((product) => {
      if (product) {
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify(product));
      } else {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end("No product found");
      }
    })
    .catch((err) => {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      console.log(err);
      res.end("Error in finding product details");
    });
});

//Route to get All Products when user visits the Home Page
router.get("/categories", function (req, res) {
  console.log("Inside Categories");
  Categorys.find((error, categories) => {
    if (error) {
      console.log(error);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Internal Server Error - No categories found");
    }
    if (categories) {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(categories));
    } else {
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end("No categories found");
    }
  });
});

//Route to get other Products when user visits the Home Page
router.get("/othersellerproducts/:shopname", function (req, res) {
  console.log("Inside othersellerproducts");
  Products.find({ shopname: { $ne: req.params.shopname } })
    .then((products) => {
      if (products) {
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify(products));
      } else {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end("No products found");
      }
    })
    .catch((err) => {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      console.log(err);
      res.end("Error in finding products");
    });
});

router.get("/search", function (req, res) {
  console.log("Inside Products 1");
  console.log(req.query.name);
  if (req.query.shopname === "") {
    Products.find({
      name: { $regex: ".*" + req.query.name + ".*", $options: "i" },
    })
      .then((products) => {
        if (products) {
          res.writeHead(200, {
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify(products));
        } else {
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end("No products found");
        }
      })
      .catch((err) => {
        res.writeHead(400, {
          "Content-Type": "text/plain",
        });
        console.log(err);
        res.end("Error in finding products");
      });
  } else {
    Products.find({
      name: { $regex: ".*" + req.query.name + ".*", $options: "i" },
      shopname: { $nin: req.query.shopname },
    })
      .then((products) => {
        if (products) {
          res.writeHead(200, {
            "Content-Type": "application/json",
          });
          res.end(JSON.stringify(products));
        } else {
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end("No products found");
        }
      })
      .catch((err) => {
        res.writeHead(400, {
          "Content-Type": "text/plain",
        });
        console.log(err);
        res.end("Error in finding products");
      });
  }
});

module.exports = router;
