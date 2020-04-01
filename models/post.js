const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
      title: String,
      link: String,
      content: String,
      tags: String
});

module.exports = mongoose.model("Post", postSchema);