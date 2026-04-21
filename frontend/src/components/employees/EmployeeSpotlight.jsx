export default function EmployeeSpotlight({ employee }) {
  if (!employee) {
    return (
      <aside className="panel">
        <h2>People spotlight</h2>
        <p>Velg en ansatt fra listen</p>
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
        <h3>{employee.name}</h3>
        <p>
          #{employee.id} • {employee.department} • Availability {employee.availability}%
        </p>
      </div>

      <div className="pill-row">
        <span className="pill">Qualified: {employee.qualified}</span>
        <span className="pill">Fully: {employee.fully}</span>
        <span className="pill">Experts: {employee.expert}</span>
        <span className="pill">Gaps: {employee.accessGaps}</span>
      </div>

      <div className="detail-block">
        <h4>Service footprint</h4>
        <p>{employee.serviceFootprint}</p>
      </div>

      <div className="detail-block">
        <h4>System qualifications</h4>
        <ul>
          {employee.systems.map((system) => (
            <li key={system}>{system}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}