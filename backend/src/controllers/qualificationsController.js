const qualificationsService = require('../services/qualificationsService');

const createQualification = async (req, res) => {
  try {
    const result = await qualificationsService.createQualification(req.body);
    res.status(201).json({
      message: 'Qualification created successfully',
      qualificationId: result.insertId
    });
  } catch (error) {
    console.error('createQualification error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const updateQualification = async (req, res) => {
  try {
    const result = await qualificationsService.updateQualification(req.params.id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Qualification not found' });
    }

    res.json({ message: 'Qualification updated successfully' });
  } catch (error) {
    console.error('updateQualification error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const getQualificationsByEmployee = async (req, res) => {
  try {
    const rows = await qualificationsService.getQualificationsByEmployee(req.params.employeeId);
    res.json(rows);
  } catch (error) {
    console.error('getQualificationsByEmployee error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const getQualificationsBySystem = async (req, res) => {
  try {
    const rows = await qualificationsService.getQualificationsBySystem(req.params.systemId);
    res.json(rows);
  } catch (error) {
    console.error('getQualificationsBySystem error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const deleteQualification = async (req, res) => {
  try {
    const result = await qualificationsService.deleteQualification(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Qualification not found' });
    }

    res.json({ message: 'Qualification deleted successfully' });
  } catch (error) {
    console.error('deleteQualification error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

module.exports = {
  createQualification,
  updateQualification,
  getQualificationsByEmployee,
  getQualificationsBySystem,
  deleteQualification
};