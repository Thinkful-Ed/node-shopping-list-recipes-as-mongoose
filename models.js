// you should replace ALL of the code in this file
// with a Mongo(ose)-backed model for recipes

const uuid = require('uuid');

function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}


const Recipes = {
  create: function(name, ingredients) {
    console.log('Creating a new recipe');
    const item = {
      name: name,
      id: uuid.v4(),
      ingredients: ingredients
    };
    this.items[item.id] = item;
    return item;
  },
  get: function() {
    console.log('Retreiving recipes');
    return Object.keys(this.items).map(key => this.items[key]);
  },
  delete: function(itemId) {
    console.log(`Deleting recipe with id \`${itemId}\``);
    delete this.items[itemId];
  },
  update: function(updatedItem) {
    console.log(`Updating recipe with id \`${updatedItem.id}\``);
    const {id} = updatedItem;
    if (!(id in this.items)) {
      throw StorageException(
        `Can't update item \`${id}\` because doesn't exist.`)
    }
    this.items[updatedItem.id] = updatedItem;
    return updatedItem;
  }
};

// you won't need an equivalent function  -- we just had this here to get
// our in-memory models to work
function createRecipes() {
  const storage = Object.create(Recipes);
  storage.items = {};
  return storage;
}

// you'll need to export your `Recipe` model
module.exports = {Recipe: createRecipes()}
