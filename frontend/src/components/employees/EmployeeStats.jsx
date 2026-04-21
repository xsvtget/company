export default function EmployeeStats({ employees }) {
  const totalPeople = employees.length;
  const activePeople = employees.filter((e) => Number(e.active) === 1).length;
  const inactivePeople = employees.filter((e) => Number(e.active) !== 1).length;

  const avgAvailability =
    employees.length > 0
      ? Math.round(
          employees.reduce(
            (sum, e) => sum + Number(e.availability_percent || 0),
            0
          ) / employees.length
        )
      : 0;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span>People</span>
        <strong>{totalPeople}</strong>
      </div>
      <div className="stat-card">
        <span>Active</span>
        <strong>{activePeople}</strong>
      </div>
      <div className="stat-card">
        <span>Inactive</span>
        <strong>{inactivePeople}</strong>
      </div>
      <div className="stat-card">
        <span>Avg availability</span>
        <strong>{avgAvailability}%</strong>
      </div>
    </div>
  );
}