const pool = require('../config/db');

const createService = async (data) => {
  const {
    service_code,
    name,
    owner_name,
    criticality,
    min_qualified,
    preferred_qualified,
    active,
    notes
  } = data;

  const [result] = await pool.execute(
    `
    INSERT INTO services (
      service_code,
      name,
      owner_name,
      criticality,
      min_qualified,
      preferred_qualified,
      active,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      service_code,
      name,
      owner_name ?? null,
      criticality ?? 'MEDIUM',
      min_qualified ?? 1,
      preferred_qualified ?? 2,
      active ?? true,
      notes ?? null
    ]
  );

  return result;
};

const getServices = async () => {
  const [rows] = await pool.execute(`
    SELECT
      id,
      service_code,
      name,
      owner_name,
      criticality,
      min_qualified,
      preferred_qualified,
      active,
      notes,
      created_at,
      updated_at
    FROM services
    ORDER BY id DESC
  `);

  return rows;
};

const getServiceById = async (id) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      service_code,
      name,
      owner_name,
      criticality,
      min_qualified,
      preferred_qualified,
      active,
      notes,
      created_at,
      updated_at
    FROM services
    WHERE id = ?
    `,
    [id]
  );

  return rows[0] || null;
};

const updateService = async (id, data) => {
  const {
    name,
    owner_name,
    criticality,
    min_qualified,
    preferred_qualified,
    active,
    notes
  } = data;

  const [result] = await pool.execute(
    `
    UPDATE services
    SET
      name = ?,
      owner_name = ?,
      criticality = ?,
      min_qualified = ?,
      preferred_qualified = ?,
      active = ?,
      notes = ?
    WHERE id = ?
    `,
    [
      name,
      owner_name,
      criticality,
      min_qualified,
      preferred_qualified,
      active,
      notes,
      id
    ]
  );

  return result;
};

const deactivateService = async (id) => {
  const [result] = await pool.execute(
    `
    UPDATE services
    SET active = 0
    WHERE id = ?
    `,
    [id]
  );

  return result;
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deactivateService
};