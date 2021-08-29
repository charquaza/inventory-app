var express = require('express');
var router = express.Router();

//Rerquire controller modules
var category_controller = require('../controllers/categoryController');
var item_controller = require('../controllers/itemController');

/// CATEGORY ROUTES ///

//Get list of all Categories
router.get('/', category_controller.category_list);

//Create Category
router.get('/category/create', category_controller.category_create_get);
router.post('/category/create', category_controller.category_create_post);

//Update Category
router.get('/category/:id/update', category_controller.category_update_get);
router.post('/category/:id/update', category_controller.category_update_post);

//Delete Category
router.get('/category/:id/delete', category_controller.category_delete_get);
router.post('/category/:id/delete', category_controller.category_delete_post);

//Get details for specific Category
router.get('/category/:id', category_controller.category_detail);

/// ITEM ROUTES ///

//Create Item
router.get('/item/create', item_controller.item_create_get);
router.post('/item/create', item_controller.item_create_post);

//Update Item
router.get('/item/:id/update', item_controller.item_update_get);
router.post('/item/:id/update', item_controller.item_update_post);

//Delete Item
router.get('/item/:id/delete', item_controller.item_delete_get);
router.post('/item/:id/delete', item_controller.item_delete_post);

//Get details for specific Item
router.get('/item/:id', item_controller.item_detail);

module.exports = router;