const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Displayname: { type: String, required: true },  // ← Change to match frontend
  username:    { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  watchHistory: { type:String},
  bookmarks: { type: [String], default: [] },
  continueWatch: { type: [String], default: [] },
});

module.exports = mongoose.model("User_Pass1", userSchema);
