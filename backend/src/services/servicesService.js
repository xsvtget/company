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
      s.id,
      s.name,
      s.service_code,
      s.owner_name,
      s.criticality,
      s.min_qualified,
      s.preferred_qualified,
      s.active,
      s.notes,

      COUNT(DISTINCT srs.system_id) AS required_systems_count,

      COUNT(DISTINCT CASE
        WHEN emp_coverage.covered_systems = req.required_count
        THEN emp_coverage.employee_id
      END) AS qualified_people_count,

      0 AS fully_people_count,
      0 AS access_gaps_count,

      CASE
        WHEN COALESCE(s.preferred_qualified, 2) = 0 THEN 0
        ELSE ROUND(
          COUNT(DISTINCT CASE
            WHEN emp_coverage.covered_systems = req.required_count
            THEN emp_coverage.employee_id
          END) / COALESCE(s.preferred_qualified, 2) * 100
        )
      END AS coverage_percent

    FROM services s

    LEFT JOIN service_required_systems srs
      ON s.id = srs.service_id

    LEFT JOIN (
      SELECT
        service_id,
        COUNT(DISTINCT system_id) AS required_count
      FROM service_required_systems
      GROUP BY service_id
    ) req ON s.id = req.service_id

    LEFT JOIN (
      SELECT
        srs.service_id,
        q.employee_id,
        COUNT(DISTINCT srs.system_id) AS covered_systems
      FROM service_required_systems srs
      JOIN qualifications q
        ON srs.system_id = q.system_id
      GROUP BY srs.service_id, q.employee_id
    ) emp_coverage ON s.id = emp_coverage.service_id

    GROUP BY s.id
    ORDER BY s.id DESC
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





const getServiceDrilldown = async (serviceId) => {
  // 1. сам сервіс
  const [service] = await pool.execute(
    `SELECT * FROM services WHERE id = ?`,
    [serviceId]
  );

  if (!service.length) return null;

  // 2. required systems
  const [systems] = await pool.execute(
    `
    SELECT s.name
    FROM service_required_systems srs
    JOIN systems s ON s.id = srs.system_id
    WHERE srs.service_id = ?
    `,
    [serviceId]
  );

  // 3. люди (ВАЖЛИВО 🔥)
  const [people] = await pool.execute(
    `
    SELECT
      e.full_name AS name,
      q.total_score AS score,
      CASE 
        WHEN q.qualification_level = 'EXPERT' THEN 'fully'
        WHEN q.qualification_level IN ('FULLY_CAPABLE', 'QUALIFIED') THEN 'qualified'
        ELSE 'access gap'
      END as status
    FROM service_required_systems srs
    JOIN qualifications q ON q.system_id = srs.system_id
    JOIN employees e ON e.id = q.employee_id
    WHERE srs.service_id = ?
    ORDER BY q.total_score DESC
    `,
    [serviceId]
  );

  return {
    ...service[0],
    systems,
    people
  };
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  getServiceDrilldown,
  updateService,
  deactivateService
};