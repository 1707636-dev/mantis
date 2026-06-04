import "./globals.css";

export const metadata = {
  title: "Maintor — Mantenimiento Preventivo",
  description: "Sistema de mantenimiento preventivo para empresas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#e5e7eb', color: '#111827', fontFamily: 'system-ui, sans-serif', minHeight: '100vh', display: 'flex' }}>
        <aside style={{ width: '240px', backgroundColor: '#d1d5db', padding: '24px 0', display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'fixed', top: 0, left: 0, borderRight: '1px solid #9ca3af', boxShadow: '2px 0 8px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '0 24px 32px', borderBottom: '1px solid #9ca3af' }}>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>Maintor</h1>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>Mantenimiento Preventivo</p>
          </div>
          <nav style={{ padding: '16px 0', display: 'flex', flexDirection: 'column' }}>
            <a href="/" style={{ padding: '12px 24px', color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Dashboard</a>
            <a href="/activos" style={{ padding: '12px 24px', color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Activos</a>
            <a href="/planes" style={{ padding: '12px 24px', color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Planes</a>
            <a href="/ordenes" style={{ padding: '12px 24px', color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Órdenes</a>
          </nav>
        </aside>
        <main style={{ marginLeft: '240px', flex: 1, padding: '40px', minHeight: '100vh', backgroundColor: '#e5e7eb' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
