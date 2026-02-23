const express= require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {listingSchema, reviewSchema}= require("../schema.js");
const ExpressError= require("../utils/ExpressError/ExpressError.js");
const {isLoggedin} = require("../middleware.js");
const listingController= require("../controllers/listings.js")


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router
.route("/")
.get( wrapAsync(listingController.index))//index route
.post(isLoggedin, validateListing, wrapAsync(listingController.creatListing));//create route


// new rout 
 router.get("/new",   isLoggedin,listingController.renderNewform);


router.route("/:id")
.get(wrapAsync(listingController.showlisting))//show route
.put( 
    isLoggedin,
  wrapAsync(listingController.updatelisting))//update route
  .delete(
    isLoggedin,
    wrapAsync( listingController.deletelisting));//delete route


//edit rout 
router.get("/:id/edit",
    isLoggedin,
    wrapAsync (listingController.editlisting));

module.exports= router;