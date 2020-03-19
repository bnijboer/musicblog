//  =====
//  SETUP
//  =====


// DEPENDENCIES

const express           = require("express"),
      bodyParser        = require("body-parser"),
      mongoose          = require("mongoose"),
      methodOverride    = require("method-override"),
      app               = express();


// DB CONNECT

mongoose.connect("mongodb://localhost/musicblog", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});


// APP CONFIG

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


// MONGOOSE MODEL CONFIG

const postSchema = new mongoose.Schema({
      content: String
});

const Post = mongoose.model("Post", postSchema);



//  ======
//  ROUTES
//  ======


// LANDING
app.get("/", function(req, res){
      res.render("home");
});


// INDEX
// Show all posts
app.get("/posts", function(req, res){
      Post.find({}, function(err, posts){
            if(err){
                  console.log(err);
            } else {
                  res.render("posts", {posts: posts});
            }
      });
});


// NEW
// posts/new - GET - shows new post form - no mongoose method
app.get("/posts/new", function(req, res){
      res.render("new");
});

// CREATE
// /posts - POST - create new post, then redirect somewhere - Post.create()
app.post("/posts", function(req, res){

      var newPost = {
            content: req.body.content
      }

      Post.create(newPost, function(err, newPost){
            if(err){
                  console.log(err);
                  res.render("new");
            } else {
                  res.redirect("/posts");
            }
      });
});

// SHOW
// /posts/:id - GET - show info about one specific post - Post.findById()
app.get("/posts/:id", function(req, res){
      Post.findById(req.params.id, function(err, foundPost){
            if(err){
                  console.log(err);
                  res.redirect("/posts");
            } else {
                  res.render("show", {post: foundPost});
            }
      });
});


// EDIT
// /posts/:id/edit - GET - show edit form for one post - Post.findById()
app.get("/posts/:id/edit", function(req, res){
      Post.findOneAndDelete(req.params._id, function(err, foundPost){
            if(err){
                  console.log(err);
            } else {
                  res.render("edit", {posts: foundPost});
            }
      });
});

// UPDATE
// /posts/:id - PUT - update a particular post, then redirect somewhere - Post.findByIdAndUpdate()
// app.get("/posts/:id", function(req, res){
//       Post.findByIdAndUpdate(req.params.id, function(err, foundPost){
//             if(err){
//                   console.log(err);
//             } else {
//                   res.render("edit", {posts: foundPost});
//             }
//       });
// });


// DELETE
// /posts/:id - DELETE - delete a particular post, then redirect somewhere - Post.findByIdAndRemove()
app.delete("/posts/:id", function(req, res){
      Post.findByIdAndRemove(req.params.id, function(err){
            if(err){
                  console.log(err);
                  res.redirect("/posts");
            } else {
                  res.redirect("/posts");
            }
      });
});


// =================
// SERVER CONNECTION
// =================


var port = process.env.PORT || 3000;

app.listen(port, function(){
      console.log("Served has started on port", port);
})