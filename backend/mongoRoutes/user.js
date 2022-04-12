const router = require("express").Router();
var mysql = require("mysql");
const pool = require("../db");
const Users = require("../models/UserModel");

router.get("/userprofile/:email", function (req, res) {
  console.log("Inside profile get request");
  const email = req.params.email;
  Users.findOne({ email: req.params.email }, (error, user) => {
    if (error) {
      console.log(error);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Unable to find user");
    }
    if (user) {
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Unable to find user");
    }
  });
});

//Route to handle Post Request Call
router.post("/updateprofile", function (req, res) {
  console.log("Inside Update Profile Post Request");
  console.log("Req Body : ", req.body);

  Users.findOneAndUpdate(
    { email: req.body.currentemail },
    {
      name: req.body.name,
      email: req.body.email,
      city: req.body.city,
      phone: req.body.phone,
      address: req.body.address,
      country: req.body.country,
      dob: req.body.dob,
      about: req.body.about,
      pic: req.body.image,
    }
  )
    .then((shop) => {
      if (shop) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end("Profile updated");
      } else {
        res.writeHead(400, {
          "Content-Type": "text/plain",
        });
        res.end("Profile not found");
      }
    })
    .catch((err) => {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      console.log(err);
      res.end("Profile not updated as email is registered with another user.");
    });
});

router.get("/ownerdetails/:shopname", function (req, res) {
  console.log("Inside owner details");
  const shopname = req.params.shopname;

  Users.findOne({ shopname: req.params.shopname }, (error, user) => {
    if (error) {
      console.log(error);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Unable to find user");
    }
    if (user) {
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(400, {
        "Content-Type": "text/plain",
      });
      res.end("Unable to find user");
    }
  });
});

module.exports = router;
