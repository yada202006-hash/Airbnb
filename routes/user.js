const express =require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const {savedRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");


// render sign up form
router.get("/signup",userController.renderSignupForm);

// signup
router.post("/signup",wrapAsync(userController.signup));

// render login form
router.get("/login",userController.renderLoginForm);

// login
router.post("/login",savedRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

// logout
router.get("/logout",userController.logout);
module.exports=router;