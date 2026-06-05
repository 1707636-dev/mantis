'use client'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function Home() {
  const [activos, setActivos] = useState(0)
  const [planes, setPlanes] = useState(0)
  const [pendientes, setPendientes] = useState(0)
  const [completadas, setCompletadas] = useState(0)

  useEffect(() => {
    async function cargarDatos() {
      const { count: countActivos } = await supabase.from('activos').select('*', { count: 'exact', head: true })
      const { count: countPlanes } = await supabase.from('planes_mantenimiento').select('*', { count: 'exact', head: true })
      const { count: countPendientes } = await supabase.from('ordenes_trabajo').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente')
      const { count: countCompletadas } = await supabase.from('ordenes_trabajo').select('*', { count: 'exact', head: true }).eq('estado', 'completado')

      setActivos(countActivos || 0)
      setPlanes(countPlanes || 0)
      setPendientes(countPendientes || 0)
      setCompletadas(countCompletadas || 0)
    }
    cargarDatos()
  }, [])

  const tarjetas = [
    { label: 'Activos', valor: activos, descripcion: 'Máquinas y equipos', href: '/activos', color: '#3b82f6' },
    { label: 'Planes', valor: planes, descripcion: 'Tareas programadas', href: '/planes', color: '#8b5cf6' },
    { label: 'Órdenes pendientes', valor: pendientes, descripcion: 'Por completar', href: '/ordenes', color: '#f59e0b' },
    { label: 'Órdenes completadas', valor: completadas, descripcion: 'Finalizadas', href: '/ordenes', color: '#10b981' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>
        Bienvenido a Maintor
      </h1>
      <p style={{ color: '#6b7280', fontSize: '15px', margin: '0 0 40px' }}>
        Resumen de tu operación
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '700px' }}>
        {tarjetas.map((t) => (
          <a key={t.label} href={t.href} style={{ backgroundColor: '#d1d5db', borderRadius: '12px', padding: '24px', textDecoration: 'none', border: '1px solid #9ca3af', display: 'block' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.label}</p>
            <p style={{ margin: '0 0 4px', fontSize: '36px', fontWeight: '800', color: t.color }}>{t.valor}</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{t.descripcion}</p>
          </a>
        ))}
      </div>
    </div>
  )
}