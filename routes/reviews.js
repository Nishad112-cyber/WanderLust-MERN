const express= require("express");
const router= express.Router({mergeParams:true});

const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError/ExpressError.js");
const Listing = require("../models/listing.js");
const { reviewSchema}= require("../schema.js")
const Review = require("../models/review.js");
const {isLoggedin} = require("../middleware.js");
const {isReviewAuthor} = require("../middleware.js");
const reviewsController= require("../controllers/reviews.js")


const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//post reviews

router.post("/",
    isLoggedin,
     validateReview ,
     wrapAsync(reviewsController.creatReviews));

//delete review rout
router.delete("/:reviewId",
    isLoggedin,
     isReviewAuthor ,
     wrapAsync(reviewsController.deletereviews));

module.exports= router;