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

// Bring in Athlete Models
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
  Athlete.find({},function(err,athletes){
    if(err){
      console.log(err);
    }else{
      res.render('index',{
        title:'Athlete List',
        athletes: athletes
      });
    }
  });
});

// Route Files
let athletes = require('./routes/athletes');
app.use('/athletes',athletes);

//Start Server
app.listen(3000,function(){
  console.log('Server started on port 3000...');
});
