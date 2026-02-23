const Review = require("./models/review");   // ✅ ye line missing thi

module.exports.isLoggedin =(req,res,next) =>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "you must need to login ");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl= (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
  let { reviewId } = req.params;
  let review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect("back");
  }

  next();
};