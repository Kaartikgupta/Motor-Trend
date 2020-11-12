var campground = require("../models/campgrounds");
var comments= require("../models/comments");
var middlewareObj = {};


middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log(err);
            }
            else{
                //Error in the taught code
                if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        console.log(req.params.comment_id);
        comments.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error","Creation Not found");
                res.redirect("back");
            }
            else{
                console.log(foundComment);
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req,res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
    
}
middlewareObj.verifyAdmin = (req,res,next) => {
	if(req.user.admin){
		next();
	}else{
        req.flash("error", "You need to be logged in as Admin to do that");
        res.redirect("/login");
	}

}
module.exports = middlewareObj;