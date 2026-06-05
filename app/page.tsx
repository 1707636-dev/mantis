'use client'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function Home() {
  const [activos, setActivos] = useState(0)
  const [planes, setPlanes] = useState(0)
  const [pendientes, setPendientes] = useState(0)
  const [completadas, setCompletadas] = useState(0)
  const [proximosMant, setProximosMant] = useState<any[]>([])
  const [mesActual, setMesActual] = useState(new Date())

  useEffect(() => {
    async function cargarDatos() {
      const { count: countActivos } = await supabase.from('activos').select('*', { count: 'exact', head: true })
      const { count: countPlanes } = await supabase.from('planes_mantenimiento').select('*', { count: 'exact', head: true })
      const { count: countPendientes } = await supabase.from('ordenes_trabajo').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente')
      const { count: countCompletadas } = await supabase.from('ordenes_trabajo').select('*', { count: 'exact', head: true }).eq('estado', 'completado')
      const { data: planesData } = await supabase.from('planes_mantenimiento').select('*, activos(nombre)').not('proxima_fecha', 'is', null)

      setActivos(countActivos || 0)
      setPlanes(countPlanes || 0)
      setPendientes(countPendientes || 0)
      setCompletadas(countCompletadas || 0)
      setProximosMant(planesData || [])
    }
    cargarDatos()
  }, [])

  const tarjetas = [
    { label: 'Activos', valor: activos, descripcion: 'Máquinas y equipos', href: '/activos', color: '#3b82f6' },
    { label: 'Planes', valor: planes, descripcion: 'Tareas programadas', href: '/planes', color: '#8b5cf6' },
    { label: 'Órdenes pendientes', valor: pendientes, descripcion: 'Por completar', href: '/ordenes', color: '#f59e0b' },
    { label: 'Órdenes completadas', valor: completadas, descripcion: 'Finalizadas', href: '/ordenes', color: '#10b981' },
  ]

  // Calendario
  const year = mesActual.getFullYear()
  const month = mesActual.getMonth()
  const primerDia = new Date(year, month, 1).getDay()
  const diasEnMes = new Date(year, month + 1, 0).getDate()
  const nombreMes = mesActual.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })

  const eventosDelMes = proximosMant.filter((p: any) => {
    const fecha = new Date(p.proxima_fecha)
    return fecha.getMonth() === month && fecha.getFullYear() === year
  })

  function tieneEvento(dia: number) {
    return eventosDelMes.filter((p: any) => new Date(p.proxima_fecha).getDate() === dia)
  }

  function colorEvento(fecha: string) {
    const hoy = new Date()
    const f = new Date(fecha)
    const diff = (f.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    if (diff < 0) return '#ef4444'
    if (diff <= 7) return '#f59e0b'
    return '#10b981'
  }

  const celdas = []
  for (let i = 0; i < (primerDia === 0 ? 6 : primerDia - 1); i++) celdas.push(null)
  for (let i = 1; i <= diasEnMes; i++) celdas.push(i)

  const hoy = new Date()

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>Bienvenido a Maintor</h1>
      <p style={{ color: '#6b7280', fontSize: '15px', margin: '0 0 40px' }}>Resumen de tu operación</p>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* Tarjetas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', minWidth: '320px' }}>
          {tarjetas.map((t) => (
            <a key={t.label} href={t.href} style={{ backgroundColor: '#d1d5db', borderRadius: '12px', padding: '24px', textDecoration: 'none', border: '1px solid #9ca3af', display: 'block' }}>
              <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.label}</p>
              <p style={{ margin: '0 0 4px', fontSize: '36px', fontWeight: '800', color: t.color }}>{t.valor}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{t.descripcion}</p>
            </a>
          ))}
        </div>

        {/* Calendario */}
        <div style={{ backgroundColor: '#d1d5db', borderRadius: '12px', border: '1px solid #9ca3af', padding: '24px', minWidth: '320px', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button onClick={() => setMesActual(new Date(year, month - 1))} style={{ background: 'none', border: '1px solid #9ca3af', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', color: '#374151' }}>←</button>
            <p style={{ margin: 0, fontWeight: '700', color: '#111827', fontSize: '15px', textTransform: 'capitalize' }}>{nombreMes}</p>
            <button onClick={() => setMesActual(new Date(year, month + 1))} style={{ background: 'none', border: '1px solid #9ca3af', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', color: '#374151' }}>→</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', fontWeight: '600', padding: '4px 0' }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {celdas.map((dia, i) => {
              const eventos = dia ? tieneEvento(dia) : []
              const esHoy = dia && hoy.getDate() === dia && hoy.getMonth() === month && hoy.getFullYear() === year
              return (
                <div key={i} title={eventos.map(e => `${e.activos?.nombre}: ${e.tarea}`).join('\n')}
                  style={{
                    height: '36px', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: esHoy ? '#111827' : eventos.length > 0 ? '#e5e7eb' : 'transparent',
                    border: eventos.length > 0 && !esHoy ? '1px solid #9ca3af' : 'none',
                    cursor: eventos.length > 0 ? 'pointer' : 'default',
                    position: 'relative'
                  }}>
                  {dia && <span style={{ fontSize: '13px', color: esHoy ? '#fff' : '#374151', fontWeight: esHoy ? '700' : '400' }}>{dia}</span>}
                  {eventos.length > 0 && (
                    <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                      {eventos.slice(0, 3).map((e, j) => (
                        <div key={j} style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: colorEvento(e.proxima_fecha) }} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Leyenda */}
          <div style={{ marginTop: '16px', borderTop: '1px solid #9ca3af', paddingTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} /><span style={{ fontSize: '12px', color: '#6b7280' }}>Al día</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} /><span style={{ fontSize: '12px', color: '#6b7280' }}>Próximo (7 días)</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} /><span style={{ fontSize: '12px', color: '#6b7280' }}>Vencido</span></div>
          </div>

          {/* Lista de eventos del mes */}
          {eventosDelMes.length > 0 && (
            <div style={{ marginTop: '16px', borderTop: '1px solid #9ca3af', paddingTop: '12px' }}>
              <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Este mes</p>
              {eventosDelMes.sort((a: any, b: any) => new Date(a.proxima_fecha).getTime() - new Date(b.proxima_fecha).getTime()).map((e: any) => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <div>
                    <span style={{ fontSize: '13px', color: '#111827', fontWeight: '500' }}>{e.activos?.nombre}</span>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}> — {e.tarea}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: colorEvento(e.proxima_fecha), fontWeight: '600' }}>
                    {new Date(e.proxima_fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}