const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
require('dotenv').config();
// console.log(process.env);
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const {MongoStore}=require("connect-mongo");

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User=require("./models/user.js");

const listingsRoute=require("./routes/listing.js");
const reviewsRoute=require("./routes/review.js");
const userRoute=require("./routes/user.js");

const db_URL=process.env.ATLASDB_URL;
// 'mongodb://127.0.0.1:27017/wonderlust'
async function main() {
  await mongoose.connect(db_URL);

}
main().then(() => {
  console.log("DB is connected");
}).catch((err) => {
  console.error("Connection error:", err);
});


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));


const store=MongoStore.create({
    mongoUrl:db_URL,
    crypto:{
        secret:"mysupersecretcode"
    },
    touchAfter:24*3600
});

store.on("error",(error)=>{
    console.log("error in mongo store",error);
});

const sessionOptions={
    store:store,
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: new Date(Date.now() + 7*24*60*60*1000),
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

app.get("/",(req,res)=>{
    res.redirect("/listing");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.get("/demouser",async(req,res)=>{
    let fakeUser=new User({
        email:"abcd@gmail.com",
        username:"sonu"
    });
    let registeredUser=await User.register(fakeUser,"1234");
    res.send(registeredUser);
})

app.use("/listing",listingsRoute);
app.use("/listing/:id/review",reviewsRoute);
app.use("/",userRoute);




app.all("/{*splat}",(req,res,next)=>{
    next(new ExpressError("page not found",404));
});


app.use((err,req,res,next)=>{
    let {message="Something went wrong",status=500}=err;
    res.status(status).render("error.ejs",{message,status});
    // res.status(status).send(message);
})

app.listen(8080,()=>{
    console.log("server is listening")
});




// app.get("/testlisting",async(req,res)=>{
//     let samplelist=new Listing({
//         title:"My new villa",
//         description:"BY me",
//         price:1200,
//         location:"Delhi",
//         country:"India"
//     })
// await samplelist.save();
// console.log("saved");
// res.send("Succesfully sended");

// })