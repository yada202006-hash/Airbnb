const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}
main().then(()=>{
    console.log("DB is connected");
}).catch((err)=>{
    console.log("error is occured");
})

const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6a9ecfbf3953244a652af672"}));
    await Listing.insertMany(initData.data);
    console.log("all data saved successfully");
}

initDB();