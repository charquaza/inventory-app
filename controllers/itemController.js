var Item = require('../models/item');

//Display list of all Items
exports.item_list = function (req, res) {
    res.send('Item list:');
};

//Display description for specific Item
exports.item_detail = function (req, res, next) {
    var itemId = req.params.id;

    Item.findById(itemId)
        .exec(function (err, item) {
            if (err) {
                return next(err);
            }

            if (item === null) {
                var err = new Error('Item not found');
                err.status = 404;
                return next(err);
            }

            res.render('item_detail', { title: item.name, item });
        });
};

//Create Item
exports.item_create_get = function (req, res) {
    res.send('Create item?');
};

exports.item_create_post = function (req, res) {
    res.send('Item created!');
};

//Update Item
exports.item_update_get = function (req, res) {
    res.send('Update item?');
};

exports.item_update_post = function (req, res) {
    res.send('Item updated!');
};

//Delete Item
exports.item_delete_get = function (req, res) {
    res.send('Delete Item?');
};

exports.item_delete_post = function (req, res) {
    res.send('Item deleted!');
};