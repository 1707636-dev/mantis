'use client'
import { useState } from 'react'
import { supabase } from '../supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function iniciarSesion() {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos')
    } else {
      router.push('/activos')
    }
  }

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h1 style={{ marginBottom: '8px' }}>Iniciar sesión</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button
          onClick={iniciarSesion}
          style={{ padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}
        >
          Entrar
        </button>
      </div>
    </main>
  )
}