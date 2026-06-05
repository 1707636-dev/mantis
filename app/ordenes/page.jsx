'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([])
  const [activos, setActivos] = useState([])
  const [planes, setPlanes] = useState([])
  const [activoId, setActivoId] = useState('')
  const [planId, setPlanId] = useState('')
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { cargarDatos() }, [])

  async function cargarDatos() {
    setLoading(true)
    const { data: ordenesData } = await supabase.from('ordenes_trabajo').select('*, activos(nombre), planes_mantenimiento(tarea, frecuencia_horas)')
    const { data: activosData } = await supabase.from('activos').select('*')
    const { data: planesData } = await supabase.from('planes_mantenimiento').select('*')
    setOrdenes(ordenesData || [])
    setActivos(activosData || [])
    setPlanes(planesData || [])
    setLoading(false)
  }

  async function crearOrden() {
    if (!activoId || !planId) return
    await supabase.from('ordenes_trabajo').insert({ activo_id: activoId, plan_id: planId, notas, estado: 'pendiente' })
    setActivoId('')
    setPlanId('')
    setNotas('')
    cargarDatos()
  }

  async function completarOrden(id, planId, frecuenciaHoras) {
    const hoy = new Date()
    const proximaFecha = new Date(hoy)
    proximaFecha.setDate(proximaFecha.getDate() + Math.round(frecuenciaHoras / 24))

    await supabase.from('ordenes_trabajo').update({
      estado: 'completado',
      completado_at: hoy
    }).eq('id', id)

    // Actualizar el plan con la nueva fecha
    if (planId) {
      await supabase.from('planes_mantenimiento').update({
        ultimo_mantenimiento: hoy.toISOString().split('T')[0],
        proxima_fecha: proximaFecha.toISOString().split('T')[0]
      }).eq('id', planId)
    }

    cargarDatos()
  }

  async function eliminarOrden(id) {
    await supabase.from('ordenes_trabajo').delete().eq('id', id)
    cargarDatos()
  }

  function formatearFecha(fecha) {
    if (!fecha) return '—'
    return new Date(fecha).toLocaleDateString('es-AR')
  }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>Órdenes de trabajo</h1>
      <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 32px' }}>Tareas de mantenimiento activas</p>

      <div style={{ backgroundColor: '#d1d5db', borderRadius: '12px', padding: '24px', border: '1px solid #9ca3af', marginBottom: '24px', maxWidth: '480px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '15px', color: '#374151', fontWeight: '600' }}>Nueva orden</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <select value={activoId} onChange={e => setActivoId(e.target.value)} style={{ padding: '10px 14px', fontSize: '14px', backgroundColor: '#e5e7eb', border: '1px solid #9ca3af', borderRadius: '8px', color: '#111827', outline: 'none' }}>
            <option value=''>Seleccioná un activo</option>
            {activos.map(a => (<option key={a.id} value={a.id}>{a.nombre}</option>))}
          </select>
          <select value={planId} onChange={e => setPlanId(e.target.value)} style={{ padding: '10px 14px', fontSize: '14px', backgroundColor: '#e5e7eb', border: '1px solid #9ca3af', borderRadius: '8px', color: '#111827', outline: 'none' }}>
            <option value=''>Seleccioná una tarea</option>
            {planes.map(p => (<option key={p.id} value={p.id}>{p.tarea}</option>))}
          </select>
          <textarea placeholder='Notas (opcional)' value={notas} onChange={e => setNotas(e.target.value)} style={{ padding: '10px 14px', fontSize: '14px', backgroundColor: '#e5e7eb', border: '1px solid #9ca3af', borderRadius: '8px', color: '#111827', outline: 'none', height: '80px', resize: 'none' }} />
          <button onClick={crearOrden} style={{ padding: '10px', backgroundColor: '#111827', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            Crear orden
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#d1d5db', borderRadius: '12px', border: '1px solid #9ca3af', overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: '24px', color: '#6b7280', margin: 0 }}>Cargando...</p>
        ) : ordenes.length === 0 ? (
          <p style={{ padding: '24px', color: '#6b7280', margin: 0 }}>No hay órdenes registradas.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#9ca3af' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#374151', textTransform: 'uppercase', letterSpacing: '1px' }}>Activo</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#374151', textTransform: 'uppercase', letterSpacing: '1px' }}>Tarea</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#374151', textTransform: 'uppercase', letterSpacing: '1px' }}>Estado</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#374151', textTransform: 'uppercase', letterSpacing: '1px' }}>Completado</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#374151', textTransform: 'uppercase', letterSpacing: '1px' }}>Notas</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((o, i) => (
                <tr key={o.id} style={{ borderTop: '1px solid #9ca3af', backgroundColor: i % 2 === 0 ? '#d1d5db' : '#c4c9d0' }}>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#111827' }}>{o.activos?.nombre}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#374151' }}>{o.planes_mantenimiento?.tarea}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: o.estado === 'completado' ? '#d1fae5' : '#fef3c7', color: o.estado === 'completado' ? '#065f46' : '#92400e' }}>
                      {o.estado}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#374151' }}>{formatearFecha(o.completado_at)}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6b7280' }}>{o.notas}</td>
                  <td style={{ padding: '14px 16px', display: 'flex', gap: '8px' }}>
                    {o.estado === 'pendiente' && (
                      <button onClick={() => completarOrden(o.id, o.plan_id, o.planes_mantenimiento?.frecuencia_horas)} style={{ padding: '6px 12px', backgroundColor: 'transparent', color: '#065f46', border: '1px solid #065f46', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                        Completar
                      </button>
                    )}
                    <button onClick={() => eliminarOrden(o.id)} style={{ padding: '6px 12px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}