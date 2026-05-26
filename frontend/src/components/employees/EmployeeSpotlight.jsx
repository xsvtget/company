export default function EmployeeSpotlight({ employee }) {
  if (!employee) {
    return (
      <aside className="panel spotlight-panel">
        <div className="panel-header">
          <div>
            <h2>People spotlight</h2>
            <p>Velg en ansatt fra listen</p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="panel spotlight-panel">
      <div className="panel-header">
        <div>
          <h2>People spotlight</h2>
          <p>Hvem kan mest, og hvor er hullene</p>
        </div>
      </div>

      <div className="spotlight-card">
        <h3>{employee.full_name}</h3>
        <p>
          {employee.employee_code || employee.id} · {employee.department || "—"} ·
          Availability {Number(employee.availability_percent || 0)}%
        </p>
      </div>

      <div className="pill-row">
        <span className="pill">Qualified services: {employee.qualified_services || 0}</span>
        <span className="pill">Fully capable: {employee.fully_capable || 0}</span>
        <span className="pill">Experts: {employee.expert_count || 0}</span>
        <span className="pill">Access gaps: {employee.access_gaps || 0}</span>
      </div>

      <div className="detail-block plain">
        <p>Sterkeste tjenestetilknytninger:</p>
        <p>· {employee.role_title || "Support Specialist"} — score {Number(employee.availability_percent || 0).toFixed(2)}</p>
      </div>

      <div className="detail-actions">
        <button className="primary">Åpne drilldown</button>
        <button className="ghost-btn">Rediger</button>
        <button className="ghost-btn">Ny qualification</button>
      </div>
    </aside>
  );
}