'use client'

interface Contenido {
  id: number
  titulo: string
  miniatura_url: string
  enlace: string
  orden: number
}

interface Props {
  patreonUrl: string
  patreonTexto: string
  contenidos: Contenido[]
}

export default function PatreonSection({ patreonUrl, patreonTexto, contenidos }: Props) {
  if (!patreonUrl && contenidos.length === 0) return null

  return (
    <section id="patreon" style={{ background: 'linear-gradient(to bottom, #0e120b, #1a0f08)', position: 'relative', overflow: 'hidden' }}>

      {/* Fondo decorativo */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,66,33,0.04), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>

          {/* Logo Patreon SVG */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="20" r="16" fill="#FF424D"/>
              <rect x="4" y="4" width="10" height="44" fill="#052D49"/>
            </svg>
          </div>

          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#FF424D', marginBottom: '1rem', opacity: 0.9 }}>
            — Contenido exclusivo —
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--cream)', maxWidth: 650, margin: '0 auto 1.2rem', lineHeight: 1.2 }}>
            Más allá de <em style={{ fontStyle: 'italic', color: '#FF424D' }}>la cámara</em>
          </h2>

          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontStyle: 'italic', color: 'var(--cream-dim)', maxWidth: 560, margin: '0 auto', lineHeight: 1.8, padding: '0 1rem' }}>
            {patreonTexto}
          </p>
        </div>

        {/* Grid de miniaturas */}
        {contenidos.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.2rem', marginBottom: '3rem' }}>
            {contenidos.map(c => (
              <a key={c.id} href={c.enlace} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', position: 'relative', cursor: 'pointer' }}
                onMouseEnter={e => { const el = e.currentTarget.querySelector('.overlay') as HTMLElement; if (el) el.style.opacity = '1' }}
                onMouseLeave={e => { const el = e.currentTarget.querySelector('.overlay') as HTMLElement; if (el) el.style.opacity = '0' }}>

                {/* Miniatura */}
                <div style={{ position: 'relative', paddingBottom: '56.25%', overflow: 'hidden', border: '1px solid rgba(255,66,61,0.2)', background: '#1b1008' }}>
                  <img src={c.miniatura_url} alt={c.titulo} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />

                  {/* Overlay candado */}
                  <div className="overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(10,5,0,0.65)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', opacity: 0, transition: 'opacity 0.3s' }}>
                    <div style={{ fontSize: '2rem' }}>🔒</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF424D' }}>Ver en Patreon</div>
                  </div>

                  {/* Badge versión extendida */}
                  <div style={{ position: 'absolute', top: 10, left: 10, background: '#FF424D', color: 'white', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', fontWeight: 700 }}>
                    Versión extendida
                  </div>
                </div>

                {/* Título */}
                <div style={{ padding: '0.8rem 0 0', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,66,61,0.7)', flexShrink: 0, marginTop: '2px' }}>🔒</span>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--cream-dim)', lineHeight: 1.4 }}>{c.titulo}</div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* CTA Patreon */}
        {patreonUrl && (
          <div style={{ textAlign: 'center' }}>
            <a href={patreonUrl} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
              background: '#FF424D', color: 'white',
              padding: '1rem 2.5rem',
              fontFamily: "'Space Mono', monospace", fontSize: '0.8rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              textDecoration: 'none', fontWeight: 700,
              transition: 'all 0.3s',
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,66,61,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
              <svg width="18" height="18" viewBox="0 0 52 52" fill="none"><circle cx="32" cy="20" r="16" fill="white"/><rect x="4" y="4" width="10" height="44" fill="rgba(255,255,255,0.7)"/></svg>
              Únete en Patreon
            </a>
            <p style={{ marginTop: '1.2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--cream-dim)', opacity: 0.5, textTransform: 'uppercase' }}>
              Cancela cuando quieras
            </p>
          </div>
        )}

      </div>
    </section>
  )
}
