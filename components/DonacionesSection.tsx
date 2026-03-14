'use client'
import { useState } from 'react'

export default function DonacionesSection() {
  const [selectedAmount, setSelectedAmount] = useState(10)
  const [bizumCopied, setBizumCopied] = useState(false)

  const amounts = [5, 10, 25, 50, 100]

  function copyBizum() {
    navigator.clipboard.writeText('+34640605331') // ← pon tu número real
    setBizumCopied(true)
    setTimeout(() => setBizumCopied(false), 2500)
  }

  return (
    <section id="donaciones" style={{
      background: 'linear-gradient(135deg, #0e120b 0%, #1a1005 100%)',
      textAlign: 'center', position: 'relative', overflow: 'hidden',
      maxWidth: 1400, margin: '0 auto',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(200,160,74,0.04), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
          — Ayuda a que esto avance —
        </div>

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, color: 'var(--cream)', maxWidth: 600, margin: '0 auto 1rem', lineHeight: 1.2 }}>
          ¿Quieres que llegue <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>más lejos</em> y más rápido?
        </h2>

        <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--cream-dim)', maxWidth: 520, margin: '0 auto 3.5rem', lineHeight: 1.8 }}>
          Cada euro va directo a una máquina, un litro de gasolina o un flete. Sin intermediarios. Aquí ves exactamente en qué se gasta.
        </p>

        {/* Amounts */}
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {amounts.map(a => (
            <button key={a} onClick={() => setSelectedAmount(a)} style={{
              padding: '0.5rem 1.5rem',
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

        {/* Donation cards */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>

          {/* PayPal */}
          <a href={`https://paypal.me/juanvilastv/${selectedAmount}EUR`} target="_blank" style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            padding: '2.5rem 2rem', width: 220, textAlign: 'center',
            textDecoration: 'none', cursor: 'pointer', display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: '0.8rem',
            transition: 'all 0.35s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(0,112,186,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>💳</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cream)', fontWeight: 700 }}>PayPal</div>
            <div style={{ fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--cream-dim)', lineHeight: 1.5 }}>Pago rápido con tu cuenta o tarjeta</div>
          </a>

          {/* Bizum */}
          <div onClick={copyBizum} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            padding: '2.5rem 2rem', width: 220, textAlign: 'center',
            cursor: 'pointer', display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: '0.8rem',
            transition: 'all 0.35s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(28,196,162,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>📱</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cream)', fontWeight: 700 }}>Bizum</div>
            <div style={{ fontSize: '0.82rem', fontStyle: 'italic', color: bizumCopied ? 'var(--green-gain-light)' : 'var(--cream-dim)', lineHeight: 1.5, transition: 'color 0.3s' }}>
              {bizumCopied ? '✓ Número copiado' : 'Toca para copiar el número'}
            </div>
          </div>

          {/* Contacto */}
          <a href="mailto:hola@juanvilas.com?subject=Quiero%20apoyarte" style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            padding: '2.5rem 2rem', width: 220, textAlign: 'center',
            textDecoration: 'none', cursor: 'pointer', display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: '0.8rem',
            transition: 'all 0.35s', color: 'inherit',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(200,160,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>✉️</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--cream)', fontWeight: 700 }}>Contacto</div>
            <div style={{ fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--cream-dim)', lineHeight: 1.5 }}>¿Tienes otra idea para apoyar?</div>
          </a>

        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--cream-dim)', opacity: 0.7 }}>
          100% transparente · Todo lo que entra aparece en la sección de ingresos
        </p>
      </div>
    </section>
  )
}
