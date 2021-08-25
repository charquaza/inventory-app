#! /usr/bin/env node

console.log('This script populates some test items and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

var Item = require('./models/item')
var Category = require('./models/category')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []
var categories = []

function categoryCreate(name, description) {
  var category = new Category({ name, description });
       
  return category.save()
    .then(() => {
        console.log('New Category: ' + category);
        categories.push(category)
    });
}

function itemCreate(name, description, price, number_in_stock, category) {
  var itemdetail = { 
    name,
    description,
    price,
    number_in_stock,
    category
  }
    
  var item = new Item(itemdetail);    

  return item.save()
    .then(() => {
        console.log('New item: ' + item);
        items.push(item)
    });
}


function createCategories(cb) {
    return Promise.all(
        [
            categoryCreate("Poké Balls", "Tools for catching Pokémon."),
            categoryCreate("Potions", "Medicine for healing Pokémon.")
        ]
    );
}


function createItems(cb) {
    return Promise.all(
        [
            itemCreate("Poké Ball", "A tool for catching wild Pokémon.", 200, 99, categories[0]),
            itemCreate("Great Ball", "A good Ball with a higher catch rate than a Poké Ball.", 600, 99, categories[0]),
            itemCreate("Ultra Ball", "A tool for catching wild Pokémon.", 1200, 10, categories[0]),
            itemCreate("Potion", "Restores the HP of a Pokémon by 20 points.", 300, 99, categories[1]),
            itemCreate("Super Potion", "Restores the HP of a Pokémon by 50 points.", 700, 30, categories[1]),
            itemCreate("Hyper Potion", "Restores the HP of a Pokémon by 200 points.", 1200, 8, categories[1])
        ]
    );
}


createCategories()
    .then(() => {
        return createItems();
    })
    .then(() => {
        console.log('Database has been populated');
    })
    .catch((err) => {
        console.log('FINAL ERR: ' + err);
    }) 
    .finally(() => {
        mongoose.connection.close();
    });



