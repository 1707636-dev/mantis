'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Planes() {
  const [planes, setPlanes] = useState([])
  const [activos, setActivos] = useState([])
  const [tarea, setTarea] = useState('')
  const [frecuencia, setFrecuencia] = useState('')
  const [activoId, setActivoId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { cargarDatos() }, [])

  async function cargarDatos() {
    setLoading(true)
    const { data: planesData } = await supabase.from('planes_mantenimiento').select('*, activos(nombre)')
    const { data: activosData } = await supabase.from('activos').select('*')
    setPlanes(planesData || [])
    setActivos(activosData || [])
    setLoading(false)
  }

  async function agregarPlan() {
    if (!tarea || !frecuencia || !activoId) return
    await supabase.from('planes_mantenimiento').insert({ tarea, frecuencia_horas: parseInt(frecuencia), activo_id: activoId })
    setTarea('')
    setFrecuencia('')
    setActivoId('')
    cargarDatos()
  }

  async function eliminarPlan(id) {
    await supabase.from('planes_mantenimiento').delete().eq('id', id)
    cargarDatos()
  }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>Planes de mantenimiento</h1>
      <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 32px' }}>Tareas programadas por activo</p>

      <div style={{ backgroundColor: '#d1d5db', borderRadius: '12px', padding: '24px', border: '1px solid #9ca3af', marginBottom: '24px', maxWidth: '480px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '15px', color: '#374151', fontWeight: '600' }}>Nuevo plan</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <select value={activoId} onChange={e => setActivoId(e.target.value)} style={{ padding: '10px 14px', fontSize: '14px', backgroundColor: '#e5e7eb', border: '1px solid #9ca3af', borderRadius: '8px', color: '#111827', outline: 'none' }}>
            <option value=''>Seleccioná un activo</option>
            {activos.map(a => (<option key={a.id} value={a.id}>{a.nombre}</option>))}
          </select>
          <input placeholder="Tarea (ej: Cambio de aceite)" value={tarea} onChange={e => setTarea(e.target.value)} style={{ padding: '10px 14px', fontSize: '14px', backgroundColor: '#e5e7eb', border: '1px solid #9ca3af', borderRadius: '8px', color: '#111827', outline: 'none' }} />
          <input placeholder="Cada cuántas horas (ej: 500)" value={frecuencia} onChange={e => setFrecuencia(e.target.value)} type="number" style={{ padding: '10px 14px', fontSize: '14px', backgroundColor: '#e5e7eb', border: '1px solid #9ca3af', borderRadius: '8px', color: '#111827', outline: 'none' }} />
          <button onClick={agregarPlan} style={{ padding: '10px', backgroundColor: '#111827', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            Agregar plan
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#d1d5db', borderRadius: '12px', border: '1px solid #9ca3af', overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: '24px', color: '#6b7280', margin: 0 }}>Cargando...</p>
        ) : planes.length === 0 ? (
          <p style={{ padding: '24px', color: '#6b7280', margin: 0 }}>No hay planes registrados.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#9ca3af' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#374151', textTransform: 'uppercase', letterSpacing: '1px' }}>Activo</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#374151', textTransform: 'uppercase', letterSpacing: '1px' }}>Tarea</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#374151', textTransform: 'uppercase', letterSpacing: '1px' }}>Frecuencia</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#374151', textTransform: 'uppercase', letterSpacing: '1px' }}></th>
              </tr>
            </thead>
            <tbody>
              {planes.map((p, i) => (
                <tr key={p.id} style={{ borderTop: '1px solid #9ca3af', backgroundColor: i % 2 === 0 ? '#d1d5db' : '#c4c9d0' }}>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#111827' }}>{p.activos?.nombre}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#374151' }}>{p.tarea}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#374151' }}>Cada {p.frecuencia_horas} hs</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => eliminarPlan(p.id)} style={{ padding: '6px 12px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
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