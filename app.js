const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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
  let article = new Athlete();
  article.name = req.body.name;
  article.lastname = req.body.lastname;
  article.sports = req.body.sports;
  article.program = req.body.program;
  article.year = req.body.year;
  article.medal = req.body.medal;
  article.author = req.body.author;


  article.save(function(err){
    if(err){
      console.log(err);
      return;
    } else {
      res.redirect('/');
      console.log('Add article Success');
    }
  });
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
  let article = {};
  article.name = req.body.name;
  article.lastname = req.body.lastname;
  article.sports = req.body.sports;
  article.program = req.body.program;
  article.year = req.body.year;
  article.medal = req.body.medal;
  article.author = req.body.author;

  let query = {_id:req.params.id}

  Athlete.update(query,article,function(err){
    if(err){
      console.log(err);
      return;
    } else {
      res.redirect('/');
      console.log('Update success');
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
