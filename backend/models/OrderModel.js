const mongoose = require("mongoose");
const { mongoDB } = require("../config");
const Schema = mongoose.Schema;

var orderSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    dateofpurchase: { type: String, required: true },
    customeremail: { type: String, required: true },
    currency: { type: String, required: true },
    shopname: { type: String, required: true },
    image: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
