const pool = require('../config/db');

const createLink = async (data) => {
  const {
    service_id,
    system_id,
    required_level,
    min_score,
    is_critical,
    notes
  } = data;

  const [result] = await pool.execute(
    `
    INSERT INTO service_required_systems (
      service_id,
      system_id,
      required_level,
      min_score,
      is_critical,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      service_id,
      system_id,
      required_level ?? 'QUALIFIED',
      min_score ?? 0,
      is_critical ?? false,
      notes ?? null
    ]
  );

  return result;
};

const updateLink = async (id, data) => {
  const {
    required_level,
    min_score,
    is_critical,
    notes
  } = data;

  const [result] = await pool.execute(
    `
    UPDATE service_required_systems
    SET
      required_level = ?,
      min_score = ?,
      is_critical = ?,
      notes = ?
    WHERE id = ?
    `,
    [
      required_level,
      min_score,
      is_critical,
      notes,
      id
    ]
  );

  return result;
};

const getSystemsByService = async (serviceId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      srs.id,
      srs.service_id,
      srv.name AS service_name,
      srs.system_id,
      sys.name AS system_name,
      sys.system_code,
      srs.required_level,
      srs.min_score,
      srs.is_critical,
      srs.notes,
      srs.created_at,
      srs.updated_at
    FROM service_required_systems srs
    JOIN services srv ON srs.service_id = srv.id
    JOIN systems sys ON srs.system_id = sys.id
    WHERE srs.service_id = ?
    ORDER BY srs.is_critical DESC, srs.min_score DESC, sys.name ASC
    `,
    [serviceId]
  );

  return rows;
};

const getServicesBySystem = async (systemId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      srs.id,
      srs.service_id,
      srv.name AS service_name,
      srv.service_code,
      srs.system_id,
      sys.name AS system_name,
      srs.required_level,
      srs.min_score,
      srs.is_critical,
      srs.notes,
      srs.created_at,
      srs.updated_at
    FROM service_required_systems srs
    JOIN services srv ON srs.service_id = srv.id
    JOIN systems sys ON srs.system_id = sys.id
    WHERE srs.system_id = ?
    ORDER BY srv.name ASC
    `,
    [systemId]
  );

  return rows;
};

const deleteLink = async (id) => {
  const [result] = await pool.execute(
    `
    DELETE FROM service_required_systems
    WHERE id = ?
    `,
    [id]
  );

  return result;
};

module.exports = {
  createLink,
  updateLink,
  getSystemsByService,
  getServicesBySystem,
  deleteLink
};