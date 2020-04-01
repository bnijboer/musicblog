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
      Post                    = require("./models/post")
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

//note to self: this is middleware that passes the currentUser variable to be passed to every page.
// The reason this works is that this function is called on every single route.
app.use(function(req, res, next){
      res.locals.currentUser = req.user;
      next();
})



//  ======
//  ROUTES
//  ======

// AUTHENTICATION


app.get("/login", function(req, res){
      res.render("login");
});


// note to self: middleware is handled after post route is being hit, and before handler.
// passport.authenticate takes username and password in the req.body (as send by the login form). It then compares them to the username and hashed password in the db.
app.post("/login", passport.authenticate("local", {
      successRedirect: "/posts?page=1&limit=5",
      failureRedirect: "/login"
}), function(req, res){
});

app.get("/logout", function(req, res){
      req.logout();
      res.redirect("back");
});

//Sign up logic deactivated because I don't want other users to register for the time being.
// app.get("/signup", function(req, res){
//       res.render("signup");
// });

// app.post("/signup", function(req, res){
//       req.body.username;
//       req.body.password;

//       const newUser =  new User({username: req.body.username});
//       // creates a new user object and stores it into the db. Password is hashed.
//       User.register(newUser, req.body.password, function(err, user){
//             if(err){
//                   console.log(err);
//                   return res.render("signup");
//             }

//             //logs user in, stores information and runs serializesession
//             passport.authenticate("local")(req, res, function(){
//                   res.redirect("/posts?page=1&limit=5");
//             });
//       });
// });

// LANDING
app.get("/", function(req, res){
      res.render("landing");
});

app.get("/about", function(req, res){
      res.render("about");
});

// INDEX
// Show all posts
app.get("/posts", paginatedResults(Post), function(req, res){
      
      Post.find({}, function(err, posts){
            // console.log(posts.reverse());
            if(err){
                  console.log(err);
            } else {
                  // note to self: arguments passed into res.render must have object notation or mongoose will start bitching
                  
                  var results = res.paginatedResults;
                  res.render("posts", {posts: results});
                  
            }
      });
});


// NEW
// posts/new - GET - shows new post form - no mongoose method
app.get("/posts/new", isLoggedIn, function(req, res){
      res.render("new");
});


// CREATE
// /posts - POST - create new post, then redirect somewhere - Post.create()
app.post("/posts", isLoggedIn, function(req, res){

      const newPost = {
            title: req.body.title,
            link: req.body.link,
            content: req.body.content,
            tags: req.body.tags
      }

      Post.create(newPost, function(err, newPost){
            if(err){
                  console.log(err);
                  res.render("new");
            } else {
                  res.redirect("/posts?page=1&limit=5");
            }
      });
});


// SHOW
// /posts/:id - GET - show info about one specific post - Post.findById()
app.get("/posts/:id", function(req, res){
      Post.findById(req.params.id, function(err, foundPost){
            if(err){
                  console.log(err);
                  res.redirect("/posts?page=1&limit=5");
            } else {
                  res.render("show", {post: foundPost});
            }
      });
});


// EDIT
// /posts/:id/edit - GET - show edit form for one post - Post.findById()
app.get("/posts/:id/edit", isLoggedIn, function(req, res){
      Post.findById(req.params.id, function(err, foundPost){
            if(err){
                  console.log(err);
                  res.redirect("/posts?page=1&limit=5");
            } else {
                  res.render("edit", {post: foundPost});
            }
      });
});


// UPDATE
// /posts/:id - PUT - update a particular post, then redirect somewhere - Post.findByIdAndUpdate()
app.put("/posts/:id", isLoggedIn, function(req, res){
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
app.delete("/posts/:id", isLoggedIn, function(req, res){
      Post.findByIdAndRemove(req.params.id, function(err){
            if(err){
                  console.log(err);
                  res.redirect("/posts?page=1&limit=5");
            } else {
                  res.redirect("/posts?page=1&limit=5");
            }
      });
});

// ==========
// MIDDLEWARE
// ==========

function isLoggedIn(req, res, next){
      if(req.isAuthenticated()){
            return next();
      } else {
            res.redirect("/login")
      }
}

function paginatedResults(model){
      return async (req, res, next) => {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
      
            const results = {};
      
      
      
            if(endIndex < await model.countDocuments().exec()){
                  results.next = {
                        page: page + 1,
                        limit: limit
                  }
            }
      
            if(startIndex > 0){
                  results.previous = {
                        page: page - 1,
                        limit: limit
                  }
            }

            try {
                  results.results = await model.find().limit(limit).skip(startIndex).exec();
                  res.paginatedResults = results;
                  next();
            } catch (e) {
                  res.status(500).json({ message: e.message });
            }
      }
}



// =================
// SERVER CONNECTION
// =================


const port = process.env.PORT || 3000;

app.listen(port, function(){
      console.log("Served has started on port", port);
})