//Display list of all Items
exports.item_list = function (req, res) {
    res.send('Item list:');
};

//Display description for specific Item
exports.item_detail = function (req, res) {
    res.send('Item details:');
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