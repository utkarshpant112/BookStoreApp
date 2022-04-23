//import the require dependencies
var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var kafka = require("./kafka/client");
const router = require("express").Router();

app.set("view engine", "ejs");

//use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(bodyParser.json());

//use express static folder
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));

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

// const { mongoDB } = require("./config");
// const mongoose = require("mongoose");
// require("./models/UserModel");
// require("./models/ShopModel");
// require("./models/ProductModel");
// require("./models/CategoryModel");

// var options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   maxpoolSize: 500,
// };

// mongoose.connect(mongoDB, options, (err, res) => {
//   if (err) {
//     console.log(err);
//     console.log(`MongoDB Connection Failed`);
//   } else {
//     console.log(`MongoDB Connected`);
//   }
// });

const authRoute = require("./kafkaRoutes/auth");
const productRoute = require("./kafkaRoutes/product");
const userRoute = require("./kafkaRoutes/user");
const shopRoute = require("./kafkaRoutes/shop");
const orderRoute = require("./kafkaRoutes/order");
const favoriteRoute = require("./kafkaRoutes/favorite");

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/user", userRoute);
app.use("/api/shop", shopRoute);
app.use("/api/order", orderRoute);
app.use("/api/favorite", favoriteRoute);

//start your server on port 3001
if (require.main === module) {
  app.listen(3001);
  console.log("Server Listening on port 3001");
}
