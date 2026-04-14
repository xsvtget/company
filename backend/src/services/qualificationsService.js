const pool = require('../config/db');

const createQualification = async (data) => {
  const {
    employee_id,
    system_id,
    experience_score,
    certification_points,
    knowledge_score,
    total_score,
    qualification_level,
    entry_date,
    review_due_date,
    is_reviewed,
    notes
  } = data;

  const [result] = await pool.execute(
    `
    INSERT INTO qualifications (
      employee_id,
      system_id,
      experience_score,
      certification_points,
      knowledge_score,
      total_score,
      qualification_level,
      entry_date,
      review_due_date,
      is_reviewed,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      employee_id,
      system_id,
      experience_score ?? 0,
      certification_points ?? 0,
      knowledge_score ?? 0,
      total_score ?? 0,
      qualification_level ?? 'NONE',
      entry_date ?? null,
      review_due_date ?? null,
      is_reviewed ?? false,
      notes ?? null
    ]
  );

  return result;
};

const updateQualification = async (id, data) => {
  const {
    experience_score,
    certification_points,
    knowledge_score,
    total_score,
    qualification_level,
    entry_date,
    review_due_date,
    is_reviewed,
    notes
  } = data;

  const [result] = await pool.execute(
    `
    UPDATE qualifications
    SET
      experience_score = ?,
      certification_points = ?,
      knowledge_score = ?,
      total_score = ?,
      qualification_level = ?,
      entry_date = ?,
      review_due_date = ?,
      is_reviewed = ?,
      notes = ?
    WHERE id = ?
    `,
    [
      experience_score,
      certification_points,
      knowledge_score,
      total_score,
      qualification_level,
      entry_date,
      review_due_date,
      is_reviewed,
      notes,
      id
    ]
  );

  return result;
};

const getQualificationsByEmployee = async (employeeId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      q.id,
      q.employee_id,
      e.full_name AS employee_name,
      q.system_id,
      s.name AS system_name,
      q.experience_score,
      q.certification_points,
      q.knowledge_score,
      q.total_score,
      q.qualification_level,
      q.entry_date,
      q.review_due_date,
      q.is_reviewed,
      q.notes,
      q.created_at,
      q.updated_at
    FROM qualifications q
    JOIN employees e ON q.employee_id = e.id
    JOIN systems s ON q.system_id = s.id
    WHERE q.employee_id = ?
    ORDER BY q.id DESC
    `,
    [employeeId]
  );

  return rows;
};

const getQualificationsBySystem = async (systemId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      q.id,
      q.employee_id,
      e.full_name AS employee_name,
      q.system_id,
      s.name AS system_name,
      q.experience_score,
      q.certification_points,
      q.knowledge_score,
      q.total_score,
      q.qualification_level,
      q.entry_date,
      q.review_due_date,
      q.is_reviewed,
      q.notes,
      q.created_at,
      q.updated_at
    FROM qualifications q
    JOIN employees e ON q.employee_id = e.id
    JOIN systems s ON q.system_id = s.id
    WHERE q.system_id = ?
    ORDER BY q.total_score DESC
    `,
    [systemId]
  );

  return rows;
};

const deleteQualification = async (id) => {
  const [result] = await pool.execute(
    `
    DELETE FROM qualifications
    WHERE id = ?
    `,
    [id]
  );

  return result;
};

module.exports = {
  createQualification,
  updateQualification,
  getQualificationsByEmployee,
  getQualificationsBySystem,
  deleteQualification
};