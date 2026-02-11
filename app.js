const express= require("express");
const path = require("path");
const app= express();
const Listing = require("./models/listing.js");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate")

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
app.get("/listings",async (req,res)=>{
 const allListings=  await  Listing.find({})
 res.render("listings/index", {allListings});
});

//show rout 
app.get("/listings/:id", async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", {listing});
})

//create rout
app.post("/listings",async (req, res)=>{
const newlisting= new Listing(req.body.listings)
  await newlisting.save();
res.redirect("/listings");
});

//edit rout 
app.get("/listings/:id/edit",async (req,res)=>{
      let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", {listing });
});

// upadate rout 
app.put("/listings/:id", async (req,res) =>{
    let {id}= req.params;
    console.log("ID:", id);
   await Listing.findByIdAndUpdate(id , {...req.body.listing});
   res.redirect("/listings")
})

// delete rout 
app.delete("/listings/:id", async (req,res) =>{
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


app.listen(9000, ()=>{
    console.log("server start now")
});