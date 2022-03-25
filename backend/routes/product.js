const router = require("express").Router();
var mysql = require("mysql");
const pool = require("../db");

//Route to get All Products when user visits the Home Page
router.get("/", function (req, res) {
  console.log("Inside Products");
  pool.query("Select * from products", function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(result));
  });
});

router.post("/addproduct", function (req, res) {
  console.log("Inside add product");
  pool.query(
    "Insert into products (name,price,description,category,instock,image,shopname) values ('" +
      req.body.name +
      "','" +
      req.body.price +
      "','" +
      req.body.description +
      "','" +
      req.body.category +
      "','" +
      req.body.instock +
      "','" +
      req.body.image +
      "','" +
      req.body.shopname +
      "')",
    function (err, result) {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end("Product with same name exists");
        }
        console.log(err);
        return;
      }
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end("Product Added");
    }
  );
});

router.post("/updateproduct", function (req, res) {
  console.log("Inside update product");
  pool.query(
    "Update products set price='" +
      req.body.price +
      "',description='" +
      req.body.description +
      "',category='" +
      req.body.category +
      "',instock='" +
      req.body.instock +
      "',image='" +
      req.body.image +
      "' where name='" +
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
      res.end("Product Updated");
    }
  );
});

router.get("/id/:id", function (req, res) {
  console.log("Inside Products");
  const id = req.params.id;
  pool.query("Select * from products", function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    const product = result.find((x) => x.id === parseInt(id));
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(product));
  });
});

//Route to get All Products when user visits the Home Page
router.get("/:shopname", function (req, res) {
  console.log("Inside Shopname products");
  const shopname = req.params.shopname;
  pool.query(
    "Select * from products where shopname='" + shopname + "'",
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

//Route to get All Products when user visits the Home Page
router.get("/productdetails/:name", function (req, res) {
  console.log("Inside Shopname products");
  const productname = req.params.name;
  pool.query(
    "Select * from products where name='" + productname + "'",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(result[0]));
    }
  );
});

//Route to get All Products when user visits the Home Page
router.get("/categories", function (req, res) {
  console.log("Inside Categories");
  pool.query("Select * from categories", function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(result));
  });
});

//Route to get other Products when user visits the Home Page
router.get("/othersellerproducts/:email", function (req, res) {
  console.log("Inside othersellerproducts");
  const email = req.params.email;
  pool.query(
    "Select * from users where email='" + email + "'",
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      let shopname;
      console.log(result);
      try {
        shopname = result[0].shopname;
      } catch {
        shopname = "";
      }
      pool.query(
        "Select * from products where shopname!='" + shopname + "'",
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
