const express     = require("express"),
      router      = express.Router(),
      Post        = require("../models/post"),
      middleware  = require("../middleware"),
      scripts     = require("../scripts/scripts");

// INDEX
// Show all posts
router.get("/", function(req, res){
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const results = {};

            // if endIndex is larger than or equal to the amount of posts, the if-statement doesn't trigger, results.next is undefined and the next button won't show up
            Post.countDocuments({}, function(err, postCount){
                  if(endIndex < postCount){
                        results.last = {
                              page: Math.ceil(postCount/limit),
                              limit: limit
                        }
                        results.next = {
                              page: page + 1,
                              limit: limit
                        }
                  }
            });

            if(startIndex > 0){
                  results.previous = {
                        page: page - 1,
                        limit: limit
                  }
            }

            Post.find({}, function(err, posts){
                  results.paginatedResults = posts;
                  return res.render("posts/index", {posts: results, currentUser: req.user});
            }).sort({dateISO: -1}).limit(limit).skip(startIndex).exec();
});


// NEW
// posts/new - GET - shows new post form - no mongoose method
router.get("/new", middleware.isLoggedIn, function(req, res){
      return res.render("posts/new", {currentUser: req.user});
});


// CREATE
// /posts - POST - create new post, then redirect somewhere - Post.create()
router.post("/", middleware.isLoggedIn, function(req, res){

      const newPost = {
            title: req.body.title,
            artist: req.body.artist,
            link: req.body.link,
            content: req.body.content,
            tags: req.body.tags,
            author: req.user.username,
            datePosted: scripts.fetchDate(),
            dateISO: Date.now()
      }

      Post.create(newPost, function(err, newPost){
            if(err){
                  console.log(err);
                  return res.render("posts/new", {currentUser: req.user});
            } else {
                  return res.redirect("/posts?page=1&limit=5");
            }
      });
});


// SHOW
// /posts/:id - GET - show info about one specific post - Post.findById()
router.get("/:id", function(req, res){
      Post.findById(req.params.id, function(err, foundPost){
            if(err){
                  console.log(err);
                  return res.redirect("/posts?page=1&limit=5");
            } else {
                  return res.render("posts/show", {post: foundPost, currentUser: req.user});
            }
      });
});




// EDIT
// /posts/:id/edit - GET - show edit form for one post - Post.findById()
router.get("/:id/edit", middleware.isLoggedIn, function(req, res){
      Post.findById(req.params.id, function(err, foundPost){
            if(err){
                  console.log(err);
                  return res.redirect("/posts?page=1&limit=5");
            } else {
                  return res.render("posts/edit", {post: foundPost, currentUser: req.user});
            }
      });
});


// UPDATE
// /posts/:id - PUT - update a particular post, then redirect somewhere - Post.findByIdAndUpdate()
router.put("/:id", middleware.isLoggedIn, function(req, res){
      Post.findByIdAndUpdate(req.params.id, req.body, function(err, updatedPost){
            if(err){
                  console.log(err);
                  return res.redirect("/posts?page=1&limit=5");
            } else {
                  return res.redirect("/posts/" + req.params.id);
            }
      });
});


// DELETE
// /posts/:id - DELETE - delete a particular post, then redirect somewhere - Post.findByIdAndRemove()
router.delete("/:id", middleware.isLoggedIn, function(req, res){
      Post.findByIdAndRemove(req.params.id, function(err){
            if(err){
                  console.log(err);
                  return res.redirect("/posts?page=1&limit=5");
            } else {
                  return res.redirect("/posts?page=1&limit=5");
            }
      });
});

module.exports = router;