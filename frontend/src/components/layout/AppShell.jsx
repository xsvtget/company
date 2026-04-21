export default function AppShell({ children }) {
  return (
    <div className="employees-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-badge">EP</div>
          <div>
            <h1>Competence & Risk Workbench</h1>
            <p>v2.3 • editable • import wizard • bulk edit</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-link">Oversikt</button>
          <button className="nav-link">Services</button>
          <button className="nav-link active">People</button>
          <button className="nav-link">Systems</button>
          <button className="nav-link">Coverage Matrix</button>
          <button className="nav-link">Actions & Reviews</button>
          <button className="nav-link">Data Editor</button>
          <button className="nav-link">Datakvalitet</button>
          <button className="nav-link">Audit-logg</button>
        </nav>
      </aside>

      <main className="page-content">{children}</main>
    </div>
  );
}