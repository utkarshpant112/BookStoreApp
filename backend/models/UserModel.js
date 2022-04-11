const mongoose = require("mongoose");
const { mongoDB } = require("../config");
const Schema = mongoose.Schema;

var usersSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    shopname: { type: String, default: "" },
    dob: { type: String, default: "" },
    country: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    about: { type: String, default: "" },
    pic: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/etsy-lab1.appspot.com/o/blank-profile-picture-973460_1280.png?alt=media&token=7127f000-8f23-447d-8587-e7a803ee957e",
    },
    phone: { type: String, default: "" },
  },
  {
    versionKey: false,
  }
);

const userModel = mongoose.model("user", usersSchema);
module.exports = userModel;
