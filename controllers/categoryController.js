var { body, validationResult } = require('express-validator');
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
            let err = new Error('Category not found');
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
exports.category_create_get = function (req, res, next) {
    res.render('category_form', { title: 'New Category' });
};

exports.category_create_post = [
    //validate and sanitize fields
    body('name').trim().isLength({ min: 1 }).withMessage('Name must not be empty')
        .isLength({ max: 100 }).withMessage('Name must not be more than 100 characters')
        .escape(),
    body('description').trim().isLength({ min: 1 }).withMessage('Description must not be empty')
        .escape(),

    function (req, res, next) {
        var newCategory = new Category(
            {
                name: req.body.name,
                description: req.body.description
            }
        );

        var errors = validationResult(req);

        //if failed validation, render form with previous values and error messages
        if (!errors.isEmpty()) {
            res.render('category_form', { title: 'New Category', category: newCategory, errors: errors.array() });
        } else {
            //if passed validation, save category to db and redirect to new category detail page
            newCategory.save(function (err) {
                if (err) {
                    return next(err);
                }

                res.redirect(newCategory.url);
            });
        }
    }
];

//Update Category
exports.category_update_get = function (req, res, next) {
    Category.findById(req.params.id).exec(function(err, category) {
        if (err) {
            return next(err);
        }

        if (category === null) {
            let err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }

        res.render('category_form', { title: 'Update Category', category });
    });
};

exports.category_update_post = [
    //validate and sanitize fields
    body('name').trim().isLength({ min: 1 }).withMessage('Name must not be empty')
        .isLength({ max: 100 }).withMessage('Name must not be more than 100 characters')
        .escape(),
    body('description').trim().isLength({ min: 1 }).withMessage('Description must not be empty')
        .escape(),
    
    function (req, res, next) {
        var updatedCategory = new Category(
            {
                name: req.body.name,
                description: req.body.description,
                _id: req.params.id
            }
        );

        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('category_form', { title: 'Update Category', category: updatedCategory, errors: errors.array() });
        } else {
            Category.findByIdAndUpdate(req.params.id, updatedCategory, function (err, category) {
                if (err) {
                    return next(err);
                }

                res.redirect(category.url);
            });
        }
    }
];

//Delete Category
exports.category_delete_get = function (req, res, next) {
    var categoryId = req.params.id;

    Promise.all(
        [
            Category.findById(categoryId),
            Item.find({ category: categoryId })
        ]
    )
    .then(function (results) {
        var [ category, item_list ] = results;

        if (category === null) {
            let err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }

        res.render('category_delete', { title: 'Delete Category', category, item_list });
    })
    .catch(function (err) {
        return next(err);
    });  
};

exports.category_delete_post = function (req, res, next) {
    var categoryId = req.body.categoryid;

    Promise.all(
        [
            Category.findById(categoryId),
            Item.find({ category: categoryId })
        ]
    )
    .then(function (results) {
        var [ category, item_list ] = results;

        if (item_list.length > 0) {
            res.render('category_delete', { title: 'Delete Category', category, item_list });
        } else {
            Category.findByIdAndDelete(categoryId, function (err, category) {
                if (err) {
                    return next(err);
                }

                res.redirect('/catalog');
            });
        }
    })
    .catch(function (err) {
        return next(err);
    });  
};