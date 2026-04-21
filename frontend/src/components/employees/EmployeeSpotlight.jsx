export default function EmployeeSpotlight({ employee }) {
  if (!employee) {
    return (
      <aside className="panel spotlight-panel">
        <div className="panel-header">
          <div>
            <h2>People drilldown</h2>
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
          <h2>People drilldown</h2>
          <p>Kompetanse- og dekningsprofil for {employee.full_name}</p>
        </div>
      </div>

      <div className="spotlight-card">
        <h3>{employee.full_name}</h3>
        <p>
          {employee.id} • {employee.department || "—"} • Availability{" "}
          {Number(employee.availability_percent || 0)}%
        </p>
      </div>

      <div className="pill-row">
        <span className="pill">Qualified services: —</span>
        <span className="pill">Fully capable: —</span>
        <span className="pill">Experts: —</span>
        <span className="pill">Access gaps: —</span>
      </div>

      <div className="detail-block">
        <h4>Email</h4>
        <p>{employee.email || "—"}</p>
      </div>

      <div className="detail-block">
        <h4>Service footprint</h4>
        <p>Not connected yet</p>
      </div>

      <div className="detail-block">
        <h4>System qualifications</h4>
        <p>Not connected yet</p>
      </div>

      <div className="detail-actions">
        <button className="ghost-btn">Rediger ansatt</button>
        <button className="ghost-btn">Ny qualification</button>
      </div>
    </aside>
  );
}