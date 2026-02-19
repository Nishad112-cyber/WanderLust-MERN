const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); // ✅ direct import, no destructuring

const userSchema = new Schema({
    username: { type: String, required: true }, // required by plugin
    email: { type: String, required: true }
});

// plugin must be a function
userSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model("User", userSchema);
