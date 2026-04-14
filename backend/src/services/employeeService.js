const pool = require('../config/db');

const createEmployee = async (data) => {
  const {
    employee_code,
    full_name,
    email,
    role_title,
    department,
    location,
    availability_percent,
    active,
    notes
  } = data;

  const [result] = await pool.execute(
    `
    INSERT INTO employees (
      employee_code,
      full_name,
      email,
      role_title,
      department,
      location,
      availability_percent,
      active,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      employee_code,
      full_name,
      email,
      role_title,
      department,
      location,
      availability_percent,
      active ?? true,
      notes ?? null
    ]
  );

  return result;
};

const getEmployees = async () => {
  const [rows] = await pool.execute(`
    SELECT 
      id,
      employee_code,
      full_name,
      email,
      role_title,
      department,
      location,
      availability_percent,
      active,
      notes,
      created_at,
      updated_at
    FROM employees
    ORDER BY id DESC
  `);

  return rows;
};

const getEmployeeById = async (id) => {
  const [rows] = await pool.execute(
    `
    SELECT 
      id,
      employee_code,
      full_name,
      email,
      role_title,
      department,
      location,
      availability_percent,
      active,
      notes,
      created_at,
      updated_at
    FROM employees
    WHERE id = ?
    `,
    [id]
  );

  return rows[0] || null;
};

const updateEmployee = async (id, data) => {
  const {
    full_name,
    email,
    role_title,
    department,
    location,
    availability_percent,
    active,
    notes
  } = data;

  const [result] = await pool.execute(
    `
    UPDATE employees
    SET
      full_name = ?,
      email = ?,
      role_title = ?,
      department = ?,
      location = ?,
      availability_percent = ?,
      active = ?,
      notes = ?
    WHERE id = ?
    `,
    [
      full_name,
      email,
      role_title,
      department,
      location,
      availability_percent,
      active,
      notes,
      id
    ]
  );

  return result;
};

const deactivateEmployee = async (id) => {
  const [result] = await pool.execute(
    `
    UPDATE employees
    SET active = 0
    WHERE id = ?
    `,
    [id]
  );

  return result;
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deactivateEmployee
};