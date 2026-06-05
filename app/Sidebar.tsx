'use client'
import { supabase } from './supabase'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
  const router = useRouter()

  async function cerrarSesion() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside style={{ width: '240px', backgroundColor: '#d1d5db', padding: '24px 0', display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'fixed', top: 0, left: 0, borderRight: '1px solid #9ca3af', boxShadow: '2px 0 8px rgba(0,0,0,0.06)' }}>
      <div style={{ padding: '0 24px 32px', borderBottom: '1px solid #9ca3af' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px' }}>Maintor</h1>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>Mantenimiento Preventivo</p>
      </div>
      <nav style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <a href="/" style={{ padding: '12px 24px', color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Dashboard</a>
        <a href="/activos" style={{ padding: '12px 24px', color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Activos</a>
        <a href="/planes" style={{ padding: '12px 24px', color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Planes</a>
        <a href="/ordenes" style={{ padding: '12px 24px', color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Órdenes</a>
      </nav>
      <div style={{ padding: '16px 24px', borderTop: '1px solid #9ca3af' }}>
        <button onClick={cerrarSesion} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}