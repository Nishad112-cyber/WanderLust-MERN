const express= require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {listingSchema, reviewSchema}= require("../schema.js");
const ExpressError= require("../utils/ExpressError/ExpressError.js");


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
router.get("/",wrapAsync(async(req,res)=>{
 const allListings=  await  Listing.find({})
 res.render("listings/index", {allListings});
}));

// new rout 
 router.get("/new", (req,res)=>{
 res.render("listings/new")   
});

//show rout 
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show", {listing});
}));

//create rout
router.post("/",
  validateListing,
  wrapAsync(async (req, res) => {
    let listingData = req.body.listing || {};

    if (!listingData.image || !listingData.image.url || listingData.image.url.trim() === "") {
      listingData.image = {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        filename: "default"
      };
    } else {
      listingData.image.filename = "user-upload";
    }
    const newlisting = new Listing(listingData);
    await newlisting.save();
    res.redirect("/listings");
  })
);


//edit rout 
router.get("/:id/edit",wrapAsync (async (req,res)=>{
      let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", {listing });
}));

// upadate rout 
router.put("/:id", 
   
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedData = req.body.listings;
    let existingListing = await Listing.findById(id);
    if (!updatedData.image.url || updatedData.image.url.trim() === "") {
        updatedData.image = existingListing.image;
    }
    await Listing.findByIdAndUpdate(id, updatedData, {
        runValidators: true,
        new:true,
    });
    res.redirect("/listings");
}));

// delete rout 
router.delete("/:id",wrapAsync( async(req,res) =>{
    let{id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports= router;