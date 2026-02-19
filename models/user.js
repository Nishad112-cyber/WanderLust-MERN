const mongoose = require("mongoose");
<<<<<<< HEAD
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); // ✅ direct import, no destructuring

const userSchema = new Schema({
    username: { type: String, required: true }, // required by plugin
    email: { type: String, required: true }
});

// plugin must be a function
userSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model("User", userSchema);
=======
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password :String,
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
>>>>>>> Practice
