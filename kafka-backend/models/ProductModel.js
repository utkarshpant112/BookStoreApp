const mongoose = require("mongoose");
const { mongoDB } = require("../config");
const Schema = mongoose.Schema;

var productSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    instock: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    shopname: { type: String, ref: "shop", required: true },
    image: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/etsy-lab1.appspot.com/o/unnamed.png?alt=media&token=a2d8350a-f7e1-4f33-a3db-40f341ba35ad",
    },
    totalsales: { type: Number, required: true, default: 0 },
  },
  {
    versionKey: false,
  }
);

const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
