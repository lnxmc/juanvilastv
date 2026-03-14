'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function login(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Credenciales incorrectas')
    else router.push('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0e120b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={login} style={{ background: '#1b2415', border: '1px solid rgba(200,160,74,0.3)', padding: '3rem', width: 380, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <h1 style={{ fontFamily: 'Georgia', color: '#c8a04a', fontSize: '1.8rem' }}>Admin</h1>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email" required
          style={{ background: '#0e120b', border: '1px solid rgba(200,160,74,0.3)', color: '#f0e6c8', padding: '0.8rem 1rem', fontFamily: 'inherit', fontSize: '1rem' }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña" required
          style={{ background: '#0e120b', border: '1px solid rgba(200,160,74,0.3)', color: '#f0e6c8', padding: '0.8rem 1rem', fontFamily: 'inherit', fontSize: '1rem' }} />
        {error && <p style={{ color: '#e74c3c', fontSize: '0.85rem' }}>{error}</p>}
        <button type="submit" style={{ background: '#c8a04a', color: '#0e120b', padding: '0.9rem', border: 'none', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.15em', cursor: 'pointer', textTransform: 'uppercase' }}>
          Entrar
        </button>
      </form>
    </div>
  )
}
