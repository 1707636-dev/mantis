export default function Home() {
  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 8px' }}>
        Bienvenido a Mantis
      </h1>
      <p style={{ color: '#64748b', fontSize: '15px', margin: '0 0 40px' }}>
        Sistema de mantenimiento preventivo para empresas
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <a href="/activos" style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '24px', textDecoration: 'none', border: '1px solid #334155', display: 'block' }}>
          <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Activos</p>
          <p style={{ margin: 0, fontSize: '15px', color: '#e2e8f0' }}>Gestioná tus máquinas y equipos</p>
        </a>
        <a href="/planes" style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '24px', textDecoration: 'none', border: '1px solid #334155', display: 'block' }}>
          <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Planes</p>
          <p style={{ margin: 0, fontSize: '15px', color: '#e2e8f0' }}>Configurá tareas y frecuencias</p>
        </a>
        <a href="/ordenes" style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '24px', textDecoration: 'none', border: '1px solid #334155', display: 'block' }}>
          <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Órdenes</p>
          <p style={{ margin: 0, fontSize: '15px', color: '#e2e8f0' }}>Creá y completá órdenes de trabajo</p>
        </a>
      </div>
    </div>
  )
}