import "./globals.css";
import Sidebar from "./Sidebar";

export const metadata = {
  title: "Maintor — Mantenimiento Preventivo",
  description: "Sistema de mantenimiento preventivo para empresas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#e5e7eb', color: '#111827', fontFamily: 'system-ui, sans-serif', minHeight: '100vh', display: 'flex' }}>
        <Sidebar />
        <main style={{ marginLeft: '240px', flex: 1, padding: '40px', minHeight: '100vh', backgroundColor: '#e5e7eb' }}>
          {children}
        </main>
      </body>
    </html>
  );
}