const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/UserModel");
const { secret } = require("../config");
const { auth } = require("../utils/passport");
auth();

login = async (msg, callback) => {
  console.log("Inside Login Post Request");
  console.log("Msg Body : ", msg.body);
  let password = msg.body.password;
  let res = {};
  Users.findOne({ email: msg.body.email }, (error, user) => {
    if (error) {
      console.log(error);
      res.status = 500;
      res.data = "Error in connecting to mongo";
      callback(null, res);
    }
    if (user) {
      bcrypt.compare(password, user.password, function (err, answer) {
        if (answer) {
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
          // const token = jwt.sign(payload, secret, {
          //   expiresIn: 1008000,
          // });
          res.status = 200;
          res.data = payload;
          // res.data = "JWT " + token;
          callback(null, res);
        } else {
          res.status = 401;
          callback(null, res);
        }
      });
    } else {
      res.status = 401;
      res.data = "Email is not registered with us";
      callback(null, res);
    }
  });
};

signup = async (msg, callback) => {
  console.log("Inside Signup Post Request");
  console.log("Msg Body : ", msg.body);
  let password = msg.body.password;
  let res = {};
  bcrypt.genSalt(10, function (err, Salt) {
    // The bcrypt is used for encrypting password.
    bcrypt.hash(password, Salt, function (err, hash) {
      if (err) {
        res.status = 500;
        res.data = "Cannot encrypt";
        callback(null, res);
      }
      hashedPassword = hash;
      console.log(hashedPassword);
      var newUser = new Users({
        name: msg.body.name,
        email: msg.body.email,
        password: hashedPassword,
      });
      Users.findOne({ email: msg.body.email }, (error, user) => {
        if (error) {
          console.log(error);
          res.status = 500;
          res.data = "Error";
          callback(null, res);
        }
        if (user) {
          res.status = 400;
          res.data = "User already exists";
          callback(null, res);
        } else {
          newUser.save((error, data) => {
            if (error) {
              res.status = 500;
              res.data = "Error";
              callback(null, res);
            } else {
              Users.findOne({ email: msg.body.email }, (error, user) => {
                if (error) {
                  res.status = 500;
                  res.data = "Error";
                  callback(null, res);
                }
                if (user) {
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
                  // const token = jwt.sign(payload, secret, {
                  //   expiresIn: 1008000,
                  // });
                  res.status = 200;
                  // res.data = "JWT " + token;
                  res.data = payload;
                  callback(null, res);
                } else {
                  res.status = 400;
                  res.data = "Error in signing up";
                  callback(null, res);
                }
              });
            }
          });
        }
      });
    });
  });
};

function handle_request(msg, callback) {
  console.log(msg);
  if (msg.path === "login") {
    login(msg, callback);
  } else if (msg.path === "signup") {
    signup(msg, callback);
  }
}

exports.handle_request = handle_request;
