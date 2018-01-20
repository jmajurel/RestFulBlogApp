var express          = require("express"),
    app              = express(),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose");

//APP CONFIG
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

//DB CONFIG
mongoose.connect("mongodb://localhost/rest_ful_blogapp");

var blogSchema = mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now()}
});

var Blog = mongoose.model("Blog", blogSchema);

//Fill Database with first blog post
/*var firstPost = new Blog( {
  title: "Star Wars - The Last Jedi",
  image: "https://i0.wp.com/media2.slashfilm.com/slashfilm/wp/wp-content/images/star-wars-the-last-jedi-poe-rey-and-finn1.jpg",
  body: "The Last Jedi is awesome, I would recommend it to you guys. Light Saber fights are pretty well done. May the force be with you"
});

firstPost.save(function(err,data){
  if(err) {
    console.log(err);
  } else {
    console.log(data);
  }
});*/

//ROUTES
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

//INDEX
app.get("/blogs", (req, res) => {
  Blog.find({}, function(err, blogs) {
    if(err){
      console.log(err);
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

//CREATE
app.post("/blogs", (req, res) => {

  req.body.post.body = expressSanitizer(req.body.post.body);
  Blog.create(req.body.post, function(err, data){
    if(err) {
      res.redirect("/blogs/new");
    } else {
      res.redirect("/blogs");
    }
  }); 
});

//NEW
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

//SHOW
app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, function(err, data){
    if(err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {post: data});
    }
  }); 
});

//EDIT
app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, data) {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", {post: data}); 
    }
  });
});

//UPDATE
app.put("/blogs/:id", function(req, res) {

  req.body.post.body = req.sanitize(req.body.post.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.post, function(err, data) {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });  
});

//DELETE
app.delete("/blogs/:id", function(req, res) {
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(3000, () => {
  console.log("Server is listening on Port 3000");
});

