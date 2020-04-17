//  =====
//  SETUP
//  =====


// DEPENDENCIES



const express                 = require("express"),
      expressSanitizer        = require ("express-sanitizer"),
      dotEnv                  = require('dotenv').config(),
      mongoose                = require("mongoose"),
      passport                = require("passport"),
      bodyParser              = require("body-parser"),
      methodOverride          = require("method-override"),
      LocalStrategy           = require("passport-local"),
      User                    = require("./models/user"),
      app                     = express();


// Requiring routes

const postRoutes  = require("./routes/posts"),
      indexRoutes = require("./routes/index");

// DB CONNECT

mongoose.connect(process.env.DATABASEURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
}).then(() => {
      console.log("Connected to MongoDB.");
}).catch(err => {
      console.log("Error:", err.message);
});;


// APP CONFIG

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressSanitizer());
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

app.use("/", indexRoutes);
app.use("/posts", postRoutes);

// =================
// SERVER CONNECTION
// =================


const port = process.env.PORT || 3000;

app.listen(port, function(){
      console.log("Served has started on port", port);
})