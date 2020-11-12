var express = require("express");
var router = express.Router(); 
var campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middleware = require("../middleware");  // the name index.js is automatically taken


//INDEX- Show all campgrounds
router.get("/creations",function(req,res){
    campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("creations/index",{camps: campgrounds});
        }
    })
    
});


//NEW- Show form to enter new entry
router.get("/creations/new",middleware.isLoggedIn,middleware.verifyAdmin, function(req,res){
    res.render("creations/new");
})


//CREATE- Add new entry
router.post("/creations",middleware.isLoggedIn ,middleware.verifyAdmin,function(req,res){

    var name = req.body.name;
    var url = req.body.url;
    var desc = req.body.desc;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newcamp = {name : name,price: price, image: url, desc: desc, author: author};
    campground.create(newcamp, function(err, newcamp){
        if(err){
            console.log(err);
        }
        else{
            console.log(newcamp);
            res.redirect("/creations");
        }
    })
    
})

router.get("/creations/:id" ,function(req,res){
    campground.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
        if(err){
            console.log(err);
        }
        else{
          //  console.log(foundcamp);
            res.render("creations/show", {campground: foundcamp});          
        }
    });
    
});

//Edit
router.get("/creations/:id/edit",middleware.checkCampgroundOwnership, function(req,res){

        campground.findById(req.params.id, function(err, foundCampground){           
                    res.render("creations/edit", { campground: foundCampground});
        });    
});


//Update
router.put("/creations/:id",middleware.checkCampgroundOwnership, function(req,res){

    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err)
            
        }
        else{
            res.redirect("/creations/"+ req.params.id);
        }
    })
});

//Delete route
router.delete("/creations/:id",middleware.checkCampgroundOwnership, function(req,res){
    campground.findByIdAndRemove(req.params.id, function(err, campgroundRemoved){
        if(err){
            console.log(err);
        }
        //console.log(campgroundRemoved);
        Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, function(err){
            if (err) {
                console.log(err);
            }
            res.redirect("/creations");
        });
    });
});




module.exports = router;