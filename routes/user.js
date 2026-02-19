const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup" ,(req, res) =>{
    res.render("users/signup.ejs")
})

router.post("/signup" ,
     wrapAsync(async (req,res,next) =>{
        try{

            let{username, email, password}= req.body;
           const newUser=  new User({email, username});
           const  registeredUser=  await User.register(newUser, password);
           console.log(registeredUser);
           req.flash("success", "welocme to wanderlust ");
           res.redirect("/listings")
        } catch(e){
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    

}));
module.exports= router;