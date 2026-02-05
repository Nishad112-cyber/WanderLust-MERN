const express= require("express");
const app= express();
const Listing = require("./models/listing.js");
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


app.get("/", (req,res)=>{
    res.send("i am ready to get request ")

});
app.get("/testlisting",async (req,res)=>{
    let samplelisting= new Listing({
        title:"my new villa",
        description:"by the beach",
        image:"nothing",
        price:6000,
        location: "goa",
        country:"india",

    });

    await samplelisting.save();
    console.log("sample test");
    res.send("success ");

});


app.listen(9000, ()=>{
    console.log("server start now")
});