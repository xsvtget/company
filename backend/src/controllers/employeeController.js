const employeeService = require('../services/employeeService');

const createEmployee = async (req, res) => {
  try {
    const result = await employeeService.createEmployee(req.body);
    res.status(201).json({
      message: 'Employee created successfully',
      employeeId: result.insertId
    });
  } catch (error) {
    console.error('createEmployee error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await employeeService.getEmployees();
    res.json(employees);
  } catch (error) {
    console.error('getEmployees error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('getEmployeeById error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const result = await employeeService.updateEmployee(req.params.id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('updateEmployee error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

const deactivateEmployee = async (req, res) => {
  try {
    const result = await employeeService.deactivateEmployee(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deactivated successfully' });
  } catch (error) {
    console.error('deactivateEmployee error:', error);
    res.status(500).json({
      error: error.message || 'Unknown server error',
      code: error.code || null,
      sqlMessage: error.sqlMessage || null
    });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deactivateEmployee
};