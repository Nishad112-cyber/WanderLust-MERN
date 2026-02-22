const express= require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {listingSchema, reviewSchema}= require("../schema.js");
const ExpressError= require("../utils/ExpressError/ExpressError.js");
const {isLoggedin} = require("../middleware.js");


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
 router.get("/new",   isLoggedin,(req,res)=>{
   
 res.render("listings/new.ejs");   
});


//show rout 
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)
    .populate({ path :"reviews",
        populate : {
            path : "author",
        }
    })
    .populate("owner");
    res.render("listings/show", {listing});
}));

//create route

router.post("/",
    isLoggedin,
    validateListing,
    wrapAsync(async (req, res, next) => {  
        // Copy listing data
        const listingData = { ...req.body.listing };

        // Agar image object hai (tumhare form ka structure), url ko string me set karo
        listingData.image = listingData.image?.url?.trim() || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

        const newListing = new Listing(listingData);
        await newListing.save();
        req.flash("success", "new listing created");
        res.redirect("/listings");
    })
);




//edit rout 
router.get("/:id/edit",
    isLoggedin,
    wrapAsync (async (req,res)=>{
      let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", {listing });
}));

// upadate rout 
router.put("/:id", 
    isLoggedin,
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
     req.flash("success", "listing upadated");
    res.redirect("/listings");
}));

// delete rout 
router.delete("/:id",
    isLoggedin,
    wrapAsync( async(req,res) =>{
    let{id}= req.params;
    await Listing.findByIdAndDelete(id);
     req.flash("success", "listing was deleted");
    res.redirect("/listings");
}));

module.exports= router;