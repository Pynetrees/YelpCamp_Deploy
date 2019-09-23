var mongoose = require("mongoose"),
  Comment = require("./comment");

// SCHEMA SETUP
campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  price: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

campgroundSchema.pre("remove", async function (next) {
  try {
    await Comment.deleteMany({
      "_id": {
        $in: this.comments
      }
    });
    next();
  } catch {
    next(err)
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);