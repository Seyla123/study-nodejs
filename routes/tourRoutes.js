const express = require('express');

const router = express.Router();
const tourController = require('../controllers/tourController');

//router.param('id', tourController.checkId);
//for checking body mongoose will take care for us
router.route('/').get(tourController.getAllTours).post(tourController.addTour);

router.route('/:id').get(tourController.getTour).delete(tourController.deleteTour).patch(tourController.updateTour);

module.exports = router;
