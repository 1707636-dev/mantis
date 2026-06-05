import "./globals.css";
import Sidebar from "./Sidebar";
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'

export const metadata = {
  title: "Maintor — Mantenimiento Preventivo",
  description: "Sistema de mantenimiento preventivo para empresas",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const headersList = await headers()
  const pathname = headersList.get('x-invoke-path') || ''

  const isLoginPage = pathname.includes('login')

  if (!isLoginPage) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() {}
        }
      }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      redirect('/login')
    }
  }

  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#e5e7eb', color: '#111827', fontFamily: 'system-ui, sans-serif', minHeight: '100vh', display: 'flex' }}>
        {!isLoginPage && <Sidebar />}
        <main style={{ marginLeft: isLoginPage ? '0' : '240px', flex: 1, padding: '40px', minHeight: '100vh', backgroundColor: '#e5e7eb' }}>
          {children}
        </main>
      </body>
    </html>
  );
}