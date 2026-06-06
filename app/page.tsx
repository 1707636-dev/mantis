'use client'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

const SECTORES = ['Mantenimiento', 'Compras', 'Producción']
const PERSONAS = ['David Bustos', 'José Ysach', 'Jesús Bottino', 'Maximiliano Scarafia']
const ACTIVOS = ['Fripack', 'Dosificadora 1', 'Dosificadora 2', 'Dosificadora 3']
const TAREAS = ['Preventiva', 'Correctiva', 'Otros']

const colorSector: Record<string, { bg: string; color: string }> = {
  'Mantenimiento': { bg: '#dbeafe', color: '#1d4ed8' },
  'Compras': { bg: '#fef3c7', color: '#92400e' },
  'Producción': { bg: '#d1fae5', color: '#065f46' },
}

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState<any>({
    sector: '', persona: '', activo: '', tipo_tarea: '',
    descripcion: '', observaciones: '', costo: '',
  })
  const [otrosTarea, setOtrosTarea] = useState('')

  useEffect(() => { cargarOrdenes() }, [])

  async function cargarOrdenes() {
    setLoading(true)
    const { data } = await supabase.from('ordenes_trabajo').select('*').order('created_at', { ascending: false })
    setOrdenes(data || [])
    setLoading(false)
  }

  function setField(key: string, value: string) {
    setForm((f: any) => ({ ...f, [key]: value }))
  }

  async function guardarOrden() {
    if (!form.sector || !form.persona || !form.activo || !form.tipo_tarea) return
    const tarea = form.tipo_tarea === 'Otros' ? otrosTarea : form.tipo_tarea
    await supabase.from('ordenes_trabajo').insert({
      sector: form.sector, persona: form.persona, activo: form.activo,
      tipo_tarea: tarea, descripcion: form.descripcion,
      observaciones: form.observaciones, estado: 'pendiente',
      costo: parseFloat(form.costo) || 0, aprobado: null,
    })
    resetForm()
    cargarOrdenes()
  }

  async function marcarRealizado(id: string) {
    await supabase.from('ordenes_trabajo').update({
      estado: 'completado',
      fecha_estado: new Date().toISOString().split('T')[0],
      completado_at: new Date()
    }).eq('id', id)
    cargarOrdenes()
  }

  async function aprobarOrden(id: string, valor: boolean) {
    await supabase.from('ordenes_trabajo').update({ aprobado: valor }).eq('id', id)
    cargarOrdenes()
  }

  async function eliminarOrden(id: string) {
    await supabase.from('ordenes_trabajo').delete().eq('id', id)
    cargarOrdenes()
  }

  function resetForm() {
    setForm({ sector: '', persona: '', activo: '', tipo_tarea: '', descripcion: '', observaciones: '', costo: '' })
    setOtrosTarea('')
    setMostrarForm(false)
  }

  function imprimirOrden(o: any) {
    const ventana = window.open('', '_blank')
    if (!ventana) return
    ventana.document.write(`
      <html><head><title>Orden ${o.sector}</title>
      <style>body{font-family:Arial;padding:32px;color:#111} h1{font-size:20px} table{width:100%;border-collapse:collapse;margin-top:16px} td,th{border:1px solid #ccc;padding:8px;font-size:13px} th{background:#f3f4f6}</style>
      </head><body>
      <h1>Orden de ${o.sector}</h1>
      <table>
        <tr><th>Sector</th><td>${o.sector}</td><th>Activo</th><td>${o.activo}</td></tr>
        <tr><th>Persona</th><td>${o.persona}</td><th>Tarea</th><td>${o.tipo_tarea}</td></tr>
        <tr><th>Descripción</th><td colspan="3">${o.descripcion || '—'}</td></tr>
        <tr><th>Estado</th><td>${o.estado}</td><th>Fecha</th><td>${o.fecha_estado || '—'}</td></tr>
        <tr><th>Observaciones</th><td colspan="3">${o.observaciones || '—'}</td></tr>
        <tr><th>Costo</th><td colspan="3">$${o.costo || 0}</td></tr>
      </table>
      </body></html>
    `)
    ventana.document.close()
    ventana.print()
  }

  function exportarExcel(o: any) {
    const csv = `Sector,Activo,Persona,Tarea,Descripción,Estado,Fecha,Observaciones,Costo\n${o.sector},${o.activo},${o.persona},${o.tipo_tarea},"${o.descripcion || ''}",${o.estado},${o.fecha_estado || ''},"${o.observaciones || ''}",${o.costo || 0}`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orden_${o.sector}_${o.id}.csv`
    a.click()
  }

  const selectStyle = { padding: '10px 14px', fontSize: '14px', backgroundColor: '#e5e7eb', border: '1px solid #9ca3af', borderRadius: '8px', color: '#111827', outline: 'none', width: '100%' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>Órdenes de trabajo</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Gestión de tareas por sector</p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={{ padding: '10px 20px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
          + Nueva orden
        </button>
      </div>

      {mostrarForm && (
        <div style={{ backgroundColor: '#d1d5db', borderRadius: '12px', padding: '24px', border: '1px solid #9ca3af', marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '15px', color: '#374151', fontWeight: '600' }}>
            {form.sector ? `Orden de ${form.sector}` : 'Nueva orden'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Sector</label>
              <select value={form.sector} onChange={e => setField('sector', e.target.value)} style={selectStyle}>
                <option value=''>Seleccioná un sector</option>
                {SECTORES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Persona a ejecutar</label>
              <select value={form.persona} onChange={e => setField('persona', e.target.value)} style={selectStyle}>
                <option value=''>Seleccioná una persona</option>
                {PERSONAS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Activo</label>
              <select value={form.activo} onChange={e => setField('activo', e.target.value)} style={selectStyle}>
                <option value=''>Seleccioná un activo</option>
                {ACTIVOS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Tarea</label>
              <select value={form.tipo_tarea} onChange={e => setField('tipo_tarea', e.target.value)} style={selectStyle}>
                <option value=''>Seleccioná una tarea</option>
                {TAREAS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {form.tipo_tarea === 'Otros' && (
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>¿Cuál es la tarea?</label>
                <input placeholder="Describí la tarea" value={otrosTarea} onChange={e => setOtrosTarea(e.target.value)} style={selectStyle} />
              </div>
            )}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Descripción de la tarea</label>
              <textarea placeholder="Detallá qué hay que hacer..." value={form.descripcion} onChange={e => setField('descripcion', e.target.value)}
                style={{ ...selectStyle, height: '80px', resize: 'none' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Observaciones</label>
              <textarea placeholder="Observaciones adicionales..." value={form.observaciones} onChange={e => setField('observaciones', e.target.value)}
                style={{ ...selectStyle, height: '60px', resize: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Costo estimado ($)</label>
              <input type="number" placeholder="0" value={form.costo} onChange={e => setField('costo', e.target.value)} style={selectStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button onClick={guardarOrden} style={{ padding: '10px 20px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              Guardar
            </button>
            <button onClick={resetForm} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#374151', border: '1px solid #9ca3af', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading ? (
          <p style={{ color: '#6b7280' }}>Cargando...</p>
        ) : ordenes.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No hay órdenes registradas.</p>
        ) : ordenes.map((o: any) => (
          <div key={o.id} style={{ backgroundColor: '#d1d5db', borderRadius: '12px', border: '1px solid #9ca3af', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', backgroundColor: colorSector[o.sector]?.bg || '#e5e7eb', color: colorSector[o.sector]?.color || '#374151' }}>
                  {o.sector}
                </span>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: o.estado === 'completado' ? '#d1fae5' : '#fef3c7', color: o.estado === 'completado' ? '#065f46' : '#92400e' }}>
                  {o.estado}
                </span>
                {o.aprobado === true && <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: '#d1fae5', color: '#065f46' }}>✓ Aprobado</span>}
                {o.aprobado === false && <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: '#fee2e2', color: '#dc2626' }}>✗ Rechazado</span>}
                {o.fecha_estado && <span style={{ fontSize: '12px', color: '#6b7280' }}>{o.fecha_estado}</span>}
                {o.costo > 0 && <span style={{ fontSize: '12px', color: '#374151', fontWeight: '600' }}>${o.costo}</span>}
              </div>
              <button onClick={() => eliminarOrden(o.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px' }}>Eliminar</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <div><p style={{ margin: '0 0 2px', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Activo</p><p style={{ margin: 0, fontSize: '14px', color: '#111827', fontWeight: '500' }}>{o.activo}</p></div>
              <div><p style={{ margin: '0 0 2px', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Tarea</p><p style={{ margin: 0, fontSize: '14px', color: '#111827', fontWeight: '500' }}>{o.tipo_tarea}</p></div>
              <div><p style={{ margin: '0 0 2px', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Persona</p><p style={{ margin: 0, fontSize: '14px', color: '#111827', fontWeight: '500' }}>{o.persona}</p></div>
            </div>

            {o.descripcion && <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#374151', backgroundColor: '#e5e7eb', padding: '10px', borderRadius: '8px' }}>{o.descripcion}</p>}
            {o.observaciones && <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>Obs: {o.observaciones}</p>}

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              {o.estado === 'pendiente' && (
                <button onClick={() => marcarRealizado(o.id)} style={{ padding: '8px 16px', backgroundColor: '#065f46', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                  ✓ Realizado
                </button>
              )}
              {o.aprobado === null && (
                <>
                  <button onClick={() => aprobarOrden(o.id, true)} style={{ padding: '8px 16px', backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                    ✓ Aprobar
                  </button>
                  <button onClick={() => aprobarOrden(o.id, false)} style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    ✗ Rechazar
                  </button>
                </>
              )}
              <button onClick={() => imprimirOrden(o)} style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#374151', border: '1px solid #9ca3af', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                🖨 Imprimir
              </button>
              <button onClick={() => exportarExcel(o)} style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#374151', border: '1px solid #9ca3af', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                📊 Exportar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}