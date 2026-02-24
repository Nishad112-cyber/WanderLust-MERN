const mongoose= require("mongoose");
const initData= require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL= "mongodb+srv://nishadguptad_db_user:dYQvyK8BNrnOrMac@wanderlust.ftkvfx6.mongodb.net/?appName=Wanderlust";

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
    initData.Data= initData.data.map((obj) =>({...obj, owner :'6999fd1642be0738d93fc0f1'}));
    await Listing.insertMany(initData.data);
    console.log("created db successfully : ");

}
