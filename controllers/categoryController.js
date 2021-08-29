//Display list of all Categories
exports.category_list = function (req, res) {
    res.send('Choose a category to view items.');
};

//Display description and all items for specific Category
exports.category_detail = function (req, res) {
    res.send('Category details: List all items');
};

//Create Category
exports.category_create_get = function (req, res) {
    res.send('Create category?');
};

exports.category_create_post = function (req, res) {
    res.send('Category created!');
};

//Update Category
exports.category_update_get = function (req, res) {
    res.send('Update category?');
};

exports.category_update_post = function (req, res) {
    res.send('Category updated!');
};

//Delete Category
exports.category_delete_get = function (req, res) {
    res.send('Delete category?');
};

exports.category_delete_post = function (req, res) {
    res.send('Category deleted!');
};