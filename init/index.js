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



const Data = async () => {
    await Listing.deleteMany({});

    // Update owner properly
    const newData = initData.data.map(obj => ({
        ...obj,
        owner: '6999fd1642be0738d93fc0f1'
    }));

    // Correct insert
    const inserted = await Listing.insertMany(newData);

    // Confirm
    inserted.forEach(doc => console.log(doc._id, doc.owner));
};