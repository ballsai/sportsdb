const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

mongoose.connect('mongodb://localhost/sportsdb');
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

//Check for DB error
db.on('error',function(){
  console.log(err);
});

//Init App
const app = express();

// Bring in Models
let Athlete = require('./models/athlete');

//Load View Enginge
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

// Body Parser Middleware
// parse application/x-www-form-url-encoded
app.use(bodyParser.urlencoded({extends: false}))
// parse appliction/json
app.use(bodyParser.json())

// Set Public Folder
app.use(express.static(path.join(__dirname,'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


//Home Route
app.get('/', function(req,res){
  Athlete.find({},function(err,articles){
    if(err){
      console.log(err);
    }else{
      res.render('index',{
        title:'Athlete List',
        articles: articles
      });
    }
  });
});

// Get Single Article
app.get('/article/:id',function(req,res){
  Athlete.findById(req.params.id,function(err, article){
    res.render('article',{
        article: article
      });
  });
});

//  Add Route
app.get('/articles/add',function(req,res){
  res.render('add_article',{
      title:'Add Athlete'
  });
});

// Add Submit POST Route
app.post('/articles/add',function(req,res){
  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('lastname','Lastmame is required').notEmpty();
  req.checkBody('sports','Sports is required').notEmpty();
  req.checkBody('program','Program is required').notEmpty();
  req.checkBody('year','Year is required').notEmpty();
  req.checkBody('medal','Medal is required').notEmpty();
  req.checkBody('author','Author is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_article', {
      title:'Add Athlete',
      errors:errors
    });
  } else {
    let athlete = new Athlete();
    athlete.name = req.body.name;
    athlete.lastname = req.body.lastname;
    athlete.sports = req.body.sports;
    athlete.program = req.body.program;
    athlete.year = req.body.year;
    athlete.medal = req.body.medal;
    athlete.author = req.body.author;

    athlete.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Athlete Added');
        res.redirect('/');
      }
    });
  }
});

// Load Edit Form
app.get('/article/edit/:id',function(req,res){
  Athlete.findById(req.params.id,function(err, article){
    res.render('edit_article',{
        title:'Edit Article',
        article: article
      });
  });
});

// Update Submit POST Route
app.post('/articles/edit/:id',function(req,res){
  let athlete = {};
  athlete.name = req.body.name;
  athlete.lastname = req.body.lastname;
  athlete.sports = req.body.sports;
  athlete.program = req.body.program;
  athlete.year = req.body.year;
  athlete.medal = req.body.medal;
  athlete.author = req.body.author;

  let query = {_id:req.params.id}

  Athlete.update(query,athlete,function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success','Athlete Update');
      res.redirect('/');
    }
  });
});

//
app.delete('/article/:id', function(req, res){
  let query = {_id:req.params.id}

  Athlete.remove(query,function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
    console.log('Delete success');
  });
});

//Start Server
app.listen(3000,function(){
  console.log('Server started on port 3000...');
});
