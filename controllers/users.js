const User=require("../models/user.js");

// render Signup form
module.exports.renderSignupForm=(req,res)=>{
    res.render("user/signup.ejs");
};


// Post signup
module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registerdUser=await User.register(newUser,password);
    console.log(registerdUser);
    req.login(registerdUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","user rregisterd");
        res.redirect("/listing");
    })
    }catch(err){
        req.flash("error","user already exist");
        res.redirect("/signup");
    }
};

// render login form
module.exports.renderLoginForm=(req,res)=>{
    res.render("user/login.ejs");
}

// post login
module.exports.login=async(req,res)=>{
req.flash("success","you logged in");
res.redirect(res.locals.redirectUrl || "/listing");
// res.send("logged in");
};

// logout
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you succesfully looged-out");
        res.redirect("/listing");
    })
};