const mongoose = require("mongoose");
const { mongoDB } = require("../config");
const Schema = mongoose.Schema;

var favoritesSchema = new Schema(
  {
    name: { type: String, ref: "product", required: true },
    email: { type: String, ref: "user", required: true },
    shopname: { type: String, ref: "shop", required: true },
  },
  {
    versionKey: false,
  }
);

const favoritesModel = mongoose.model("favorites", favoritesSchema);
module.exports = favoritesModel;
