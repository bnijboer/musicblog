const middlewareObj = {};

middlewareObj.sanitizeInput = function(req, res, next){
      req.body.username = req.sanitize(req.body.username);
      return next();
}

middlewareObj.isLoggedIn = function(req, res, next){
      if(req.isAuthenticated()){
            return next();
      } else {
            res.redirect("/login")
      }
}

module.exports = middlewareObj;