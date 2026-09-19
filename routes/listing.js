const express =require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const {isLoggedIn}=require("../middleware.js");
const {isOwner,validatelisting}=require("../middleware.js");
const { populate } = require("../models/review.js");
const listingController=require("../controllers/listings.js");
const multer = require('multer');

require("dotenv").config();
const {storage,cloudinary}=require("../cloudConfig.js");
const upload = multer({storage});




// index route
router.get("/",wrapAsync(listingController.index));


// new route

router.get("/new",isLoggedIn,listingController.renderNewForm)


// show route
router.get("/:id",wrapAsync(listingController.showListing)
);

// create route
router.post("/",isLoggedIn, upload.single('listing[image]'),validatelisting,wrapAsync(listingController.createListing));


// Edit route
router.get("/:id/edit",isLoggedIn,isOwner,validatelisting,wrapAsync(listingController.renderEditForm));

// update route
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validatelisting,wrapAsync(listingController.updateListing))

// Delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

module.exports=router;