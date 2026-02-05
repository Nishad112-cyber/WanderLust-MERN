const mongoose= require("mongoose");
const initData= require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(async ()=>{
    console.log("mongoose connect to db ")
  await Data();
}).catch((err)=>{
    console.log(err);
})
async function main(){
   await mongoose.connect(MONGO_URL);
}


const Data = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("created db successfully : ");

}
