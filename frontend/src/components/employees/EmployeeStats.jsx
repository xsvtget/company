export default function EmployeeStats({ employees }) {
  const totalPeople = employees.length;
  const totalQualified = employees.reduce((sum, e) => sum + (e.qualified ?? 0), 0);
  const totalExperts = employees.reduce((sum, e) => sum + (e.expert ?? 0), 0);
  const totalGaps = employees.reduce((sum, e) => sum + (e.accessGaps ?? 0), 0);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span>People</span>
        <strong>{totalPeople}</strong>
      </div>
      <div className="stat-card">
        <span>Qualified services</span>
        <strong>{totalQualified}</strong>
      </div>
      <div className="stat-card">
        <span>Expert footprints</span>
        <strong>{totalExperts}</strong>
      </div>
      <div className="stat-card">
        <span>Access gaps</span>
        <strong>{totalGaps}</strong>
      </div>
    </div>
  );
}