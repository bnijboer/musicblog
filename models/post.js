const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
      title: String,
      link: String,
      content: String,
      tags: String,
      author: String,
      datePosted: String,
      dateISO: Date
});

module.exports = mongoose.model("Post", postSchema);