const { ApolloServer, gql } = require("apollo-server");
const { secret } = require("./config");
const { auth } = require("./utils/passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const typeDefs = require("./typeDefs");
// const resolvers = require("./resolvers");

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
      const new1User = {
        email: email,
        name: name,
        password: password,
      };
      const newUser = new users({
        email: email,
        name: name,
        password: password,
      });

      const response = await newUser.save();

      if (response) {
        console.log("user created", response);
        const token = jwt.sign(new1User, secret, {
          expiresIn: 1008000,
        });
        console.log("jwt", token);
        const returnUser = {
          _id: response._id,
          email: response.email,
          token: "JWT " + token,
        };
        // console.log("data", returnUser);
        return returnUser;
      } else {
        console.log("user not created");
      }
    },
    loginUser: async (parent, { email, password }, context) => {
      console.log("here");
      let inputPassword = password;
      users.findOne({ email: email }, (error, user) => {
        if (error) {
        }
        if (user) {
          if (user.password === inputPassword) {
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
            const token = jwt.sign(payload, secret, {
              expiresIn: 1008000,
            });
            const returnUser = {
              token: "JWT " + token,
            };
            console.log(returnUser);
            return returnUser;
          }
        } else {
        }
      });
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
