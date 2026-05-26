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
      e.id,
      e.employee_code,
      e.full_name,
      e.email,
      e.role_title,
      e.department,
      e.location,
      e.availability_percent,
      e.active,
      e.notes,
      e.created_at,
      e.updated_at,

      COUNT(DISTINCT CASE
        WHEN ec.covered_systems = ec.required_systems
        THEN ec.service_id
      END) AS qualified_services,

      COUNT(DISTINCT CASE
        WHEN ec.fully_covered_systems = ec.required_systems
        THEN ec.service_id
      END) AS fully_capable,

      COUNT(DISTINCT CASE
        WHEN ec.expert_covered_systems = ec.required_systems
        THEN ec.service_id
      END) AS expert_count,

      COUNT(DISTINCT CASE
        WHEN ec.covered_systems > 0
          AND ec.covered_systems < ec.required_systems
        THEN ec.service_id
      END) AS access_gaps

    FROM employees e

    LEFT JOIN (
      SELECT
        s.id AS service_id,
        emp.id AS employee_id,

        COUNT(DISTINCT srs.system_id) AS required_systems,

        COUNT(DISTINCT CASE
          WHEN q.id IS NOT NULL
          THEN srs.system_id
        END) AS covered_systems,

        COUNT(DISTINCT CASE
          WHEN q.qualification_level IN ('FULLY_CAPABLE', 'EXPERT')
          THEN srs.system_id
        END) AS fully_covered_systems,

        COUNT(DISTINCT CASE
          WHEN q.qualification_level = 'EXPERT'
          THEN srs.system_id
        END) AS expert_covered_systems

      FROM services s
      JOIN service_required_systems srs
        ON s.id = srs.service_id

      CROSS JOIN employees emp

      LEFT JOIN qualifications q
        ON q.employee_id = emp.id
        AND q.system_id = srs.system_id

      GROUP BY s.id, emp.id
    ) ec
      ON ec.employee_id = e.id

    GROUP BY e.id
    ORDER BY e.id DESC
  `);

  return rows;
};

const getEmployeeById = async (id) => {
  const [rows] = await pool.execute(
    `
    SELECT
      e.*,

      COUNT(DISTINCT CASE
        WHEN ec.covered_systems = ec.required_systems
        THEN ec.service_id
      END) AS qualified_services,

      COUNT(DISTINCT CASE
        WHEN ec.fully_covered_systems = ec.required_systems
        THEN ec.service_id
      END) AS fully_capable,

      COUNT(DISTINCT CASE
        WHEN ec.expert_covered_systems = ec.required_systems
        THEN ec.service_id
      END) AS expert_count,

      COUNT(DISTINCT CASE
        WHEN ec.covered_systems > 0
          AND ec.covered_systems < ec.required_systems
        THEN ec.service_id
      END) AS access_gaps

    FROM employees e

    LEFT JOIN (
      SELECT
        s.id AS service_id,
        emp.id AS employee_id,
        COUNT(DISTINCT srs.system_id) AS required_systems,
        COUNT(DISTINCT CASE WHEN q.id IS NOT NULL THEN srs.system_id END) AS covered_systems,
        COUNT(DISTINCT CASE WHEN q.qualification_level IN ('FULLY_CAPABLE', 'EXPERT') THEN srs.system_id END) AS fully_covered_systems,
        COUNT(DISTINCT CASE WHEN q.qualification_level = 'EXPERT' THEN srs.system_id END) AS expert_covered_systems
      FROM services s
      JOIN service_required_systems srs ON s.id = srs.service_id
      CROSS JOIN employees emp
      LEFT JOIN qualifications q
        ON q.employee_id = emp.id
        AND q.system_id = srs.system_id
      GROUP BY s.id, emp.id
    ) ec ON ec.employee_id = e.id

    WHERE e.id = ?
    GROUP BY e.id
    `,
    [id]
  );

  if (!rows[0]) return null;

  const employee = rows[0];

  const [qualifiedServices] = await pool.execute(
    `
    SELECT srv.name
    FROM services srv
    JOIN (
      SELECT
        s.id AS service_id,
        COUNT(DISTINCT srs.system_id) AS required_systems,
        COUNT(DISTINCT q.system_id) AS covered_systems
      FROM services s
      JOIN service_required_systems srs ON s.id = srs.service_id
      LEFT JOIN qualifications q
        ON q.employee_id = ?
        AND q.system_id = srs.system_id
      GROUP BY s.id
    ) x ON x.service_id = srv.id
    WHERE x.covered_systems = x.required_systems
    ORDER BY srv.name ASC
    `,
    [id]
  );

  const [fullyCapableServices] = await pool.execute(
    `
    SELECT srv.name
    FROM services srv
    JOIN (
      SELECT
        s.id AS service_id,
        COUNT(DISTINCT srs.system_id) AS required_systems,
        COUNT(DISTINCT CASE
          WHEN q.qualification_level IN ('FULLY_CAPABLE', 'EXPERT')
          THEN q.system_id
        END) AS fully_systems
      FROM services s
      JOIN service_required_systems srs ON s.id = srs.service_id
      LEFT JOIN qualifications q
        ON q.employee_id = ?
        AND q.system_id = srs.system_id
      GROUP BY s.id
    ) x ON x.service_id = srv.id
    WHERE x.fully_systems = x.required_systems
    ORDER BY srv.name ASC
    `,
    [id]
  );

  const [expertServices] = await pool.execute(
    `
    SELECT srv.name
    FROM services srv
    JOIN (
      SELECT
        s.id AS service_id,
        COUNT(DISTINCT srs.system_id) AS required_systems,
        COUNT(DISTINCT CASE
          WHEN q.qualification_level = 'EXPERT'
          THEN q.system_id
        END) AS expert_systems
      FROM services s
      JOIN service_required_systems srs
        ON s.id = srs.service_id
      LEFT JOIN qualifications q
        ON q.employee_id = ?
        AND q.system_id = srs.system_id
      GROUP BY s.id
    ) x ON x.service_id = srv.id
    WHERE x.expert_systems = x.required_systems
    ORDER BY srv.name ASC
    `,
    [id]
  );

  const [accessGaps] = await pool.execute(
    `
    SELECT
      srv.name AS service_name,
      GROUP_CONCAT(sys.name ORDER BY sys.name SEPARATOR ', ') AS missing_systems
    FROM services srv
    JOIN service_required_systems srs ON srv.id = srs.service_id
    JOIN systems sys ON srs.system_id = sys.id
    LEFT JOIN qualifications q
      ON q.employee_id = ?
      AND q.system_id = srs.system_id
    WHERE q.id IS NULL
      AND srv.id IN (
        SELECT srs2.service_id
        FROM service_required_systems srs2
        JOIN qualifications q2
          ON q2.employee_id = ?
          AND q2.system_id = srs2.system_id
      )
    GROUP BY srv.id, srv.name
    ORDER BY srv.name ASC
    `,
    [id, id]
  );

  return {
    ...employee,
    qualifiedServices,
    fullyCapableServices,
    expertServices,
    accessGaps
  };
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