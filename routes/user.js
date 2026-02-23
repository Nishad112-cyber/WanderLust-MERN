const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport= require("passport");
const {saveRedirectUrl}= require("../middleware.js");
const {isLoggedin} = require("../middleware.js");
const userController = require("../controllers/users.js")

router.get("/signup" ,(userController.renderSignupform));

router.post("/signup" ,
<<<<<<< HEAD
     wrapAsync(userController.signup));
router.get("/login", (userController.renderloginform));
=======
     wrapAsync(async (req,res,next) =>{
        try{

            let{username, email, password}= req.body;
           const newUser=  new User({email, username});
           const  registeredUser=  await User.register(newUser, password);
           req.login(registeredUser, (err) =>{
            if(err){
              return next(err);
            }
            req.flash("success", "you are login now");
            res.redirect("/listings");
           });
          
        } catch(e){
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    

}));
router.get("/login", (req,res) =>{
    res.render("users/login.ejs")
});
>>>>>>> 0e404b59a23d96caf1918c168c9efd2ebdeb8507

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
   userController.afterlogin
);

router.get("/logout",(userController.logout) );

module.exports= router;