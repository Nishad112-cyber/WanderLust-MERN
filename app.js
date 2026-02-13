const express= require("express");
const path = require("path");
const app= express();
const Listing = require("./models/listing.js");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate")
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError/ExpressError.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname ,"/public")))

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

 // new rout 
 app.get("/listings/new", (req,res)=>{
 res.render("listings/new")   
});
//index rout 
app.get("/listings",wrapAsync (async(req,res)=>{
 const allListings=  await  Listing.find({})
 res.render("listings/index", {allListings});
}));

//show rout 
app.get("/listings/:id", wrapAsync (async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", {listing});
}));

//create rout
app.post("/listings",
    wrapAsync  (async(req, res, next)=>{
        if(!req.body.listing){
            throw new ExpressError(400, "send valid request");
        }
     const newlisting= new Listing(req.body.listings)
      await newlisting.save();
      res.redirect("/listings");
   })
);

//edit rout 
app.get("/listings/:id/edit",wrapAsync (async (req,res)=>{
      let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", {listing });
}));

// upadate rout 
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let updatedData = req.body.listings;
    // Old listing fetch karo
    let existingListing = await Listing.findById(id);

    // Agar image empty bheji hai to purani image hi rakho
    if (!updatedData.image || updatedData.image.trim() === "") {
        updatedData.image = existingListing.image;
    }
    await Listing.findByIdAndUpdate(id, updatedData, {
        runValidators: true,
    });
    res.redirect("/listings");
});


// delete rout 
app.delete("/listings/:id", async(req,res) =>{
    let{id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

// app.get("/testlisting",async (req,res)=>{
//     let samplelisting= new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         image:"nothing",
//         price:6000,
//         location: "goa",
//         country:"india",
//     });
//     await samplelisting.save();
//     console.log("sample test");
//     res.send("success ");
// });

// app.use((err, req,res,next) =>{
//     res.send("somthing is wrong : ")
// });
app.use( (req,res,next)=>{
    next(new  ExpressError(404, "page not found"))
})

app.use((err, req,res,next) =>{
    let {statusCode=500 ,message= "something went wrong"}= err;
    res.status(statusCode).send(message);
});

app.listen(9000, ()=>{
    console.log("server start now")
});