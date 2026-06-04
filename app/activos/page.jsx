'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Activos() {
  const [activos, setActivos] = useState([])
  const [nombre, setNombre] = useState('')
  const [modelo, setModelo] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { cargarActivos() }, [])

  async function cargarActivos() {
    setLoading(true)
    const { data } = await supabase.from('activos').select('*')
    setActivos(data || [])
    setLoading(false)
  }

  async function eliminarActivo(id) {
    await supabase.from('activos').delete().eq('id', id)
    cargarActivos()
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
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 4px' }}>Activos</h1>
      <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 32px' }}>Máquinas y equipos registrados</p>

      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155', marginBottom: '24px', maxWidth: '480px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '15px', color: '#94a3b8', fontWeight: '600' }}>Nuevo activo</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            placeholder="Nombre *"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            style={{ padding: '10px 14px', fontSize: '14px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', outline: 'none' }}
          />
          <input
            placeholder="Modelo"
            value={modelo}
            onChange={e => setModelo(e.target.value)}
            style={{ padding: '10px 14px', fontSize: '14px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', outline: 'none' }}
          />
          <input
            placeholder="Ubicación"
            value={ubicacion}
            onChange={e => setUbicacion(e.target.value)}
            style={{ padding: '10px 14px', fontSize: '14px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', outline: 'none' }}
          />
          <button
            onClick={agregarActivo}
            style={{ padding: '10px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
          >
            Agregar activo
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: '24px', color: '#64748b', margin: 0 }}>Cargando...</p>
        ) : activos.length === 0 ? (
          <p style={{ padding: '24px', color: '#64748b', margin: 0 }}>No hay activos registrados.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Nombre</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Modelo</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Ubicación</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}></th>
              </tr>
            </thead>
            <tbody>
              {activos.map((a, i) => (
                <tr key={a.id} style={{ borderTop: '1px solid #334155', backgroundColor: i % 2 === 0 ? 'transparent' : '#162032' }}>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#e2e8f0' }}>{a.nombre}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#94a3b8' }}>{a.modelo}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: '#94a3b8' }}>{a.ubicacion}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => eliminarActivo(a.id)}
                      style={{ padding: '6px 12px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                    >
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