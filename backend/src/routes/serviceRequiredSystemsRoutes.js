const express = require('express');
const router = express.Router();
const serviceRequiredSystemsController = require('../controllers/serviceRequiredSystemsController');

router.post('/', serviceRequiredSystemsController.createLink);
router.put('/:id', serviceRequiredSystemsController.updateLink);
router.get('/service/:serviceId', serviceRequiredSystemsController.getSystemsByService);
router.get('/system/:systemId', serviceRequiredSystemsController.getServicesBySystem);
router.delete('/:id', serviceRequiredSystemsController.deleteLink);

module.exports = router;