export default function SystemTable({ systems, onView, onEdit, onDeactivate }) {
  return (
    <div className="content-card">
      <div className="card-header-block">
        <h3>Systemer / assets</h3>
        <p>Type, eierskap og admin footprint</p>
      </div>

      <div className="table-shell">
        <table className="data-table">
          <thead>
            <tr>
              <th>System</th>
              <th>Sensitivity</th>
              <th>Biz owner</th>
              <th>Tech owner</th>
              <th>Capable</th>
              <th>Admins</th>
              <th>Used by</th>
              <th>Kommentar</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {systems.length === 0 ? (
              <tr>
                <td colSpan="9">Ingen systems funnet.</td>
              </tr>
            ) : (
              systems.map((system) => (
                <tr key={system.id}>
                  <td>
                    <strong>{system.system_name}</strong>
                    <div className="sub-row">{system.system_code}</div>
                  </td>
                  <td>{system.sensitivity || "—"}</td>
                  <td>{system.biz_owner || "Ikke satt"}</td>
                  <td>{system.tech_owner || "Ikke satt"}</td>
                  <td>{system.capable_count ?? 0}</td>
                  <td>{system.admin_count ?? 0}</td>
                  <td>{system.used_by_services || "—"}</td>
                  <td>{system.notes || "Ingen kommentarer"}</td>
                  <td>
                    <div className="table-actions">
                      <button className="ghost-button" onClick={() => onView(system)}>
                        Vis
                      </button>
                      <button className="ghost-button" onClick={() => onEdit(system)}>
                        Rediger
                      </button>

                      {(system.active === 1 || system.active === true) && (
                        <button
                          className="warning-button"
                          onClick={() => onDeactivate(system)}
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}