'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Activos() {
  const [activos, setActivos] = useState([])
  const [nombre, setNombre] = useState('')
  const [modelo, setModelo] = useState('')
  const [ubicacion, setUbicacion] = useState('')

  useEffect(() => {
    cargarActivos()
  }, [])

  async function cargarActivos() {
    const { data } = await supabase.from('activos').select('*')
    setActivos(data || [])
  }

  async function agregarActivo() {
    if (!nombre) return
    await supabase.from('activos').insert({ nombre, modelo, ubicacion })
    setNombre('')
    setModelo('')
    setUbicacion('')
    cargarActivos()
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Activos</h1>
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
        <input placeholder="Nombre *" value={nombre} onChange={e => setNombre(e.target.value)} style={{ padding: '8px', fontSize: '16px' }} />
        <input placeholder="Modelo" value={modelo} onChange={e => setModelo(e.target.value)} style={{ padding: '8px', fontSize: '16px' }} />
        <input placeholder="Ubicación" value={ubicacion} onChange={e => setUbicacion(e.target.value)} style={{ padding: '8px', fontSize: '16px' }} />
        <button onClick={agregarActivo} style={{ padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
          Agregar activo
        </button>
      </div>
      <table style={{ marginTop: '32px', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Nombre</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Modelo</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {activos.map(a => (
            <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{a.nombre}</td>
              <td style={{ padding: '8px' }}>{a.modelo}</td>
              <td style={{ padding: '8px' }}>{a.ubicacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}