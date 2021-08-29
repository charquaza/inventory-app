var Category = require('../models/category');
var Item = require('../models/item');

//Display list of all Categories
exports.category_list = function (req, res, next) {
    Category.find()
        .sort({ name: 'ascending' })
        .exec(function (err, category_list) {
            if (err) {
                return next(err);
            }

            res.render('category_list', { title: "Category List", category_list });
        });
};

//Display description and all items for specific Category
exports.category_detail = function (req, res, next) {
    var categoryId = req.params.id;

    Promise.all(
        [
            Category.findById(categoryId),
            Item.find({ category: categoryId  })
                .sort({ price: 'ascending' })
        ]
    )
    .then(function(results) {
        var [ category, item_list ] = results;

        if (category === null) {
            var err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }

        res.render('category_detail', { title: category.name, category, item_list });
    })
    .catch(function (err) {
        return next(err);
    });
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