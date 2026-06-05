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
  const router = useRouter()

  async function handleSubmit() {
    setError('')
    if (esRegistro) {
      const { data: empresaData } = await supabase
        .from('empresas').insert({ nombre: empresa }).select().single()

      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) return setError(error.message)

      await supabase.from('perfiles').insert({
        id: data.user.id,
        empresa_id: empresaData.id,
        rol: 'admin'
      })
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return setError('Email o contraseña incorrectos')
    }
    router.push('/')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: '#d1d5db', borderRadius: '12px', padding: '32px', border: '1px solid #9ca3af', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>
          {esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px' }}>Maintor — Gestión de mantenimiento</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {esRegistro && (
            <input placeholder="Nombre de tu empresa" value={empresa} onChange={e => setEmpresa(e.target.value)}
              style={{ padding: '10px 14px', fontSize: '14px', backgroundColor: '#e5e7eb', border: '1px solid #9ca3af', borderRadius: '8px', color: '#111827', outline: 'none' }} />
          )}
          <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ padding: '10px 14px', fontSize: '14px', backgroundColor: '#e5e7eb', border: '1px solid #9ca3af', borderRadius: '8px', color: '#111827', outline: 'none' }} />
          <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)}
            style={{ padding: '10px 14px', fontSize: '14px', backgroundColor: '#e5e7eb', border: '1px solid #9ca3af', borderRadius: '8px', color: '#111827', outline: 'none' }} />

          {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>}

          <button onClick={handleSubmit}
            style={{ padding: '10px', backgroundColor: '#111827', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            {esRegistro ? 'Registrarse' : 'Entrar'}
          </button>

          <button onClick={() => setEsRegistro(!esRegistro)}
            style={{ padding: '10px', backgroundColor: 'transparent', color: '#374151', border: '1px solid #9ca3af', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
            {esRegistro ? '¿Ya tenés cuenta? Iniciá sesión' : '¿No tenés cuenta? Registrate'}
          </button>
        </div>
      </div>
    </div>
  )
}