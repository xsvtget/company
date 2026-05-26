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

      COALESCE(req.required_count, 0) AS required_systems_count,

      COUNT(DISTINCT CASE
        WHEN ec.covered_systems = req.required_count
        THEN ec.employee_id
      END) AS qualified_people_count,

      COUNT(DISTINCT CASE
        WHEN ec.fully_covered_systems = req.required_count
        THEN ec.employee_id
      END) AS fully_people_count,

      COUNT(DISTINCT CASE
        WHEN ec.has_access_gap = 1
        THEN ec.employee_id
      END) AS access_gaps_count,

      CASE
        WHEN COALESCE(req.required_count, 0) = 0 THEN 0
        WHEN COALESCE(s.preferred_qualified, 2) = 0 THEN 0
        ELSE ROUND(
          COUNT(DISTINCT CASE
            WHEN ec.covered_systems = req.required_count
            THEN ec.employee_id
          END) / COALESCE(s.preferred_qualified, 2) * 100
        )
      END AS coverage_percent

    FROM services s

    LEFT JOIN (
      SELECT
        service_id,
        COUNT(DISTINCT system_id) AS required_count
      FROM service_required_systems
      GROUP BY service_id
    ) req ON req.service_id = s.id

    LEFT JOIN (
      SELECT
        srs.service_id,
        q.employee_id,

        COUNT(DISTINCT CASE
          WHEN q.total_score >= srs.min_score
          THEN srs.system_id
        END) AS covered_systems,

        COUNT(DISTINCT CASE
          WHEN q.total_score >= srs.min_score
           AND q.qualification_level IN ('FULLY_CAPABLE', 'EXPERT')
          THEN srs.system_id
        END) AS fully_covered_systems,

        MAX(CASE
          WHEN q.total_score < srs.min_score
          THEN 1 ELSE 0
        END) AS has_access_gap

      FROM service_required_systems srs
      JOIN qualifications q
        ON q.system_id = srs.system_id
      GROUP BY srs.service_id, q.employee_id
    ) ec ON ec.service_id = s.id

    GROUP BY
      s.id,
      s.name,
      s.service_code,
      s.owner_name,
      s.criticality,
      s.min_qualified,
      s.preferred_qualified,
      s.active,
      s.notes,
      req.required_count

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
  const [serviceRows] = await pool.execute(
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
      notes
    FROM services
    WHERE id = ?
    `,
    [serviceId]
  );

  if (!serviceRows.length) return null;

  const service = serviceRows[0];

  const [systems] = await pool.execute(
    `
    SELECT
      sys.id,
      sys.system_code,
      sys.name,
      srs.required_level,
      srs.min_score,
      srs.critical_level,
      srs.notes
    FROM service_required_systems srs
    JOIN systems sys
      ON sys.id = srs.system_id
    WHERE srs.service_id = ?
    ORDER BY sys.name
    `,
    [serviceId]
  );

  const [people] = await pool.execute(
    `
    SELECT
      e.id AS employee_id,
      e.employee_code,
      e.full_name AS name,

      COUNT(DISTINCT CASE
        WHEN q.total_score >= srs.min_score
        THEN srs.system_id
      END) AS covered_systems,

      COUNT(DISTINCT CASE
        WHEN q.total_score >= srs.min_score
         AND q.qualification_level IN ('FULLY_CAPABLE', 'EXPERT')
        THEN srs.system_id
      END) AS fully_covered_systems,

      MAX(q.total_score) AS score,

      CASE
        WHEN COUNT(DISTINCT CASE
          WHEN q.total_score >= srs.min_score
           AND q.qualification_level IN ('FULLY_CAPABLE', 'EXPERT')
          THEN srs.system_id
        END) = req.required_count
        THEN 'fully'

        WHEN COUNT(DISTINCT CASE
          WHEN q.total_score >= srs.min_score
          THEN srs.system_id
        END) = req.required_count
        THEN 'qualified'

        ELSE 'access gap'
      END AS status

    FROM employees e

    JOIN qualifications q
      ON q.employee_id = e.id

    JOIN service_required_systems srs
      ON srs.system_id = q.system_id

    JOIN (
      SELECT
        service_id,
        COUNT(DISTINCT system_id) AS required_count
      FROM service_required_systems
      WHERE service_id = ?
      GROUP BY service_id
    ) req ON req.service_id = srs.service_id

    WHERE srs.service_id = ?

    GROUP BY
      e.id,
      e.employee_code,
      e.full_name,
      req.required_count

    ORDER BY
      CASE status
        WHEN 'fully' THEN 1
        WHEN 'qualified' THEN 2
        ELSE 3
      END,
      score DESC
    `,
    [serviceId, serviceId]
  );

  const requiredCount = systems.length;

  const qualifiedPeople = people.filter((p) => p.status === "qualified" || p.status === "fully").length;
  const fullyPeople = people.filter((p) => p.status === "fully").length;
  const accessGapPeople = people.filter((p) => p.status === "access gap").length;

  return {
    ...service,
    required_systems_count: requiredCount,
    qualified_people_count: qualifiedPeople,
    fully_people_count: fullyPeople,
    access_gaps_count: accessGapPeople,
    coverage_percent:
      Number(service.preferred_qualified || 2) === 0
        ? 0
        : Math.round((qualifiedPeople / Number(service.preferred_qualified || 2)) * 100),
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