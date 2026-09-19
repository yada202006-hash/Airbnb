const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingschema=Schema({
    title:{
    type:String,
    required:true,
},

    description:String,
    image: {
    url:String,
    filename:String,
},
    price: {
    type: Number,
    required: true
},
    location:String,
    country:String,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
})

listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({review:{$in:listing.reviews}});
    }
})
const Listing=mongoose.model("Listing",listingschema);
module.exports=Listing;

