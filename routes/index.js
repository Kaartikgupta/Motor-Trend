var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/users");


router.get("/",function(req,res){
    res.render("landing");
});

//======================
//Auth Routes
//======================
router.get("/register", function(req,res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Ira Creations "+user.username);
           res.redirect("/creations"); 
        });
    });
});

//==========================
//Login Route
//==========================
router.get("/login", function(req,res){
    res.render("login");
});
router.get("/about", function(req, res){
    res.render("about"); 
 });
router.post("/login",passport.authenticate("local", {
    successRedirect: "/creations",
    failureRedirect: "/login"
    }) ,function(req,res){

});


//=========================
//Logout Route
//=========================
router.get("/logout",function(req,res){
    req.logOut();
    req.flash("success", "Successfully Logged You Out");
    res.redirect("/");
});



module.exports = router;