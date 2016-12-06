const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');


const app = express();
// log the http layer
app.use(morgan('common'));

app.use(bodyParser.json());

const {PORT, DATABASE_URL} = require('./config');
const {Recipe} = require('./models');

app.get('/recipes', (req, res) => {
  Recipe
    .find()
    .exec()
    .then(
      // success callback
      recipes => res.json({recipes}),
      // failure callback
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      }
    )}
);

// can also request by ID
app.get('/recipes/:id', (req, res) => {
  Recipe
    .findById(req.params.id)
    .exec()
    .then(
      recipe => res.json(recipe),
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'})}
    );
});


app.post('/recipes', (req, res) => {
  const {name, ingredients} = req.body;

  Recipe
    .create({name, ingredients})
    .then(
      recipe => res.status(201).json(recipe),
      err => res.status(500).json({message: 'Internal server error'}));
});


app.put('/recipes/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  Recipe
    .findByIdAndUpdate(req.params.id, {
      name: req.body.name, ingredients: req.body.ingredients})
    .then(
      recipe => res.status(204).end(),
      err => res.status(500).json({message: 'Internal server error'}));
});

app.delete('/recipes/:id', (req, res) => {
  Recipe
    .findByIdAndRemove(req.params.id)
    .then(
      () => res.status(204).end(),
      err => res.status(500).json({message: 'Internal server error'}));
});


// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

// this function connects to our database, then starts the server
function runServer(callback) {
  mongoose.connect(DATABASE_URL, (err) => {
    if (err && callback) {
      return callback(err);
    }

    app.listen(PORT, () => {
      console.log(`Your app is listening on port ${PORT}`);
      if (callback) {
        callback();
      }
    });
  });
};

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance,
// test code) can start the server as needed.
if (require.main === module) {
  runServer(function(err) {
    if (err) {
      console.error(err);
    }
  });
};

module.exports = {app, runServer};

