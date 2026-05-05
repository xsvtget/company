const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');

router.post('/', servicesController.createService);
router.get('/', servicesController.getServices);
router.get('/:id/drilldown', servicesController.getServiceDrilldown);
router.get('/:id', servicesController.getServiceById);
router.put('/:id', servicesController.updateService);
router.patch('/:id/deactivate', servicesController.deactivateService);

module.exports = router;
