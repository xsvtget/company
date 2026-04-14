const express = require('express');
const router = express.Router();
const qualificationsController = require('../controllers/qualificationsController');

router.post('/', qualificationsController.createQualification);
router.put('/:id', qualificationsController.updateQualification);
router.get('/employee/:employeeId', qualificationsController.getQualificationsByEmployee);
router.get('/system/:systemId', qualificationsController.getQualificationsBySystem);
router.delete('/:id', qualificationsController.deleteQualification);

module.exports = router;