const mongoose = require("mongoose");
const { mongoDB } = require("../config");
const Schema = mongoose.Schema;

var categorySchema = new Schema(
  {
    value: { type: String, required: true, unique: true },
    label: { type: String, required: true, unique: true },
  },
  {
    versionKey: false,
  }
);

const categoryModel = mongoose.model("category", categorySchema);
module.exports = categoryModel;
