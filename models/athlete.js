let mongoose = require('mongoose');

//Article Schema
let athleteSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  lastname:{
    type: String,
    required: true
  },
  sports:{
    type: String,
    required: true
  },
  program:{
    type: String,
    required: true
  },
  year:{
    type: Number,
    required: true
  },
  medal:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  }
});

let Athlete = module.exports = mongoose.model('Athlete', athleteSchema);
