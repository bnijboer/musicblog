const express     = require("express"),
      router      = express.Router(),
      passport    = require("passport"),
      User        = require("../models/user");

//  ======
//  ROUTES
//  ======

// Root route
router.get("/", function(req, res){
      return res.render("landing", {currentUser: req.user});
});

router.get("/about", function(req, res){
      return res.render("about", {currentUser: req.user});
});

// AUTHENTICATION

// Sign up logic deactivated because I don't want other users to register for the time being.
// router.get("/signup", function(req, res){
//       return res.render("signup", {currentUser: req.user});
// });

// router.post("/signup", function(req, res){
//       const newUser =  new User({username: req.body.username});
//       // creates a new user object and stores it into the db. Password is hashed.
//       User.register(newUser, req.body.password, function(err, user){
//             if(err){
//                   console.log(err);
//                   return res.redirect("signup");
//             }

//             //logs user in, stores information and runs serializesession
//             passport.authenticate("local")(req, res, function(){
//                   return res.redirect("/posts?page=1&limit=5");
//             });
//       });
// });

router.get("/login", function(req, res){
      return res.render("login", {currentUser: req.user});
});


// note to self: middleware is handled after post route is being hit, and before handler.
// passport.authenticate takes username and password in the req.body (as send by the login form). It then compares them to the username and hashed password in the db.
router.post("/login", passport.authenticate("local", {
      successRedirect: "/posts?page=1&limit=5",
      failureRedirect: "/login"
}), function(req, res){
});

router.get("/logout", function(req, res){
      req.logout();
      return res.redirect("back");
});

module.exports = router;