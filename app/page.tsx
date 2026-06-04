export default function Home() {
  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>
        Bienvenido a Maintor
      </h1>
      <p style={{ color: '#6b7280', fontSize: '15px', margin: '0 0 40px' }}>
        Sistema de mantenimiento preventivo para empresas
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <a href="/activos" style={{ backgroundColor: '#d1d5db', borderRadius: '12px', padding: '24px', textDecoration: 'none', border: '1px solid #9ca3af', display: 'block' }}>
          <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Activos</p>
          <p style={{ margin: 0, fontSize: '15px', color: '#111827', fontWeight: '700' }}>Gestioná tus máquinas y equipos</p>
        </a>
        <a href="/planes" style={{ backgroundColor: '#d1d5db', borderRadius: '12px', padding: '24px', textDecoration: 'none', border: '1px solid #9ca3af', display: 'block' }}>
          <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Planes</p>
          <p style={{ margin: 0, fontSize: '15px', color: '#111827', fontWeight: '700' }}>Configurá tareas y frecuencias</p>
        </a>
        <a href="/ordenes" style={{ backgroundColor: '#d1d5db', borderRadius: '12px', padding: '24px', textDecoration: 'none', border: '1px solid #9ca3af', display: 'block' }}>
          <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Órdenes</p>
          <p style={{ margin: 0, fontSize: '15px', color: '#111827', fontWeight: '700' }}>Creá y completá órdenes de trabajo</p>
        </a>
      </div>
    </div>
  )
}