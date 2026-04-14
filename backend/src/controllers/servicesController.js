const servicesService = require('../services/servicesService');

const createService = async (req, res) => {
  try {
    const result = await servicesService.createService(req.body);
    res.status(201).json({
      message: 'Service created successfully',
      serviceId: result.insertId
    });
  } catch (error) {
    console.error('createService error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await servicesService.getServices();
    res.json(services);
  } catch (error) {
    console.error('getServices error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await servicesService.getServiceById(req.params.id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('getServiceById error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const updateService = async (req, res) => {
  try {
    const result = await servicesService.updateService(req.params.id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('updateService error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const deactivateService = async (req, res) => {
  try {
    const result = await servicesService.deactivateService(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: 'Service deactivated successfully' });
  } catch (error) {
    console.error('deactivateService error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deactivateService
};