'use client'
import { useState } from 'react'

interface Props {
  bizumNumero: string
  paypalUsuario: string
  contactoEmail: string
}

export default function DonacionesSection({ bizumNumero, paypalUsuario, contactoEmail }: Props) {
  const [selectedAmount, setSelectedAmount] = useState(10)
  const [bizumCopied, setBizumCopied] = useState(false)
  const amounts = [5, 10, 25, 50, 100]

  function copyBizum() {
    if (!bizumNumero) return
    navigator.clipboard.writeText(bizumNumero)
    setBizumCopied(true)
    setTimeout(() => setBizumCopied(false), 2500)
  }

  return (
    <section id="donaciones" style={{ background: 'linear-gradient(135deg, #0e120b 0%, #1a1005 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', maxWidth: 600, maxHeight: 600, background: 'radial-gradient(circle, rgba(200,160,74,0.04), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
          — Ayuda a que esto avance —
        </div>

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 5vw, 3.2rem)', fontWeight: 700, color: 'var(--cream)', maxWidth: 600, margin: '0 auto 1rem', lineHeight: 1.2 }}>
          ¿Quieres que llegue <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>más lejos</em> y más rápido?
        </h2>

        <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontStyle: 'italic', color: 'var(--cream-dim)', maxWidth: 520, margin: '0 auto 3rem', lineHeight: 1.8, padding: '0 1rem' }}>
          Cada euro va directo a una máquina, un litro de gasolina o un flete. Sin intermediarios.
        </p>

        {/* Amounts */}
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap', padding: '0 1rem' }}>
          {amounts.map(a => (
            <button key={a} onClick={() => setSelectedAmount(a)} style={{
              padding: '0.5rem 1.2rem',
              border: '1px solid',
              borderColor: selectedAmount === a ? 'var(--gold)' : 'rgba(200,160,74,0.2)',
              background: selectedAmount === a ? 'var(--gold)' : 'transparent',
              color: selectedAmount === a ? 'var(--bg-deep)' : 'var(--cream-dim)',
              fontFamily: "'Space Mono', monospace", fontSize: '0.8rem',
              cursor: 'pointer', letterSpacing: '0.1em',
              fontWeight: selectedAmount === a ? 700 : 400,
              transition: 'all 0.25s',
            }}>{a} €</button>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap', padding: '0 1rem' }}>

          {/* PayPal */}
          {paypalUsuario && (
            <a href={`https://paypal.me/${paypalUsuario}`} target="_blank" style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              padding: '2rem 1.5rem', width: 'clamp(160px, 28vw, 220px)', textAlign: 'center',
              textDecoration: 'none', cursor: 'pointer', display: 'flex',
              flexDirection: 'column', alignItems: 'center', gap: '0.7rem',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(0,112,186,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>💳</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cream)', fontWeight: 700 }}>PayPal</div>
              <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--cream-dim)', lineHeight: 1.5 }}>Pago rápido con tarjeta</div>
            </a>
          )}

          {/* Bizum */}
          {bizumNumero && (
            <div onClick={copyBizum} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              padding: '2rem 1.5rem', width: 'clamp(160px, 28vw, 220px)', textAlign: 'center',
              cursor: 'pointer', display: 'flex',
              flexDirection: 'column', alignItems: 'center', gap: '0.7rem',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(28,196,162,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📱</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cream)', fontWeight: 700 }}>Bizum</div>
              <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: bizumCopied ? 'var(--green-gain-light)' : 'var(--cream-dim)', lineHeight: 1.5, transition: 'color 0.3s' }}>
                {bizumCopied ? '✓ Número copiado' : 'Toca para copiar'}
              </div>
            </div>
          )}

          {/* Contacto */}
          {contactoEmail && (
            <a href={`mailto:${contactoEmail}?subject=Quiero%20apoyarte`} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              padding: '2rem 1.5rem', width: 'clamp(160px, 28vw, 220px)', textAlign: 'center',
              textDecoration: 'none', cursor: 'pointer', display: 'flex',
              flexDirection: 'column', alignItems: 'center', gap: '0.7rem',
              transition: 'transform 0.3s', color: 'inherit',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(200,160,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>✉️</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cream)', fontWeight: 700 }}>Contacto</div>
              <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--cream-dim)', lineHeight: 1.5 }}>¿Otra forma de apoyar?</div>
            </a>
          )}

        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--cream-dim)', opacity: 0.7 }}>
          100% transparente · Todo lo que entra aparece en ingresos
        </p>
      </div>
    </section>
  )
}
