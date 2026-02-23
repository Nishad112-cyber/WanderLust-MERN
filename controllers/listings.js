const Listing= require("../models/listing")

module.exports.index= async(req,res)=>{
 const allListings=  await  Listing.find({})
 res.render("listings/index", {allListings});
};

module.exports.renderNewform= (req,res)=>{
 res.render("listings/new.ejs");   
}

module.exports.showlisting= async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)
    .populate({ path :"reviews",
        populate : {
            path : "author",
        }
    })
    .populate("owner");
    res.render("listings/show", {listing});
}

module.exports.creatListing= (async (req, res, next) => {  
        // Copy listing data
        const listingData = { ...req.body.listing };

        // Agar image object hai (tumhare form ka structure), url ko string me set karo
        listingData.image = listingData.image?.url?.trim() || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

        const newListing = new Listing(listingData);
        await newListing.save();
        req.flash("success", "new listing created");
        res.redirect("/listings");
    });

    module.exports.editlisting= async (req,res)=>{
      let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", {listing });
};

module.exports.updatelisting= async (req, res) => {
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
};

module.exports.deletelisting= async(req,res) =>{
    let{id}= req.params;
    await Listing.findByIdAndDelete(id);
     req.flash("success", "listing was deleted");
    res.redirect("/listings");
};