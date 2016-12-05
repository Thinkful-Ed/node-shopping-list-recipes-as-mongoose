const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');


const app = express();
// log the http layer
app.use(morgan('common'));

app.use(bodyParser.json());

const {PORT} = require('./config');
const {Recipe} = require('./models');

// manually add some recipes so we have some data
// once you update `Recipe` to use Mongoose, you'll
// need to update these
Recipe.create('chocolate milk', ['cocoa', 'milk']);
Recipe.create('grilled cheese', ['bread', 'cheese', 'buter']);

// the four CRUD routes below need to be updated to use
// Mongoose-backed `Recipe` model
app.post('/recipes', (req, res) => {
  const item = Recipe.create(req.body.name, req.body.ingredients);
  res.status(201).json(item);
});

app.get('/recipes', (req, res) => {
  res.json({recipes: Recipe.get()});
});

app.put('/recipes/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({message: message});
  }
  console.log(`Updating recipe item \`${req.params.id}\``);
  const updatedItem = Recipe.update({
    id: req.params.id,
    name: req.body.name,
    ingredients: req.body.ingredients
  });
  res.status(204).json(updatedItem);
})

// Delete recipes (by id)!
app.delete('/recipes/:id', (req, res) => {
  Recipe.delete(req.params.id);
  console.log(`Deleted shopping list item \`${req.params.ID}\``);
  res.status(204).end();
});


// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});


app.listen(PORT, () => console.log(`Your app is listening on port ${PORT}`));


module.exports = {app};
