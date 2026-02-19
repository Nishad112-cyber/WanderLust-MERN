const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup" ,(req, res) =>{
    res.render("users/signup.ejs")
})

router.post("/signup" , async (req,res,next) =>{
    try{
    let{username, email, password}= req.body;
   const newUser=  new User({email, username});
 const  registerUser=  await User.register(newUser, password);
//    console.log(registerUser);
   req.flash("success", "welocme to wanderlust ");
   res.redirect("/listings")

   } catch(err){
        console.log("🔥 SIGNUP ERROR 🔥");
        console.log(err);          // full error object
        console.log(err.stack);    // full stack trace
        next(err);
    }
});
module.exports= router;