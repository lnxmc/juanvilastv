'use client'
import { useState } from 'react'

type Hito = { id: number; nombre: string; descripcion: string; emoji: string; año_objetivo: number; completado: boolean; fecha_completado?: string; orden: number }

export default function RecorridoSection({ hitos }: { hitos: Hito[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const preview = hitos.slice(0, 5)

  return (
    <>
      <section id="recorrido" style={{ background: 'linear-gradient(to bottom, var(--bg-dark), #0e120b)' }}>
        <div className="section-header">
          <span className="section-number">02</span>
          <h2 className="section-title">El <em>recorrido</em></h2>
          <div className="section-divider" />
        </div>
        <p style={{ fontStyle: 'italic', color: 'var(--cream-dim)', marginBottom: '3rem', maxWidth: 600, fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', lineHeight: 1.8 }}>
          De cero a almazara propia. Cada hito conquistado es un capítulo más en esta historia. Los marcados en verde ya son nuestros.
        </p>

        <div style={{ position: 'relative' }}>
          {/* Línea horizontal decorativa */}
          <div className="roadmap-line" style={{ position: 'absolute', top: 80, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(200,160,74,0.5), rgba(138,109,46,1), rgba(200,160,74,0.2), transparent)', pointerEvents: 'none' }} />

          <div className="milestones-row">
            {preview.map(h => (
              <div key={h.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'relative', width: 90, height: 90, marginBottom: '1rem', flexShrink: 0 }}>
                  <div style={{
                    width: '100%', height: '100%',
                    border: `1px solid ${h.completado ? 'rgba(107,140,58,0.6)' : 'rgba(200,160,74,0.2)'}`,
                    background: h.completado ? 'rgba(107,140,58,0.08)' : 'var(--bg-card)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.2rem',
                  }}>
                    {h.emoji}
                  </div>
                  {h.completado && (
                    <div style={{ position: 'absolute', top: -8, right: -8, width: 26, height: 26, background: 'var(--green-gain)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'white', boxShadow: '0 0 0 3px var(--bg-dark)', zIndex: 2 }}>✓</div>
                  )}
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)', fontWeight: 700, color: h.completado ? 'var(--olive-light)' : 'var(--cream)', marginBottom: '0.3rem' }}>
                  {h.nombre}
                </div>
                <div style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.82rem)', fontStyle: 'italic', color: 'var(--cream-dim)', lineHeight: 1.4 }}>{h.descripcion}</div>
                <div style={{ marginTop: '0.5rem', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: h.completado ? 'var(--olive-light)' : 'var(--cream-dim)', opacity: h.completado ? 1 : 0.5 }}>
                  {h.completado ? '✓ Conseguido' : (h.fecha_texto || h.año_objetivo || '—')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn-ghost" onClick={() => setModalOpen(true)}>Ver todos los hitos →</button>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div onClick={e => { if (e.target === e.currentTarget) setModalOpen(false) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,14,8,0.92)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-strong)', maxWidth: 900, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 'clamp(1.5rem, 4vw, 3rem)', position: 'relative' }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: '1px solid var(--border)', color: 'var(--cream-dim)', width: 36, height: 36, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, color: 'var(--cream)', marginBottom: '0.5rem' }}>Todos los hitos</h3>
            <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--cream-dim)', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              De cero a almazara propia — el recorrido completo
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
              {hitos.map(h => (
                <div key={h.id} style={{ border: `1px solid ${h.completado ? 'rgba(107,140,58,0.4)' : 'rgba(200,160,74,0.2)'}`, background: h.completado ? 'rgba(107,140,58,0.05)' : 'var(--bg-dark)', padding: '1.2rem 0.8rem', textAlign: 'center', position: 'relative' }}>
                  {h.completado && (
                    <div style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, background: 'var(--green-gain)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'white', boxShadow: '0 0 0 2px var(--bg-dark)' }}>✓</div>
                  )}
                  <span style={{ fontSize: '1.8rem', marginBottom: '0.6rem', display: 'block' }}>{h.emoji}</span>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.82rem', fontWeight: 700, color: 'var(--cream)', marginBottom: '0.3rem' }}>{h.nombre}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--cream-dim)', letterSpacing: '0.08em' }}>
                    {h.completado ? '✓ Conseguido' : (h.fecha_texto || h.año_objetivo || '—')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
