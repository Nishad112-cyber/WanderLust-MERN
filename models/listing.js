const { ref } = require("joi");
const mongoose= require("mongoose");
const Review = require("./review.js");
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
      required:true,
    },
    location :String,
    country :String,
    reviews :[
        {
          type:Schema.Types.ObjectId,
          ref:"Review",
        },
    ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing= mongoose.model("Listing", listingSchema);
module.exports= Listing;