'use client'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Credenciales incorrectas'); setLoading(false) }
    else router.push('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0e120b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={login} style={{ background: '#1b2415', border: '1px solid rgba(200,160,74,0.3)', padding: '3rem', width: 380, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <h1 style={{ fontFamily: 'Georgia', color: '#c8a04a', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Admin</h1>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email" required
          style={{ background: '#0e120b', border: '1px solid rgba(200,160,74,0.3)', color: '#f0e6c8', padding: '0.8rem 1rem', fontFamily: 'inherit', fontSize: '1rem' }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña" required
          style={{ background: '#0e120b', border: '1px solid rgba(200,160,74,0.3)', color: '#f0e6c8', padding: '0.8rem 1rem', fontFamily: 'inherit', fontSize: '1rem' }} />
        {error && <p style={{ color: '#e74c3c', fontSize: '0.85rem' }}>{error}</p>}
        <button type="submit" disabled={loading}
          style={{ background: '#c8a04a', color: '#0e120b', padding: '0.9rem', border: 'none', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.15em', cursor: 'pointer', textTransform: 'uppercase' }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
