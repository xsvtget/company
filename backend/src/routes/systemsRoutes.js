const express = require('express');
const router = express.Router();
const systemsController = require('../controllers/systemsController');

router.post('/', systemsController.createSystem);
router.get('/', systemsController.getSystems);
router.get('/:id', systemsController.getSystemById);
router.put('/:id', systemsController.updateSystem);
router.patch('/:id/deactivate', systemsController.deactivateSystem);

module.exports = router;