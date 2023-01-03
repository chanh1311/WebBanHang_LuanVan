const express = require('express');
const router = express.Router();
const cartgoryController = require('../app/controllers/CategoryController');

router.get('/:category', cartgoryController.showByCategory);
router.get('/', cartgoryController.showByCategoryAll);

module.exports = router;
