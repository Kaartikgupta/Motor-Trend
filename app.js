const comments = require("./models/comments");

var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    campground      = require("./models/campgrounds"),
    passport        = require("passport"),
    flash           = require("connect-flash"),
    LocalStrategy   = require("passport-local"),
    methodOverrride = require("method-override"),
    User            = require("./models/users"),
    mongoose        = require("mongoose");
   // seedDB          = require("./seeds");

var commentRoutes   = require("./routes/comments"),
    campgroundRoutes= require("./routes/campgrounds"),
    indexRoutes     = require("./routes/index");

mongoose.set('useUnifiedTopology', true);
// mongoose.connect("mongodb://localhost/yelpCamp",{ useNewUrlParser: true });

//seedDB;
//mongodb+srv://Kaartik:Androidoreo5@cluster0.addl6.mongodb.net/Kaartik?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://Kaartik:Androidoreo5@cluster1.kqwaw.mongodb.net/Kaartik?retryWrites=true&w=majority",{ 
    useNewUrlParser: true,
    useCreateIndex: true
    }).then(()=>{
        console.log("Connected to db");
    }).catch(err=>{
        console.log("err", err.message);
    });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(flash());

//Passport config
app.use(require("express-session")({
    secret: "I can do this all day!!",
    resave: false,
    saveUninitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));  // check here
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverrride("_method"));
//sending req.user to every template keep the order
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);



app.listen(process.env.PORT || 3000,function(){
    console.log("Server Running");
});