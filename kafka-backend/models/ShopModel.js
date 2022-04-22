const mongoose = require("mongoose");
const { mongoDB } = require("../config");
const Schema = mongoose.Schema;

var shopSchema = new Schema(
  {
    email: { type: String, ref: "user", required: true, unique: true },
    shopname: { type: String, required: true, unique: true },
    shopimage: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/etsy-lab1.appspot.com/o/unnamed.png?alt=media&token=a2d8350a-f7e1-4f33-a3db-40f341ba35ad",
    },
  },
  {
    versionKey: false,
  }
);

const shopModel = mongoose.model("shop", shopSchema);
module.exports = shopModel;
