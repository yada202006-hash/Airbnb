const Listing=require("../models/listing.js");
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});

// index route
module.exports.index=async(req,res)=>{
    const alllisting=await Listing.find({})
    res.render("listings/index.ejs",{alllisting});
};
// new form render

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs")
};

// show all Listing
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    
    res.render("listings/show.ejs",{listing});
};

// post listing
module.exports.createListing = async (req, res, next) => {

    console.log("BODY:", req.body);

    if (!req.file) {
        req.flash("error", "No file uploaded");
        return res.redirect("/listing/new");
    }

    const location = req.body.listing.location;

    if (!location) {
        req.flash("error", "Location is required");
        return res.redirect("/listing/new");
    }

    let response = await geocodingClient.forwardGeocode({
        query: location,
        limit: 1,
    }).send();

    console.log(response.body.features[0].geometry);

    let url = req.file.path;
    let filename = req.file.filename;

    const newlist = new Listing(req.body.listing);

    newlist.owner = req.user._id;
    newlist.image = {
        url,
        filename
    };

    newlist.geometry = response.body.features[0].geometry;

    await newlist.save();

    req.flash("success", "New listing created");
    res.redirect("/listing");
};

// render edit form
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
       if(!listing){
        req.flash("error","This listing not exists");
        return res.redirect("/listing/:id/edit");
    }
    res.render("listings/edit.ejs",{listing});
};

// update Listing
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;

    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url,filename};
    await listing.save();
    };
    req.flash("success","listing updated");
    res.redirect(`/listing/${id}`);
};

// delete Listing
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    const dellist=await Listing.findByIdAndDelete(id);
    console.log(dellist);
    req.flash("success","listing Deleted");
    res.redirect("/listing");
};