import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Mantis — Mantenimiento Preventivo</h1>
      <nav style={{ marginTop: '20px', display: 'flex', gap: '16px' }}>
        <Link href="/activos">Activos</Link>
        <Link href="/planes">Planes de mantenimiento</Link>
        <Link href="/ordenes">Órdenes de trabajo</Link>
        <Link href="/login">Iniciar sesión</Link>
      </nav>
    </main>
  )
}