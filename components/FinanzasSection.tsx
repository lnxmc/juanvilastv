'use client'

type Gasto = { id: number; nombre: string; importe: number; categoria: string; emoji: string; fecha: string; notas?: string }
type Ingreso = { id: number; nombre: string; importe: number; categoria: string; emoji: string; fecha: string; kilos_aceituna?: number; precio_kilo?: number }

interface Props {
  temporada: any
  temporadas: any[]
  gastos: Gasto[]
  ingresos: Ingreso[]
  totalGastos: number
  totalIngresos: number
}

export default function FinanzasSection({ temporada, temporadas, gastos, ingresos, totalGastos, totalIngresos }: Props) {
  const balance = totalIngresos - totalGastos
  const balancePositive = balance >= 0

  const fmt = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  return (
    <section id="finanzas" style={{ background: 'linear-gradient(to bottom, var(--bg-deep), var(--bg-dark))', maxWidth: 1400, margin: '0 auto' }}>
      <div className="section-header">
        <span className="section-number">01</span>
        <h2 className="section-title">Cuentas de <em>la temporada</em></h2>
        <div className="section-divider" />
      </div>

      {/* Season selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
        {temporadas.map(t => (
          <div key={t.id} style={{
            padding: '0.5rem 1.4rem',
            fontFamily: "'Space Mono', monospace", fontSize: '0.75rem',
            letterSpacing: '0.1em', cursor: 'default',
            border: '1px solid',
            borderColor: t.id === temporada?.id ? 'var(--gold)' : 'rgba(200,160,74,0.2)',
            background: t.id === temporada?.id ? 'var(--gold)' : 'transparent',
            color: t.id === temporada?.id ? 'var(--bg-deep)' : 'var(--cream-dim)',
            fontWeight: t.id === temporada?.id ? 700 : 400,
          }}>
            Temporada {t.año}
          </div>
        ))}
      </div>

      {/* Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        {/* GASTOS */}
        <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, var(--red-loss), transparent)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--red-loss-light)', marginBottom: '0.5rem' }}>
                Gastos · {temporada?.año}
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', fontWeight: 700, lineHeight: 1, color: 'var(--red-loss-light)' }}>
                <sup style={{ fontSize: '1.2rem', verticalAlign: 'super', fontWeight: 400 }}>−</sup>{fmt(totalGastos)} €
              </div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', background: 'rgba(192,57,43,0.15)', color: 'var(--red-loss-light)', border: '1px solid rgba(192,57,43,0.3)' }}>
              ↑ Inversión
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {gastos.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--cream-dim)', fontStyle: 'italic', opacity: 0.5 }}>Sin gastos registrados</div>
            ) : gastos.map(g => (
              <div key={g.id} style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: '1rem', alignItems: 'center', padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 42, height: 42, background: 'rgba(192,57,43,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{g.emoji}</div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--cream)' }}>{g.nombre}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--cream-dim)', marginTop: '0.1rem', textTransform: 'uppercase' }}>
                    {new Date(g.fecha).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })} · {g.categoria}
                  </div>
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.9rem', fontWeight: 700, color: 'var(--red-loss-light)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  −{fmt(Number(g.importe))} €
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INGRESOS */}
        <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, var(--green-gain), transparent)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--green-gain-light)', marginBottom: '0.5rem' }}>
                Ingresos · {temporada?.año}
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', fontWeight: 700, lineHeight: 1, color: 'var(--green-gain-light)' }}>
                <sup style={{ fontSize: '1.2rem', verticalAlign: 'super', fontWeight: 400 }}>+</sup>{fmt(totalIngresos)} €
              </div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', background: 'rgba(39,174,96,0.15)', color: 'var(--green-gain-light)', border: '1px solid rgba(39,174,96,0.3)' }}>
              ↳ Cosecha pendiente
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {ingresos.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--cream-dim)', fontStyle: 'italic', opacity: 0.5, border: '1px dashed rgba(200,160,74,0.2)' }}>
                🫒 La cosecha de noviembre llenará esta columna
              </div>
            ) : ingresos.map(i => (
              <div key={i.id} style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: '1rem', alignItems: 'center', padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 42, height: 42, background: 'rgba(39,174,96,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{i.emoji}</div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--cream)' }}>{i.nombre}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--cream-dim)', marginTop: '0.1rem', textTransform: 'uppercase' }}>
                    {new Date(i.fecha).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                    {i.kilos_aceituna ? ` · ${i.kilos_aceituna.toLocaleString('es-ES')} kg` : ''}
                  </div>
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.9rem', fontWeight: 700, color: 'var(--green-gain-light)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  +{fmt(Number(i.importe))} €
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Balance */}
      <div style={{ marginTop: '2.5rem', padding: '2rem', background: 'var(--bg-card2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: '0.4rem' }}>Balance actual · {temporada?.año}</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: balancePositive ? 'var(--green-gain-light)' : 'var(--red-loss-light)' }}>
            {balancePositive ? '+' : '−'}{fmt(Math.abs(balance))} €
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min((totalIngresos / (totalGastos || 1)) * 100, 100)}%`, background: 'linear-gradient(to right, var(--red-loss), var(--green-gain))', transition: 'width 0.8s ease' }} />
          </div>
          <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--cream-dim)', marginTop: '0.4rem' }}>La cosecha de noviembre cerrará el círculo</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: '0.4rem' }}>Proyección cosecha</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: 'var(--green-gain-light)' }}>+8.000 €</div>
        </div>
      </div>
    </section>
  )
}
