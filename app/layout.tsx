import "./globals.css";

export const metadata = {
  title: "Mantis — Mantenimiento Preventivo",
  description: "Sistema de mantenimiento preventivo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0f172a', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif', minHeight: '100vh', display: 'flex' }}>
        <aside style={{ width: '240px', backgroundColor: '#1e293b', padding: '24px 0', display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'fixed', top: 0, left: 0 }}>
          <div style={{ padding: '0 24px 32px', borderBottom: '1px solid #334155' }}>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#38bdf8', letterSpacing: '-0.5px' }}>Mantis</h1>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>Mantenimiento Preventivo</p>
          </div>
          <nav style={{ padding: '16px 0', display: 'flex', flexDirection: 'column' }}>
            <a href="/" style={{ padding: '12px 24px', color: '#94a3b8', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>Dashboard</a>
            <a href="/activos" style={{ padding: '12px 24px', color: '#94a3b8', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>Activos</a>
            <a href="/planes" style={{ padding: '12px 24px', color: '#94a3b8', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>Planes</a>
            <a href="/ordenes" style={{ padding: '12px 24px', color: '#94a3b8', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>Órdenes</a>
          </nav>
        </aside>
        <main style={{ marginLeft: '240px', flex: 1, padding: '40px', minHeight: '100vh' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
