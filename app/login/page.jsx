'use client'
import { useState } from 'react'
import { supabase } from '../supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [esRegistro, setEsRegistro] = useState(false)
  const [empresa, setEmpresa] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit() {
    setError('')
    setLoading(true)
    if (esRegistro) {
      const { data: empresaData } = await supabase
        .from('empresas').insert({ nombre: empresa }).select().single()
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      await supabase.from('perfiles').insert({
        id: data.user.id,
        empresa_id: empresaData.id,
        rol: 'admin'
      })
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError('Email o contraseña incorrectos'); setLoading(false); return }
    }
    router.push('/')
  }

  const inputStyle = {
    padding: '12px 16px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    color: '#111827',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#f9fafb',
    }}>
      {/* Panel izquierdo */}
      <div style={{
        flex: 1,
        backgroundColor: '#111827',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        maxWidth: '480px',
      }}>
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#ffffff', margin: '0 0 8px', letterSpacing: '-1px' }}>Maintor</h1>
          <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>Gestión de mantenimiento preventivo</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[
            { titulo: '📋 Planes de mantenimiento', desc: 'Programá tareas por activo y frecuencia' },
            { titulo: '⚙️ Órdenes de trabajo', desc: 'Creá y completá órdenes en tiempo real' },
            { titulo: '📅 Calendario preventivo', desc: 'Visualizá próximos mantenimientos' },
          ].map((item) => (
            <div key={item.titulo} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600', color: '#f9fafb' }}>{item.titulo}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>
              {esRegistro ? 'Crear cuenta' : 'Bienvenido de vuelta'}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              {esRegistro ? 'Registrá tu empresa para empezar' : 'Ingresá tus datos para continuar'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {esRegistro && (
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Nombre de la empresa</label>
                <input
                  placeholder="Ej: Industrias Pérez S.A."
                  value={empresa}
                  onChange={e => setEmpresa(e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Email</label>
              <input
                placeholder="tu@email.com"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Contraseña</label>
              <input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            {error && (
              <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px' }}>
                <p style={{ color: '#dc2626', fontSize: '13px', margin: 0 }}>{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '12px',
                backgroundColor: loading ? '#6b7280' : '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                marginTop: '4px',
                transition: 'background-color 0.2s',
              }}>
              {loading ? 'Cargando...' : esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>

            <div style={{ textAlign: 'center', paddingTop: '8px' }}>
              <button
                onClick={() => { setEsRegistro(!esRegistro); setError('') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#6b7280' }}>
                {esRegistro ? '¿Ya tenés cuenta? ' : '¿No tenés cuenta? '}
                <span style={{ color: '#111827', fontWeight: '600' }}>
                  {esRegistro ? 'Iniciá sesión' : 'Registrate gratis'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}