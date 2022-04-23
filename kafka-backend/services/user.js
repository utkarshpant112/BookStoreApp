const { checkAuth } = require("../utils/passport");
const { auth } = require("../Utils/passport");
const Users = require("../models/UserModel");
auth();

userprofile = async (msg, callback) => {
  console.log("Inside profile get request");
  const email = msg.params.email;
  let res = {};
  Users.findOne({ email: msg.params.email }, (error, user) => {
    if (error) {
      console.log(error);
      res.status = 500;
      res.data = "Unable to find user";
      callback(null, res);
    }
    if (user) {
      res.status = 200;
      res.data = user;
      callback(null, res);
    } else {
      res.status = 400;
      res.data = "Unable to find user";
      callback(null, res);
    }
  });
};

updateprofile = async (msg, callback) => {
  console.log("Inside Update Profile Post Request");
  console.log("Msg Body : ", msg.body);
  let res = {};
  Users.findOneAndUpdate(
    { email: msg.body.currentemail },
    {
      name: msg.body.name,
      email: msg.body.email,
      city: msg.body.city,
      phone: msg.body.phone,
      address: msg.body.address,
      country: msg.body.country,
      dob: msg.body.dob,
      about: msg.body.about,
      pic: msg.body.image,
    }
  )
    .then((shop) => {
      if (shop) {
        res.status = 200;
        res.data = "Profile updated";
        callback(null, res);
      } else {
        res.status = 400;
        res.data = "Profile not found";
        callback(null, res);
      }
    })
    .catch((err) => {
      res.status = 400;
      res.data =
        "Profile not updated as email is registered with another user.";
      callback(null, res);
    });
};

ownerdetails = async (msg, callback) => {
  console.log("Inside owner details");
  const shopname = msg.shopname;
  let res = {};
  Users.findOne({ shopname: shopname }, (error, user) => {
    if (error) {
      console.log(error);
      res.status = 500;
      res.data = "Unable to find user";
      callback(null, res);
    }
    if (user) {
      res.status = 200;
      res.data = user;
      callback(null, res);
    } else {
      res.status = 400;
      res.data = "Unable to find user";
      callback(null, res);
    }
  });
};

function handle_request(msg, callback) {
  console.log(msg);
  if (msg.path === "userprofile") {
    userprofile(msg, callback);
  } else if (msg.path === "updateprofile") {
    updateprofile(msg, callback);
  } else if (msg.path === "ownerdetails") {
    ownerdetails(msg, callback);
  }
}

exports.handle_request = handle_request;
