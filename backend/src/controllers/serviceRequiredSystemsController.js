const serviceRequiredSystemsService = require('../services/serviceRequiredSystemsService');

const createLink = async (req, res) => {
  try {
    const result = await serviceRequiredSystemsService.createLink(req.body);
    res.status(201).json({
      message: 'Service-system link created successfully',
      linkId: result.insertId
    });
  } catch (error) {
    console.error('createLink error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const updateLink = async (req, res) => {
  try {
    const result = await serviceRequiredSystemsService.updateLink(req.params.id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service-system link not found' });
    }

    res.json({ message: 'Service-system link updated successfully' });
  } catch (error) {
    console.error('updateLink error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const getSystemsByService = async (req, res) => {
  try {
    const rows = await serviceRequiredSystemsService.getSystemsByService(req.params.serviceId);
    res.json(rows);
  } catch (error) {
    console.error('getSystemsByService error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const getServicesBySystem = async (req, res) => {
  try {
    const rows = await serviceRequiredSystemsService.getServicesBySystem(req.params.systemId);
    res.json(rows);
  } catch (error) {
    console.error('getServicesBySystem error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const deleteLink = async (req, res) => {
  try {
    const result = await serviceRequiredSystemsService.deleteLink(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service-system link not found' });
    }

    res.json({ message: 'Service-system link deleted successfully' });
  } catch (error) {
    console.error('deleteLink error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

module.exports = {
  createLink,
  updateLink,
  getSystemsByService,
  getServicesBySystem,
  deleteLink
};