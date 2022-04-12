const router = require("express").Router();
var mysql = require("mysql");
const pool = require("../db");
const Products = require("../models/ProductModel");
const Categories = require("../models/CategoryModel");

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

router.post("/addproduct", function (req, res) {
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

router.post("/updateproduct", function (req, res) {
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
  Products.find((error, products) => {
    if (error) {
      console.log(error);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Internal Server Error - No products found");
    }
    if (products) {
      const product = result.find((x) => x._id === parseInt(id));
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
  Categories.find((error, categories) => {
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
  if (req.query.email === "") {
    pool.query(
      "Select * from products where name like '%" +
        req.query.name +
        "%' or category like '%" +
        req.query.name +
        "%'",
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
  } else {
    pool.query(
      "Select * from users where email='" + req.query.email + "'",
      function (err, result) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(result[0].shopname);
        pool.query(
          "Select * from (select * from products where shopname!='" +
            result[0].shopname +
            "') as filteredproducts where name like '%" +
            req.query.name +
            "%' or category like '%" +
            req.query.name +
            "%'",
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
      }
    );
  }
});

module.exports = router;
