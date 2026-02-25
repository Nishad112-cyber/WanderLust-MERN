const mongoose= require("mongoose");
const initData= require("./data.js");
const Listing = require("../models/listing.js");

const mongoose = require("mongoose");

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => console.log("mongoose connect to db"))
  .catch(err => console.log(err));

const Data = async ()=>{
    await Listing.deleteMany({});
    initData.Data= initData.data.map((obj) =>({...obj, owner :'6999fd1642be0738d93fc0f1'}));
    await Listing.insertMany(initData.data);
    console.log("created db successfully : ");

}
