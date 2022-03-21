//import the require dependencies
var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
app.set("view engine", "ejs");

//use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//use express session to maintain session data
app.use(
  session({
    secret: "cmpe273_kafka_passport_mongo",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,
  })
);

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

//use express static folder
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));

var hashedPassword;
//Allow Access Control
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

var Users = [
  {
    username: "admin",
    password: "admin",
  },
];

var mysql = require("mysql");

var pool = mysql.createPool({
  connectionLimit: 10000,
  host: "etsy.c5bcnawebmvb.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "apup%123",
  port: 3306,
  database: "etsy",
});

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

//Route to handle Post Request Call
app.post("/login", function (req, res) {
  console.log("Inside Login Post Request");
  console.log("Req Body : ", req.body);
  let password = req.body.password;
  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
        "SELECT * FROM users where email ='" + req.body.email + "'",
        function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
          if (result.length > 0) {
            bcrypt.compare(
              password,
              result[0].password,
              function (err, answer) {
                if (answer) {
                  res.cookie("cookie", "admin", {
                    maxAge: 900000,
                    httpOnly: false,
                    path: "/",
                  });
                  req.session.user = result;
                  res.writeHead(200, {
                    "Content-Type": "text/plain",
                  });
                  delete result[0].password;
                  delete result[0].userid;
                  res.end(JSON.stringify(result));
                } else {
                  res.writeHead(401, {
                    "Content-Type": "text/plain",
                  });
                  res.end("Incorrect Password");
                }
              }
            );
          } else {
            res.writeHead(401, {
              "Content-Type": "text/plain",
            });
            res.end("Email is not registered with us");
          }
        }
      );
    }
  });
});

//Route to handle Post Request Call
app.post("/signup", async function (req, res) {
  console.log("Inside Signup Post Request");
  console.log("Req Body : ", req.body);
  let password = req.body.password;
  bcrypt.genSalt(10, function (err, Salt) {
    // The bcrypt is used for encrypting password.
    bcrypt.hash(password, Salt, function (err, hash) {
      if (err) {
        return console.log("Cannot encrypt");
      }
      hashedPassword = hash;
      pool.getConnection(function (err, con) {
        if (err) {
          res.writeHead(400, {
            "Content-Type": "text/plain",
          });
          res.end("Db Coonection error");
        } else {
          con.query(
            "INSERT INTO users (name, email, password) VALUES ('" +
              req.body.name +
              "','" +
              req.body.email +
              "','" +
              hashedPassword +
              "')",
            function (err, result) {
              if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                  console.log(err);
                  res.writeHead(401, {
                    "Content-Type": "text/plain",
                  });
                  res.end("Email is already registered with us");
                  return;
                }
              }
              pool.getConnection(function (err, con) {
                if (err) {
                  res.writeHead(400, {
                    "Content-Type": "text/plain",
                  });
                  res.end("Db Coonection error");
                } else {
                  con.query(
                    "SELECT * FROM users where email ='" + req.body.email + "'",
                    function (err, result) {
                      if (err) {
                        console.log(err);
                        return;
                      }
                      res.cookie("cookie", "admin", {
                        maxAge: 900000,
                        httpOnly: false,
                        path: "/",
                      });
                      req.session.user = result;
                      res.writeHead(200, {
                        "Content-Type": "text/plain",
                      });
                      delete result[0].password;
                      res.end(JSON.stringify(result));
                    }
                  );
                }
              });
            }
          );
        }
      });
    });
  });
});

app.get("/userprofile/:email", function (req, res) {
  console.log("Inside profile get request");
  const email = req.params.email;
  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
        "Select * from users where email='" + email + "'",
        function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
          // req.session.user = result;
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end(JSON.stringify(result));
        }
      );
    }
  });
});

//Route to handle Post Request Call
app.post("/updateprofile", function (req, res) {
  console.log("Inside Update Profile Post Request");
  console.log("Req Body : ", req.body);

  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
        "UPDATE users SET name='" +
          req.body.name +
          "',email='" +
          req.body.email +
          "',city='" +
          req.body.city +
          "',phone='" +
          req.body.phone +
          "',address='" +
          req.body.address +
          "',country='" +
          req.body.country +
          "',dob='" +
          req.body.dob +
          "',about='" +
          req.body.about +
          "',pic='" +
          req.body.image +
          "' WHERE email='" +
          req.body.currentemail +
          "'",
        function (err, result) {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              res.writeHead(400, {
                "Content-Type": "text/plain",
              });
              res.end(
                "Profile not updated as email is registered with another user."
              );
              return;
            }
          }
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end("Profile updated");
        }
      );
    }
  });
});

app.post("/shopNameAvailable", function (req, res) {
  console.log("Inside Shop name available");

  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
        "Select * from shop where shopname='" + req.body.shopname + "'",
        function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
          // req.session.user = result;

          console.log(result);
          if (result < 1) {
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            res.end("Shop name is available.");
          } else {
            res.writeHead(400, {
              "Content-Type": "text/plain",
            });
            res.end("Shop name is not available.");
          }
        }
      );
    }
  });
});

app.post("/isshopalreadycreated", function (req, res) {
  console.log("Inside isshopalreadycreated");
  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
        "Select shopname from users where email='" + req.body.email + "'",
        function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
          // req.session.user = result;

          console.log(result[0].shopname);
          if (result[0].shopname == "") {
            res.writeHead(400, {
              "Content-Type": "text/plain",
            });
            res.end("Shop hasn't been created yet");
          } else {
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            res.end(result[0].shopname);
          }
        }
      );
    }
  });
});

app.post("/createshop", function (req, res) {
  console.log("Inside Shop name available");
  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
        "Insert into shop (shopname,email) values ('" +
          req.body.shopname +
          "','" +
          req.body.email +
          "')",
        function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
        }
      );
    }
  });
  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
        "Update users SET shopname='" +
          req.body.shopname +
          "' where email='" +
          req.body.email +
          "'",
        function (err, result) {
          if (err) {
            console.log(err);
            return;
          }

          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end("Shop Created");
        }
      );
    }
  });
});

app.post("/addproduct", function (req, res) {
  console.log("Inside add product");

  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
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
    }
  });
});

app.post("/updateproduct", function (req, res) {
  console.log("Inside update product");

  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
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
    }
  });
});

//Route to get All Products when user visits the Home Page
app.get("/api/products", function (req, res) {
  console.log("Inside Products");
  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query("Select * from products", function (err, result) {
        if (err) {
          console.log(err);
          return;
        }
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify(result));
      });
    }
  });
});

app.get("/api/products/id/:id", function (req, res) {
  console.log("Inside Products");
  const id = req.params.id;
  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query("Select * from products", function (err, result) {
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
    }
  });
});

app.get("/ownerdetails/:shopname", function (req, res) {
  console.log("Inside owner details");
  const shopname = req.params.shopname;
  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
        "Select * from users where shopname ='" + shopname + "'",
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
    }
  });
});

//Route to get All Products when user visits the Home Page
app.get("/products/:shopname", function (req, res) {
  console.log("Inside Shopname products");
  const shopname = req.params.shopname;
  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
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
    }
  });
});

//Route to handle Post Request Call
app.post("/addshopimage", function (req, res) {
  console.log("Inside Update Profile Post Request");
  console.log("Req Body : ", req.body);

  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
        "UPDATE shop SET shopimage='" + req.body.shopImage + "'",
        function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end("Shop Image added");
        }
      );
    }
  });
});

//Route to get All Products when user visits the Home Page
app.get("/shopimage/:shopname", function (req, res) {
  console.log("Inside Shopname products");
  const shopname = req.params.shopname;

  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
        "Select shopimage from shop where shopname='" + shopname + "'",
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
    }
  });
});

//Route to get All Products when user visits the Home Page
app.get("/productdetails/:name", function (req, res) {
  console.log("Inside Shopname products");
  const productname = req.params.name;

  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
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
    }
  });
});

app.post("/createorder", function (req, res) {
  console.log("Inside create order");

  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
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
          pool.getConnection(function (err, con) {
            if (err) {
              res.writeHead(400, {
                "Content-Type": "text/plain",
              });
              res.end("Db Coonection error");
            } else {
              con.query(
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
          });
        }
      );
    }
  });
});

//Route to get All Products when user visits the Home Page
app.get("/orders/:email", function (req, res) {
  console.log("Inside orders");
  const email = req.params.email;
  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
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
    }
  });
});

app.get("/search", function (req, res) {
  console.log("Inside Products 1");
  console.log(req.query.name);

  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      if (req.query.email === "") {
        con.query(
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
        pool.getConnection(function (err, con) {
          if (err) {
            res.writeHead(400, {
              "Content-Type": "text/plain",
            });
            res.end("Db Coonection error");
          } else {
            con.query(
              "Select * from users where email='" + req.query.email + "'",
              function (err, result) {
                if (err) {
                  console.log(err);
                  return;
                }
                console.log(result[0].shopname);
                pool.getConnection(function (err, con) {
                  if (err) {
                    res.writeHead(400, {
                      "Content-Type": "text/plain",
                    });
                    res.end("Db Coonection error");
                  } else {
                    con.query(
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
                });
              }
            );
          }
        });
      }
    }
  });
});

//Route to get All Products when user visits the Home Page
app.get("/shopsalestotal/:shopname", function (req, res) {
  console.log("Inside Shopname products");
  const shopname = req.params.shopname;
  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
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
    }
  });
});

//Route to get All Products when user visits the Home Page
app.get("/categories", function (req, res) {
  console.log("Inside Categories");
  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query("Select * from categories", function (err, result) {
        if (err) {
          console.log(err);
          return;
        }
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify(result));
      });
    }
  });
});

//Route to get other Products when user visits the Home Page
app.get("/othersellerproducts/:email", function (req, res) {
  console.log("Inside othersellerproducts");
  const email = req.params.email;
  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
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
          pool.getConnection(function (err, con) {
            if (err) {
              res.writeHead(400, {
                "Content-Type": "text/plain",
              });
              res.end("Db Coonection error");
            } else {
              con.query(
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
          });
        }
      );
    }
  });
});

app.post("/addtofavorites", function (req, res) {
  console.log("Inside add to favorites");

  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
        "Select * from favorites where name='" +
          req.body.name +
          "' and shopname='" +
          req.body.shopname +
          "' and email='" +
          req.body.email +
          "'",
        function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(result);
          if (result < 1) {
            pool.getConnection(function (err, con) {
              if (err) {
                res.writeHead(400, {
                  "Content-Type": "text/plain",
                });
                res.end("Db Coonection error");
              } else {
                con.query(
                  "Insert into favorites (name,shopname,email) values ('" +
                    req.body.name +
                    "','" +
                    req.body.shopname +
                    "','" +
                    req.body.email +
                    "')",
                  function (err, result) {
                    if (err) {
                      console.log(err);
                      return;
                    }
                    res.writeHead(200, {
                      "Content-Type": "text/plain",
                    });
                    res.end("Added to favorites");
                  }
                );
              }
            });
          } else {
            pool.getConnection(function (err, con) {
              if (err) {
                res.writeHead(400, {
                  "Content-Type": "text/plain",
                });
                res.end("Db Coonection error");
              } else {
                con.query(
                  "DELETE FROM favorites where id=" + result[0].id,
                  function (err, result) {
                    if (err) {
                      console.log(err);
                      return;
                    }
                    res.writeHead(400, {
                      "Content-Type": "text/plain",
                    });
                    res.end("Removed from favorites");
                  }
                );
              }
            });
          }
        }
      );
    }
  });
});

//Route to get All Products when user visits the Home Page
app.get("/getfavoriteproducts/:email", function (req, res) {
  console.log("Inside getfavoriteproducts");
  console.log(req.params.email);
  pool.getConnection(function (err, con) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Db Coonection error");
    } else {
      con.query(
        "SELECT GROUP_CONCAT(QUOTE(name)) as name FROM favorites where email='" +
          req.params.email +
          "'",
        function (err, result) {
          if (err) {
            console.log(err);
            return;
          }

          console.log(result[0].name);

          pool.getConnection(function (err, con) {
            if (err) {
              res.writeHead(400, {
                "Content-Type": "text/plain",
              });
              res.end("Db Coonection error");
            } else {
              con.query(
                "SELECT * from products where name in(" + result[0].name + ")",
                function (err, result) {
                  if (err) {
                    console.log(err);
                    return;
                  }
                  console.log(result);
                  res.writeHead(200, {
                    "Content-Type": "application/json",
                  });
                  res.end(JSON.stringify(result));
                }
              );
            }
          });
        }
      );
    }
  });
});

//start your server on port 3001
if (require.main === module) {
  app.listen(3001);
  console.log("Server Listening on port 3001");
}
