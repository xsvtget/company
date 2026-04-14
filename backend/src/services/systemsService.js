const pool = require('../config/db');

const createSystem = async (data) => {
  const {
    system_code,
    name,
    owner_name,
    business_owner,
    technical_owner,
    environment,
    sensitivity,
    active,
    notes
  } = data;

  const [result] = await pool.execute(
    `
    INSERT INTO systems (
      system_code,
      name,
      owner_name,
      business_owner,
      technical_owner,
      environment,
      sensitivity,
      active,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      system_code,
      name,
      owner_name ?? null,
      business_owner ?? null,
      technical_owner ?? null,
      environment ?? 'PROD',
      sensitivity ?? 'MEDIUM',
      active ?? true,
      notes ?? null
    ]
  );

  return result;
};

const getSystems = async () => {
  const [rows] = await pool.execute(`
    SELECT
      id,
      system_code,
      name,
      owner_name,
      business_owner,
      technical_owner,
      environment,
      sensitivity,
      active,
      notes,
      created_at,
      updated_at
    FROM systems
    ORDER BY id DESC
  `);

  return rows;
};

const getSystemById = async (id) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      system_code,
      name,
      owner_name,
      business_owner,
      technical_owner,
      environment,
      sensitivity,
      active,
      notes,
      created_at,
      updated_at
    FROM systems
    WHERE id = ?
    `,
    [id]
  );

  return rows[0] || null;
};

const updateSystem = async (id, data) => {
  const {
    name,
    owner_name,
    business_owner,
    technical_owner,
    environment,
    sensitivity,
    active,
    notes
  } = data;

  const [result] = await pool.execute(
    `
    UPDATE systems
    SET
      name = ?,
      owner_name = ?,
      business_owner = ?,
      technical_owner = ?,
      environment = ?,
      sensitivity = ?,
      active = ?,
      notes = ?
    WHERE id = ?
    `,
    [
      name,
      owner_name,
      business_owner,
      technical_owner,
      environment,
      sensitivity,
      active,
      notes,
      id
    ]
  );

  return result;
};

const deactivateSystem = async (id) => {
  const [result] = await pool.execute(
    `
    UPDATE systems
    SET active = 0
    WHERE id = ?
    `,
    [id]
  );

  return result;
};

module.exports = {
  createSystem,
  getSystems,
  getSystemById,
  updateSystem,
  deactivateSystem
};