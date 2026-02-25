const express= require("express");
const path = require("path");
const app= express();
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate")
const ExpressError= require("./utils/ExpressError/ExpressError.js");

const listingRouter= require("./routes/listing.js");
const reviewsRouter= require("./routes/reviews.js");
const userRouter= require("./routes/user.js");

const session = require("express-session");
const flash= require("connect-flash");

const passport= require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user.js");



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname ,"/public")));


const mongoose = require("mongoose");

const MONGO_URL ="mongodb+srv://nishadguptad_db_user:dYQvyK8BNrnOrMac@wanderlust.ftkvfx6.mongodb.net/wanderlust?retryWrites=true&w=majority"

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => console.log("mongoose connect to db"))
  .catch(err => console.log(err));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



 

const sessionOptions= {
    secret:"mysupersecratecode",
    resave:false,
    saveUninitialized :true,
    cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true,
  },
};

app.get("/", (req,res)=>{
    res.redirect("/listings");
});


app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser= req.user;
    next();
});

app.use("/listings" ,listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/" ,userRouter);

app.use( (req,res,next)=>{
    next(new  ExpressError(404, "page not found"))
})
app.use((err, req,res,next) =>{
    let {statusCode=500 ,message= "something went wrong"}= err;
    res.status(statusCode).render("listings/errors" , {statusCode, message});
    
});


const PORT = process.env.PORT || 9000;

app.listen(PORT, ()=>{
    console.log("server start now");
});