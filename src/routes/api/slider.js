const express = require('express');
const router = express.Router();
const SliderController = require('../../app/controllers/api/SliderController');

router.get('/show', SliderController.show);

module.exports = router;
