const express     = require("express"),
      router      = express.Router(),
      Post        = require("../models/post"),
      middleware  = require("../middleware");

// INDEX
// Show all posts
router.get("/", middleware.paginatedResults(Post), function(req, res){
      Post.find({}, function(err, posts){
            // console.log(posts.reverse());
            if(err){
                  console.log(err);
            } else {
                  // note to self: arguments passed into res.render must have object notation or mongoose will start bitching
                  
                  var results = res.paginatedResults;
                  res.render("posts/index", {posts: results, currentUser: req.user});
                  
            }
      });
});


// NEW
// posts/new - GET - shows new post form - no mongoose method
router.get("/new", middleware.isLoggedIn, function(req, res){
      res.render("posts/new", {currentUser: req.user});
});


// CREATE
// /posts - POST - create new post, then redirect somewhere - Post.create()
router.post("/", middleware.isLoggedIn, function(req, res){

      const newPost = {
            title: req.body.title,
            link: req.body.link,
            content: req.body.content,
            tags: req.body.tags
      }

      Post.create(newPost, function(err, newPost){
            if(err){
                  console.log(err);
                  res.render("posts/new", {currentUser: req.user});
            } else {
                  res.redirect("/posts?page=1&limit=5");
            }
      });
});


// SHOW
// /posts/:id - GET - show info about one specific post - Post.findById()
router.get("/:id", function(req, res){
      Post.findById(req.params.id, function(err, foundPost){
            if(err){
                  console.log(err);
                  res.redirect("/posts?page=1&limit=5");
            } else {
                  res.render("posts/show", {post: foundPost, currentUser: req.user});
            }
      });
});


// EDIT
// /posts/:id/edit - GET - show edit form for one post - Post.findById()
router.get("/:id/edit", middleware.isLoggedIn, function(req, res){
      Post.findById(req.params.id, function(err, foundPost){
            if(err){
                  console.log(err);
                  res.redirect("/posts?page=1&limit=5");
            } else {
                  res.render("posts/edit", {post: foundPost, currentUser: req.user});
            }
      });
});


// UPDATE
// /posts/:id - PUT - update a particular post, then redirect somewhere - Post.findByIdAndUpdate()
router.put("/:id", middleware.isLoggedIn, function(req, res){
      Post.findByIdAndUpdate(req.params.id, req.body, function(err, updatedPost){
            if(err){
                  console.log(err);
                  res.redirect("/posts?page=1&limit=5");
            } else {
                  res.redirect("/posts/" + req.params.id);
            }
      });
});


// DELETE
// /posts/:id - DELETE - delete a particular post, then redirect somewhere - Post.findByIdAndRemove()
router.delete("/:id", middleware.isLoggedIn, function(req, res){
      Post.findByIdAndRemove(req.params.id, function(err){
            if(err){
                  console.log(err);
                  res.redirect("/posts?page=1&limit=5");
            } else {
                  res.redirect("/posts?page=1&limit=5");
            }
      });
});

module.exports = router;