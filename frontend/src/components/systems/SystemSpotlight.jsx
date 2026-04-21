export default function SystemSpotlight({ system, onEdit }) {
  if (!system) {
    return (
      <div className="content-card">
        <div className="card-header-block">
          <h3>System spotlight</h3>
          <p>Asset view for selected system</p>
        </div>
        <div className="empty-state-card">Вибери system у таблиці.</div>
      </div>
    );
  }

  return (
    <div className="content-card">
      <div className="card-header-block">
        <h3>System spotlight</h3>
        <p>Asset view for selected system</p>
      </div>

      <div className="spotlight-main-card">
        <h2>{system.system_name}</h2>
        <p>
          {system.system_code} • Sensitivity {system.sensitivity || "—"} • Env{" "}
          {system.environment || "—"}
        </p>
      </div>

      <div className="spotlight-chip-row">
        <span className="spotlight-chip">Owner name: {system.owner_name || "Ikke satt"}</span>
        <span className="spotlight-chip">Biz owner: {system.biz_owner || "Ikke satt"}</span>
        <span className="spotlight-chip">Tech owner: {system.tech_owner || "Ikke satt"}</span>
      </div>

      <div className="spotlight-section-card">
        <h4>Status</h4>
        <p>{system.active === 1 || system.active === true ? "Active" : "Inactive"}</p>
      </div>

      <div className="spotlight-section-card">
        <h4>Capability / admin footprint</h4>
        <p>Capable: {system.capable_count ?? 0}</p>
        <p>Admins: {system.admin_count ?? 0}</p>
      </div>

      <div className="spotlight-section-card">
        <h4>Used by services</h4>
        <p>{system.used_by_services || "Ikke koblet til noen service"}</p>
      </div>

      <div className="spotlight-section-card">
        <h4>Notes</h4>
        <p>{system.notes || "No notes"}</p>
      </div>

      <div className="spotlight-section-card">
        <h4>Timestamps</h4>
        <p>Created: {system.created_at || "—"}</p>
        <p>Updated: {system.updated_at || "—"}</p>
      </div>

      <button className="primary-button full-width" onClick={() => onEdit(system)}>
        Rediger system
      </button>
    </div>
  );
}