'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Planes() {
  const [planes, setPlanes] = useState([])
  const [activos, setActivos] = useState([])
  const [tarea, setTarea] = useState('')
  const [frecuencia, setFrecuencia] = useState('')
  const [activoId, setActivoId] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    const { data: planesData } = await supabase
      .from('planes_mantenimiento')
      .select('*, activos(nombre)')
    const { data: activosData } = await supabase
      .from('activos')
      .select('*')
    setPlanes(planesData || [])
    setActivos(activosData || [])
  }

  async function agregarPlan() {
    if (!tarea || !frecuencia || !activoId) return
    await supabase.from('planes_mantenimiento').insert({
      tarea,
      frecuencia_horas: parseInt(frecuencia),
      activo_id: activoId
    })
    setTarea('')
    setFrecuencia('')
    setActivoId('')
    cargarDatos()
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Planes de mantenimiento</h1>

      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
        <select value={activoId} onChange={e => setActivoId(e.target.value)} style={{ padding: '8px', fontSize: '16px' }}>
          <option value=''>Seleccioná un activo</option>
          {activos.map(a => (
            <option key={a.id} value={a.id}>{a.nombre}</option>
          ))}
        </select>
        <input placeholder="Tarea (ej: Cambio de aceite)" value={tarea} onChange={e => setTarea(e.target.value)} style={{ padding: '8px', fontSize: '16px' }} />
        <input placeholder="Cada cuántas horas (ej: 500)" value={frecuencia} onChange={e => setFrecuencia(e.target.value)} style={{ padding: '8px', fontSize: '16px' }} type="number" />
        <button onClick={agregarPlan} style={{ padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
          Agregar plan
        </button>
      </div>

      <table style={{ marginTop: '32px', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Activo</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Tarea</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Cada (hs)</th>
          </tr>
        </thead>
        <tbody>
          {planes.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{p.activos?.nombre}</td>
              <td style={{ padding: '8px' }}>{p.tarea}</td>
              <td style={{ padding: '8px' }}>{p.frecuencia_horas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}