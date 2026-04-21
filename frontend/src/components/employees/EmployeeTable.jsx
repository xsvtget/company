export default function EmployeeTable({
  employees,
  selectedEmployeeId,
  onSelect,
  onEdit,
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
        <table className="employees-table">
          <thead>
            <tr>
              <th>Ansatt</th>
              <th>Avd.</th>
              <th>Lokasjon</th>
              <th>Avail</th>
              <th>Qualified</th>
              <th>Fully</th>
              <th>Expert</th>
              <th>Gaps</th>
              <th>Actions</th>
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
                    <strong>{employee.name}</strong>
                    <span>#{employee.id} • {employee.role}</span>
                  </div>
                </td>
                <td>{employee.department}</td>
                <td>{employee.location}</td>
                <td>{employee.availability}%</td>
                <td>{employee.qualified}</td>
                <td>{employee.fully}</td>
                <td>{employee.expert}</td>
                <td>{employee.accessGaps}</td>
                <td>
                  <div className="row-actions">
                    <button className="ghost-btn" onClick={() => onSelect(employee)}>
                      Vis
                    </button>
                    <button className="ghost-btn" onClick={() => onEdit(employee)}>
                      Rediger
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {employees.length === 0 && (
              <tr>
                <td colSpan="9" className="empty-state">
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