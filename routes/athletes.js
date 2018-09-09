const express = require('express');
const router = express.Router();

// Bring in Athlete Models
let Athlete = require('../models/athlete');

//  Add Route
router.get('/add',function(req,res){
  res.render('add_athlete',{
      title:'Add Athlete'
  });
});

// Add Submit POST Route
router.post('/add',function(req,res){
  /*req.checkBody('name','Name is required').notEmpty();
  req.checkBody('lastname','Lastmame is required').notEmpty();
  req.checkBody('sports','Sports is required').notEmpty();
  req.checkBody('program','Program is required').notEmpty();
  req.checkBody('year','Year is required').notEmpty();
  req.checkBody('medal','Medal is required').notEmpty();
  req.checkBody('author','Author is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_athlete', {
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

    athlete.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Athlete Added');
        res.redirect('/');
      }
    });
  }*/
  let athlete = new Athlete();
  athlete.name = req.body.name;
  athlete.lastname = req.body.lastname;
  athlete.sports = req.body.sports;
  athlete.program = req.body.program;
  athlete.year = req.body.year;
  athlete.medal = req.body.medal;

  athlete.save(function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success','Athlete Added');
      res.redirect('/');
    }
  });
});

// Load Edit Form
router.get('/edit/:id',function(req,res){
  Athlete.findById(req.params.id,function(err, athlete){
    res.render('edit_athlete',{
        title:'Edit athlete',
        athlete: athlete
      });
  });
});

// Update Submit POST Route
router.post('/edit/:id',function(req,res){
  let athlete = {};
  athlete.name = req.body.name;
  athlete.lastname = req.body.lastname;
  athlete.sports = req.body.sports;
  athlete.program = req.body.program;
  athlete.year = req.body.year;
  athlete.medal = req.body.medal;

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

// Delete athlete
router.delete('/:id', function(req, res){
  let query = {_id:req.params.id}

  Athlete.remove(query,function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
    console.log('Delete success');
  });
});

// Get Single athlete
router.get('/:id',function(req,res){
  Athlete.findById(req.params.id,function(err, athlete){
    res.render('athlete',{
        athlete: athlete
      });
  });
});

module.exports = router;
