const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport= require("passport");
const {saveRedirectUrl}= require("../middleware.js");
const {isLoggedin} = require("../middleware.js");
const userController = require("../controllers/users.js")


router.route("/signup")
.get(userController.renderSignupform)
.post(
  wrapAsync(async (req, res, next) => {
    try {
      let { username, email, password } = req.body;

      // ✅ only allowed admin credentials
      const allowedUsername = "DileepNishadg";
      const allowedEmail = "nishadguptad@gmail.com";
        const allowedPassword = "Nishad!@56d";  


      if (username !== allowedUsername || email !== allowedEmail) {
        req.flash("error", "Signup not allowed");
        return res.redirect("/signup");
      }
       if (password !== allowedPassword) {   // 👈 yaha add karo
        req.flash("error", "Signup not allowed");
        return res.redirect("/signup");
      }

      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);

      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "You are logged in now");
        res.redirect("/listings");
      });

    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.route("/login")
.get((req, res) => {
  res.render("users/login.ejs");
})
.post(
  saveRedirectUrl,

  // ✅ allow only admin username
  (req, res, next) => {
    if (req.body.username !== "admin") {
      req.flash("error", "Invalid credentials");
      return res.redirect("/login");
    }
    next();
  },

  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),

  userController.afterlogin
);

router.get("/logout",(userController.logout) );

module.exports= router;