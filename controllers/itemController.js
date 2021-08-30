var { body, query, validationResult } = require('express-validator');
var Category = require('../models/category');
var Item = require('../models/item');

//Display list of all Items
exports.item_list = function (req, res, next) {
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
exports.item_create_get = [
    query('categoryid').trim().escape(),

    function (req, res, next) {
        Category.findById(req.query.categoryid).exec(function (err, category) {
            if (err) {
                return next(err);
            }

            if (category === null) {
                let err = new Error('Category not found');
                err.status = 404;
                return next(err);
            }

            res.render('item_form', { title: 'New Item', category });
        });
    }
];

exports.item_create_post = [
    body('name').trim().isLength({ min: 1 }).withMessage('Name must not be empty')
        .isLength({ max: 100 }).withMessage('Name must not be more than 100 characters')
        .escape(),
    body('description').trim().isLength({ min: 1}).withMessage('Description must not be empty')
        .escape(),
    body('category').trim().isLength({ min: 1}).withMessage('Category must not be empty')
        .escape(),
    body('price').trim().isInt({ min: 0, max: 1000000 }).withMessage('Price must be between 0 and 1,000,000, inclusive')
        .escape(),
    body('number_in_stock').trim().isInt({ min: 0, max: 99 }).withMessage('Number in stock must be between 0 and 99, inclusive')
        .escape(),
    
    function (req, res, next) {
        Category.findById(req.body.category).exec(function (err, category) {
            if (err) {
                return next(err);
            }

            if (category === null) {
                let err = new Error('Category not found');
                err.status = 404;
                return next(err);
            }

            var newItem = new Item(
                {
                    name: req.body.name,
                    description: req.body.description,
                    category: req.body.category,
                    price: req.body.price,
                    number_in_stock: req.body.number_in_stock
                }
            );
    
            var errors = validationResult(req);
    
            if (!errors.isEmpty()) {
                res.render('item_form', { item: newItem, category, errors: errors.array() });
            } else {
                newItem.save(function (err, item) {
                    if (err) {
                        return next(err);
                    }
    
                    //redirect to category detail page
                    res.redirect(category.url);
                });
            }
    
        });
    }
];

//Update Item
exports.item_update_get = function (req, res, next) {
    Item.findById(req.params.id).populate('category').exec(function (err, item) {
        if (err) {
            return next(err);
        }

        if (item === null) {
            let err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }

        res.render('item_form', { title: 'Update Item', item, category: item.category });
    }); 
};

exports.item_update_post = [
    body('name').trim().isLength({ min: 1 }).withMessage('Name must not be empty')
        .isLength({ max: 100 }).withMessage('Name must not be more than 100 characters')
        .escape(),
    body('description').trim().isLength({ min: 1}).withMessage('Description must not be empty')
        .escape(),
    body('category').trim().isLength({ min: 1}).withMessage('Category must not be empty')
        .escape(),
    body('price').trim().isInt({ min: 0, max: 1000000 }).withMessage('Price must be between 0 and 1,000,000, inclusive')
        .escape(),
    body('number_in_stock').trim().isInt({ min: 0, max: 99 }).withMessage('Number in stock must be between 0 and 99, inclusive')
        .escape(),

    function (req, res, next) {
        var updatedItem = new Item(
            {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                number_in_stock: req.body.number_in_stock,
                _id: req.params.id
            }
        );

        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('item_form', { title: 'Update Form', item: updatedItem, errors: errors.array() });
        } else {
            Item.findByIdAndUpdate(req.params.id, updatedItem, function (err, item) {
                if (err) {
                    return next(err);
                }

                res.redirect(item.url);
            });
        }
    }
];

//Delete Item
exports.item_delete_get = function (req, res, next) {
    Item.findById(req.params.id).populate('category').exec(function (err, item) {
        if (err) {
            return next(err);
        }

        if (item === null) {
            let err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }

        res.render('item_delete', { title: 'Delete Item', item, category: item.category });
    });
};

exports.item_delete_post = function (req, res, next) {
    Item.findByIdAndDelete(req.params.id).populate('category').exec(function (err, item) {
        if (err) {
            return next(err);
        }

        res.redirect(item.category.url);
    });
};