//  =====
//  SETUP
//  =====


// DEPENDENCIES

const express                 = require("express"),
      mongoose                = require("mongoose"),
      passport                = require("passport"),
      bodyParser              = require("body-parser"),
      methodOverride          = require("method-override"),
      LocalStrategy           = require("passport-local"),
      User                    = require("./models/user"),
      passportLocalMongoose   = require("passport-local-mongoose"),
      app                     = express();


// DB CONNECT

mongoose.connect("mongodb://localhost:27017/musicblog", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});


// APP CONFIG

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


// PASSPORT CONFIGURATION

app.use(require("express-session")({
      secret: "This is a secret.",
      resave: false,
      saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MONGOOSE MODEL CONFIG

const postSchema = new mongoose.Schema({
      title: String,
      link: String,
      content: String
});

const Post = mongoose.model("Post", postSchema);



//  ======
//  ROUTES
//  ======

// AUTHENTICATION

app.get("/secret", function(req, res){
      res.send("secret");
});


app.get("/login", function(req, res){
      res.render("login");
});


app.get("/signup", function(req, res){
      res.render("signup");
});

app.post("/signup", function(req, res){
      req.body.username;
      req.body.password;

      // creates a new user object and stores it into the db. Password is hashed.
      User.register(new User({username: req.body.username}), req.body.password, function(err, user){
            if(err){
                  console.log(err);
                  return res.render("signup");
            }

            //logs user in, stores information and runs serializesession
            passport.authenticate("local")(req, res, function(){

            });
      });
      res.redirect("/posts");
});

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

      const newPost = {
            title: req.body.title,
            link: req.body.link,
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
      Post.findById(req.params.id, function(err, foundPost){
            if(err){
                  console.log(err);
                  res.redirect("/posts");
            } else {
                  res.render("edit", {post: foundPost});
            }
      });
});


// UPDATE
// /posts/:id - PUT - update a particular post, then redirect somewhere - Post.findByIdAndUpdate()
app.put("/posts/:id", function(req, res){
      Post.findByIdAndUpdate(req.params.id, req.body, function(err, updatedPost){
            if(err){
                  console.log(err);
                  res.redirect("/posts");
            } else {
                  res.redirect("/posts/" + req.params.id);
            }
      });
});


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


const port = process.env.PORT || 3000;

app.listen(port, function(){
      console.log("Served has started on port", port);
})