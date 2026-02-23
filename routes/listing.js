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

//index rout 
router.get("/", wrapAsync(listingController.index));

// new rout 
 router.get("/new",   isLoggedin,listingController.renderNewform);


//show rout 
router.get("/:id", wrapAsync(listingController.showlisting));

//create route

router.post("/", isLoggedin, validateListing, wrapAsync(listingController.creatListing));

//edit rout 
router.get("/:id/edit",
    isLoggedin,
    wrapAsync (listingController.editlisting));

// upadate rout 
router.put("/:id", 
    isLoggedin,
  wrapAsync(listingController.updatelisting));

// delete rout 
router.delete("/:id",
    isLoggedin,
    wrapAsync( listingController.deletelisting));

module.exports= router;