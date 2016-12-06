const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  name: String,
  ingredients: [String]
});

const Recipe = mongoose.model('Recipe', recipeSchema);


// you'll need to export your `Recipe` model
module.exports = {Recipe}
