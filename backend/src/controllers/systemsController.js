const systemsService = require('../services/systemsService');

const createSystem = async (req, res) => {
  try {
    const result = await systemsService.createSystem(req.body);
    res.status(201).json({
      message: 'System created successfully',
      systemId: result.insertId
    });
  } catch (error) {
    console.error('createSystem error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const getSystems = async (req, res) => {
  try {
    const systems = await systemsService.getSystems();
    res.json(systems);
  } catch (error) {
    console.error('getSystems error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const getSystemById = async (req, res) => {
  try {
    const system = await systemsService.getSystemById(req.params.id);

    if (!system) {
      return res.status(404).json({ error: 'System not found' });
    }

    res.json(system);
  } catch (error) {
    console.error('getSystemById error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const updateSystem = async (req, res) => {
  try {
    const result = await systemsService.updateSystem(req.params.id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'System not found' });
    }

    res.json({ message: 'System updated successfully' });
  } catch (error) {
    console.error('updateSystem error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const deactivateSystem = async (req, res) => {
  try {
    const result = await systemsService.deactivateSystem(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'System not found' });
    }

    res.json({ message: 'System deactivated successfully' });
  } catch (error) {
    console.error('deactivateSystem error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

module.exports = {
  createSystem,
  getSystems,
  getSystemById,
  updateSystem,
  deactivateSystem
};