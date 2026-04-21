export default function EmployeeTable({
  employees,
  selectedEmployeeId,
  onSelect,
  onEdit,
  onDeactivate,
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Ansatte og kapasitet</h2>
          <p>Hvor mye reell tjenestedekning hver person gir</p>
        </div>
      </div>

      <div className="table-wrap">
        <table className="employees-table compact-table">
          <thead>
            <tr>
              <th>Ansatt</th>
              <th>Avd.</th>
              <th>Avail</th>
              <th>Qualified</th>
              <th>Fully</th>
              <th>Expert</th>
              <th>Access gaps</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className={selectedEmployeeId === employee.id ? "selected-row" : ""}
              >
                <td>
                  <div className="name-cell">
                    <strong>{employee.full_name}</strong>
                    <span>{employee.id}</span>
                  </div>
                </td>

                <td>{employee.department || "—"}</td>
                <td>{Number(employee.availability_percent || 0)}%</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td>—</td>

                <td>
                  <div className="row-actions">
                    <button className="ghost-btn" onClick={() => onSelect(employee)}>
                      Vis
                    </button>
                    <button className="ghost-btn" onClick={() => onEdit(employee)}>
                      Rediger
                    </button>
                    {Number(employee.active) === 1 && (
                      <button
                        className="ghost-btn danger-btn"
                        onClick={() => onDeactivate(employee)}
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {employees.length === 0 && (
              <tr>
                <td colSpan="8" className="empty-state">
                  Ingen ansatte funnet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}