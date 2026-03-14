'use client'

export default function HeroSection() {
  return (
    <section id="hero" style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '8rem 3rem 4rem',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(107,140,58,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 80% at 20% 80%, rgba(200,160,74,0.06) 0%, transparent 50%), linear-gradient(160deg, #0e120b 0%, #141a0f 50%, #1a1005 100%)',
      }} />

      {/* Decorative branch */}
      <svg style={{ position: 'absolute', right: -60, top: '50%', transform: 'translateY(-50%)', opacity: 0.07, width: 600, pointerEvents: 'none' }}
        viewBox="0 0 500 700" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M250 650 Q200 500 220 350 Q240 200 180 100" stroke="#8fbc50" strokeWidth="3" fill="none"/>
        <ellipse cx="190" cy="320" rx="28" ry="14" fill="#8fbc50" transform="rotate(-30 190 320)"/>
        <ellipse cx="210" cy="260" rx="28" ry="14" fill="#8fbc50" transform="rotate(20 210 260)"/>
        <ellipse cx="195" cy="390" rx="30" ry="13" fill="#8fbc50" transform="rotate(-50 195 390)"/>
        <ellipse cx="215" cy="450" rx="26" ry="12" fill="#8fbc50" transform="rotate(15 215 450)"/>
        <ellipse cx="188" cy="185" rx="24" ry="11" fill="#8fbc50" transform="rotate(-10 188 185)"/>
        <circle cx="191" cy="322" r="5" fill="#c8a04a"/>
        <circle cx="212" cy="263" r="4" fill="#c8a04a"/>
        <circle cx="196" cy="393" r="5" fill="#c8a04a"/>
      </svg>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: '0.72rem',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: '1.5rem'
        }}>
          ↳ Temporada 2026 · Jaén · 1.000 olivos Picual
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(3.5rem, 8vw, 7rem)',
          fontWeight: 900, lineHeight: 1.0,
          color: 'var(--cream)', maxWidth: 800,
        }}>
          Juan Vilas
          <em style={{ display: 'block', fontStyle: 'italic', color: 'var(--gold)', fontWeight: 400, fontSize: '0.75em' }}>
            Del código al olivar
          </em>
        </h1>

        <p style={{
          marginTop: '2rem', fontSize: '1.25rem',
          color: 'var(--cream-dim)', maxWidth: 560,
          fontStyle: 'italic', lineHeight: 1.8,
        }}>
          Dejé el ordenador por las montañas de Jaén. Aquí está el relato honesto, sin filtros y con todos los números sobre la mesa.
        </p>

        <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <a href="#finanzas" className="btn-primary">Ver las cuentas</a>
          <a href="#recorrido" className="btn-ghost">El recorrido</a>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        position: 'absolute', bottom: '4rem', right: '3rem',
        display: 'flex', gap: '3rem',
      }}>
        {[
          { number: '1.000', label: 'Olivos arrendados' },
          { number: '2026', label: 'Primera temporada' },
          { number: 'Picual', label: 'Variedad' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>{s.number}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginTop: '0.4rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: 50, height: 1, background: 'var(--gold-muted)' }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cream-dim)' }}>Desplázate</span>
      </div>
    </section>
  )
}
