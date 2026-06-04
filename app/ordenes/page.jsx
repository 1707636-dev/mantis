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

  useEffect(() => {
    cargarDatos()
  }, [])
  async function cargarDatos() {
    const { data: ordenesData } = await supabase
      .from('ordenes_trabajo')
      .select('*, activos(nombre), planes_mantenimiento(tarea)')
    const { data: activosData } = await supabase.from('activos').select('*')
    const { data: planesData } = await supabase.from('planes_mantenimiento').select('*')
    setOrdenes(ordenesData || [])
    setActivos(activosData || [])
    setPlanes(planesData || [])
  }

  async function crearOrden() {
    if (!activoId || !planId) return
    await supabase.from('ordenes_trabajo').insert({
      activo_id: activoId,
      plan_id: planId,
      notas,
      estado: 'pendiente'
    })
    setActivoId('')
    setPlanId('')
    setNotas('')
    cargarDatos()
  }

  async function completarOrden(id) {
    await supabase
      .from('ordenes_trabajo')
      .update({ estado: 'completado', completado_at: new Date() })
      .eq('id', id)
    cargarDatos()
  }
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Órdenes de trabajo</h1>
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
        <select value={activoId} onChange={e => setActivoId(e.target.value)} style={{ padding: '8px', fontSize: '16px' }}>
          <option value=''>Seleccioná un activo</option>
          {activos.map(a => (<option key={a.id} value={a.id}>{a.nombre}</option>))}
        </select>
        <select value={planId} onChange={e => setPlanId(e.target.value)} style={{ padding: '8px', fontSize: '16px' }}>
          <option value=''>Seleccioná una tarea</option>
          {planes.map(p => (<option key={p.id} value={p.id}>{p.tarea}</option>))}
        </select>
        <textarea placeholder='Notas' value={notas} onChange={e => setNotas(e.target.value)} style={{ padding: '8px', fontSize: '16px', height: '80px' }} />
        <button onClick={crearOrden} style={{ padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Crear orden</button>
      </div>
      <table style={{ marginTop: '32px', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Activo</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Tarea</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Estado</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map(o => (
            <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{o.activos?.nombre}</td>
              <td style={{ padding: '8px' }}>{o.planes_mantenimiento?.tarea}</td>
              <td style={{ padding: '8px' }}>
                <span style={{ color: o.estado === 'completado' ? 'green' : 'orange', fontWeight: 'bold' }}>
                  {o.estado}
                </span>
              </td>
              <td style={{ padding: '8px' }}>
                {o.estado === 'pendiente' && (
                  <button onClick={() => completarOrden(o.id)} style={{ padding: '6px 12px', backgroundColor: '#16a34a', color: 'white', border: 'none', cursor: 'pointer' }}>Completar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}