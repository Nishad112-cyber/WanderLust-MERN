const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const listingSchema= new Schema({
    title:{ type: String,required: true},   
    description :String,
   image: {
  url: {
    type: String,
    default: "https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=1949&auto=format&fit=crop",
    set: (v) => v === "" ? 
      "https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=1949&auto=format&fit=crop"
      : v
  },
  filename: String
},



    
    price :{
      type :Number,
    required :true,
    },
    location :String,
    country :String,

})
const Listing= mongoose.model("Listing", listingSchema);
module.exports= Listing;