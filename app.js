const express= require("express");
const path = require("path");
const app= express();
const Listing = require("./models/listing.js");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate")
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError/ExpressError.js");
const {listingSchema, reviewSchema}= require("./schema.js")

const Review = require("./models/review.js");

const listings= require("./routes/listing.js")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname ,"/public")));

const mongoose = require("mongoose");


const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("mongoose connect to db ")
}).catch((err)=>{
    console.log(err);
})
async function main(){
   await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req,res)=>{
    res.send("i am ready to get request ")

});
 

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};






app.use("/listings" ,listings);

//reviews
//post
app.post("/listings/:id/reviews", validateReview ,wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//delete review rout
app.delete("/listings/:id/review/:reviewId", wrapAsync(async(req,res)=>{
    let {id , reviewId} =req.params;

    await Listing.findByIdAndUpdate(id,{$pull :{reviews :reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

app.use( (req,res,next)=>{
    next(new  ExpressError(404, "page not found"))
})

app.use((err, req,res,next) =>{
    let {statusCode=500 ,message= "something went wrong"}= err;
    res.status(statusCode).render("listings/errors" , {statusCode, message});
    
});

app.listen(9000, ()=>{
    console.log("server start now")
});