const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: String,
  time: Number,
  difficulty: Number,
  ingredients: String,
  instructions: String
});

module.exports = mongoose.model('Recipe', recipeSchema);

