export default function AppShell({ children, activeItem = "Systems" }) {
  const items = [
    "Oversikt",
    "Services",
    "People",
    "Systems",
    "Coverage Matrix",
    "Actions & Reviews",
    "Data Editor",
    "Datakvalitet",
    "Audit-logg",
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-badge">EP</div>
          <div>
            <h1>Competence &amp; Risk Workbench</h1>
            <p>v2.3 • editable • import wizard • bulk edit</p>
          </div>
        </div>

        <div className="nav-label">Hovedflater</div>

        <nav className="sidebar-nav">
          {items.map((item) => (
            <button
              key={item}
              className={`nav-link ${activeItem === item ? "active" : ""}`}
              type="button"
            >
              <span>{item}</span>
              <span className="nav-meta">View</span>
            </button>
          ))}
        </nav>

        <div className="side-card">
          <h3>Systems</h3>
          <p>
            Assets, eierskap, sensitivity, environment og admin footprint.
          </p>
        </div>
      </aside>

      <main className="page-content">{children}</main>
    </div>
  );
}