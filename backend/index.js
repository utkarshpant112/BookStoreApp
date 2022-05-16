//import the require dependencies
var express = require("express");
var app = express();

const { ApolloServer, gql } = require("apollo-server");
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require("cors");
// var kafka = require("./kafka/client");
const router = require("express").Router();
const { auth } = require("./utils/passport");
const bcrypt = require("bcryptjs");
const { secret } = require("./config");
const jwt = require("jsonwebtoken");

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

const users = require("./models/UserModel");

const { mongoDB } = require("./config");
const mongoose = require("mongoose");
require("./models/UserModel");
require("./models/ShopModel");
require("./models/ProductModel");
require("./models/CategoryModel");

var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxpoolSize: 500,
};

mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log(`MongoDB Connection Failed`);
  } else {
    console.log(`MongoDB Connected`);
  }
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

const authRoute = require("./mongoRoutes/auth");
const productRoute = require("./mongoRoutes/product");
const userRoute = require("./mongoRoutes/user");
const shopRoute = require("./mongoRoutes/shop");
const orderRoute = require("./mongoRoutes/order");
const favoriteRoute = require("./mongoRoutes/favorite");

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/user", userRoute);
app.use("/api/shop", shopRoute);
app.use("/api/order", orderRoute);
app.use("/api/favorite", favoriteRoute);

const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    name: String!
    password: String!
    shopname: String!
    dob: String!
    address: String!
    city: String!
    country: String!
    about: String!
    pic: String!
    phone: String!
    token: String!
  }

  type Product {
    _id: ID!
    name: String!
    price: Float!
    instock: Int!
    category: String!
    description: String!
    shopname: String!
    image: String!
    totalsales: Int!
  }

  type Query {
    users: [User]
  }
  type Mutation {
    addUser(email: String!, name: String!, password: String!): User
    loginUser(email: String!, password: String!): User
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      return users;
    },
  },
  Mutation: {
    addUser: async (parent, { email, name, password }, context) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const response = await users.findOne({
        email: email,
      });
      console.log(response);
      if (response === null) {
        console.log("here");
        var newUser = new users({
          name: name,
          email: email,
          password: hashedPassword,
        });
        console.log(newUser);
        const user = await newUser.save();
        console.log(user);
        const payload = {
          _id: user._id,
          name: user.name,
          email: user.email,
          shopname: user.shopname,
          dob: user.dob,
          country: user.country,
          address: user.address,
          city: user.city,
          about: user.about,
          pic: user.pic,
          phone: user.phone,
        };
        console.log(payload);
        console.log("user created", response);
        const token = jwt.sign(payload, secret, {
          expiresIn: 1008000,
        });
        console.log("jwt", token);
        const returnUser = {
          token: "JWT " + token,
        };
        // console.log("data", returnUser);
        return returnUser;
      }
    },
    loginUser: async (parent, { email, password }, context) => {
      console.log("here");
      let inputPassword = password;
      const response = await users.findOne({
        email: email,
      });
      const result = await bcrypt.compare(password, response.password);
      if (result) {
        const payload = {
          _id: response._id,
          name: response.name,
          email: response.email,
          shopname: response.shopname,
          dob: response.dob,
          country: response.country,
          address: response.address,
          city: response.city,
          about: response.about,
          pic: response.pic,
          phone: response.phone,
        };
        const token = jwt.sign(payload, secret, {
          expiresIn: 1008000,
        });
        const returnUser = {
          token: "JWT " + token,
        };
        console.log(returnUser);
        return returnUser;
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { session: { id: 1 } };
  },
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

//start your server on port 3001
if (require.main === module) {
  app.listen(3001);
  console.log("Server Listening on port 3001");
}
