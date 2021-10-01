const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const songSchema = new Schema({
  title: String,
  image: String,
  video: String,
});

module.exports = model("Song", songSchema);
