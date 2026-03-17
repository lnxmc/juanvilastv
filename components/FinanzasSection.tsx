'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

type Gasto = { id: number; nombre: string; importe: number; categoria: string; emoji: string; fecha: string }
type Ingreso = { id: number; nombre: string; importe: number; categoria: string; emoji: string; fecha: string; kilos_aceituna?: number }

interface Props {
  temporadaActiva: any
  temporadas: any[]
  gastosIniciales: Gasto[]
  ingresosIniciales: Ingreso[]
  totalGastosInicial: number
  totalIngresosInicial: number
}

const PAGE = 10

export default function FinanzasSection({ temporadaActiva, temporadas, gastosIniciales, ingresosIniciales }: Props) {
  const [seleccionada, setSeleccionada] = useState<any>(temporadaActiva)
  const [gastos, setGastos] = useState<Gasto[]>(gastosIniciales.slice(0, PAGE))
  const [ingresos, setIngresos] = useState<Ingreso[]>(ingresosIniciales.slice(0, PAGE))
  const [totalGastosAll, setTotalGastosAll] = useState<number>(gastosIniciales.reduce((a, g) => a + Number(g.importe), 0))
  const [totalIngresosAll, setTotalIngresosAll] = useState<number>(ingresosIniciales.reduce((a, i) => a + Number(i.importe), 0))
  const [gastosHayMas, setGastosHayMas] = useState(gastosIniciales.length > PAGE)
  const [ingresosHayMas, setIngresosHayMas] = useState(ingresosIniciales.length > PAGE)
  const [gastosPage, setGastosPage] = useState(0)
  const [ingresosPage, setIngresosPage] = useState(0)
  const [cargandoTemporada, setCargandoTemporada] = useState(false)
  const [cargandoGastos, setCargandoGastos] = useState(false)
  const [cargandoIngresos, setCargandoIngresos] = useState(false)

  const fmt = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  const balance = totalIngresosAll - totalGastosAll

  async function cambiar(t: any) {
    if (t.id === seleccionada?.id) return
    setCargandoTemporada(true)
    setSeleccionada(t)
    const s = createClient()
    const [{ data: g }, { data: i }, { data: todosG }, { data: todosI }] = await Promise.all([
      s.from('gastos').select('*').eq('temporada_id', t.id).order('fecha', { ascending: false }).range(0, PAGE - 1),
      s.from('ingresos').select('*').eq('temporada_id', t.id).order('fecha', { ascending: false }).range(0, PAGE - 1),
      s.from('gastos').select('importe').eq('temporada_id', t.id),
      s.from('ingresos').select('importe').eq('temporada_id', t.id),
    ])
    setGastos(g ?? [])
    setIngresos(i ?? [])
    setGastosPage(0)
    setIngresosPage(0)
    setGastosHayMas((g ?? []).length === PAGE)
    setIngresosHayMas((i ?? []).length === PAGE)
    setTotalGastosAll((todosG ?? []).reduce((a, x) => a + Number(x.importe), 0))
    setTotalIngresosAll((todosI ?? []).reduce((a, x) => a + Number(x.importe), 0))
    setCargandoTemporada(false)
  }

  async function verMasGastos() {
    setCargandoGastos(true)
    const next = gastosPage + 1
    const s = createClient()
    const { data } = await s.from('gastos').select('*')
      .eq('temporada_id', seleccionada?.id)
      .order('fecha', { ascending: false })
      .range(next * PAGE, (next + 1) * PAGE - 1)
    if (data && data.length > 0) {
      setGastos(prev => [...prev, ...data])
      setGastosPage(next)
      setGastosHayMas(data.length === PAGE)
    } else {
      setGastosHayMas(false)
    }
    setCargandoGastos(false)
  }

  async function verMasIngresos() {
    setCargandoIngresos(true)
    const next = ingresosPage + 1
    const s = createClient()
    const { data } = await s.from('ingresos').select('*')
      .eq('temporada_id', seleccionada?.id)
      .order('fecha', { ascending: false })
      .range(next * PAGE, (next + 1) * PAGE - 1)
    if (data && data.length > 0) {
      setIngresos(prev => [...prev, ...data])
      setIngresosPage(next)
      setIngresosHayMas(data.length === PAGE)
    } else {
      setIngresosHayMas(false)
    }
    setCargandoIngresos(false)
  }

  return (
    <section id="finanzas" style={{ background: 'linear-gradient(to bottom, var(--bg-deep), var(--bg-dark))' }}>
      <div className="section-header">
        <span className="section-number">01</span>
        <h2 className="section-title">Cuentas de <em>la temporada</em></h2>
        <div className="section-divider" />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {temporadas.map((t: any) => {
          const activa = t.id === seleccionada?.id
          return (
            <button key={t.id} onClick={() => cambiar(t)} style={{
              padding: '0.5rem 1.2rem',
              fontFamily: "'Space Mono', monospace", fontSize: '0.75rem',
              letterSpacing: '0.1em', cursor: 'pointer',
              border: `1px solid ${activa ? 'var(--gold)' : 'rgba(200,160,74,0.2)'}`,
              background: activa ? 'var(--gold)' : 'transparent',
              color: activa ? 'var(--bg-deep)' : 'var(--cream-dim)',
              fontWeight: activa ? 700 : 400,
              transition: 'all 0.25s',
            }}>
              Temporada {t.año}
            </button>
          )
        })}
      </div>

      {cargandoTemporada && (
        <div style={{ textAlign: 'center', padding: '3rem', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.7 }}>
          Cargando {seleccionada?.año}...
        </div>
      )}

      {!cargandoTemporada && (
        <>
          <div className="finance-grid">

            {/* GASTOS */}
            <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, var(--red-loss), transparent)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingBottom: '1.2rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '0.8rem' }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--red-loss-light)', marginBottom: '0.4rem' }}>Gastos · {seleccionada?.año}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 700, lineHeight: 1, color: 'var(--red-loss-light)' }}>
                    <sup style={{ fontSize: '1rem', verticalAlign: 'super', fontWeight: 400 }}>−</sup>{fmt(totalGastosAll)} €
                  </div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.3rem 0.7rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', background: 'rgba(192,57,43,0.15)', color: 'var(--red-loss-light)', border: '1px solid rgba(192,57,43,0.3)' }}>↑ Inversión</span>
              </div>

              <div className="finance-panel-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', maxHeight: 520, overflowY: 'auto', paddingRight: '8px' }}>
                {gastos.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--cream-dim)', fontStyle: 'italic', opacity: 0.5 }}>Sin gastos registrados</div>
                ) : gastos.map(g => (
                  <div key={g.id} className="finance-item-grid" style={{ display: 'grid', gridTemplateColumns: '44px 1fr auto', gap: '0.8rem', alignItems: 'center', padding: '0.8rem', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}>
                    <div style={{ width: 38, height: 38, background: 'rgba(192,57,43,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{g.emoji}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--cream)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.nombre}</div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--cream-dim)', marginTop: '0.1rem', textTransform: 'uppercase' }}>
                        {new Date(g.fecha).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })} · {g.categoria}
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.85rem', fontWeight: 700, color: 'var(--red-loss-light)', textAlign: 'right', whiteSpace: 'nowrap' }}>−{fmt(Number(g.importe))} €</div>
                  </div>
                ))}

                {gastosHayMas && (
                  <button onClick={verMasGastos} disabled={cargandoGastos} style={{
                    width: '100%', padding: '0.8rem',
                    background: 'transparent',
                    border: '1px dashed rgba(192,57,43,0.3)',
                    color: 'var(--red-loss-light)',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.68rem', letterSpacing: '0.15em',
                    textTransform: 'uppercase', cursor: 'pointer',
                    opacity: cargandoGastos ? 0.5 : 0.7,
                    transition: 'opacity 0.2s',
                    marginTop: '0.3rem',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = cargandoGastos ? '0.5' : '0.7')}>
                    {cargandoGastos ? 'Cargando...' : '↓ Ver más gastos'}
                  </button>
                )}
              </div>
            </div>

            {/* INGRESOS */}
            <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, var(--green-gain), transparent)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingBottom: '1.2rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '0.8rem' }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--green-gain-light)', marginBottom: '0.4rem' }}>Ingresos · {seleccionada?.año}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 700, lineHeight: 1, color: 'var(--green-gain-light)' }}>
                    <sup style={{ fontSize: '1rem', verticalAlign: 'super', fontWeight: 400 }}>+</sup>{fmt(totalIngresosAll)} €
                  </div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.3rem 0.7rem', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', background: 'rgba(39,174,96,0.15)', color: 'var(--green-gain-light)', border: '1px solid rgba(39,174,96,0.3)' }}>↳ {ingresos.length === 0 ? 'Pendiente' : 'Registrado'}</span>
              </div>

              <div className="finance-panel-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', maxHeight: 520, overflowY: 'auto', paddingRight: '8px' }}>
                {ingresos.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--cream-dim)', fontStyle: 'italic', opacity: 0.5, border: '1px dashed rgba(200,160,74,0.2)' }}>🫒 Los ingresos de esta temporada aparecerán aquí</div>
                ) : ingresos.map(i => (
                  <div key={i.id} className="finance-item-grid" style={{ display: 'grid', gridTemplateColumns: '44px 1fr auto', gap: '0.8rem', alignItems: 'center', padding: '0.8rem', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}>
                    <div style={{ width: 38, height: 38, background: 'rgba(39,174,96,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{i.emoji}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--cream)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.nombre}</div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'var(--cream-dim)', marginTop: '0.1rem', textTransform: 'uppercase' }}>
                        {new Date(i.fecha).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                        {i.kilos_aceituna ? ` · ${Number(i.kilos_aceituna).toLocaleString('es-ES')} kg` : ''}
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.85rem', fontWeight: 700, color: 'var(--green-gain-light)', textAlign: 'right', whiteSpace: 'nowrap' }}>+{fmt(Number(i.importe))} €</div>
                  </div>
                ))}

                {ingresosHayMas && (
                  <button onClick={verMasIngresos} disabled={cargandoIngresos} style={{
                    width: '100%', padding: '0.8rem',
                    background: 'transparent',
                    border: '1px dashed rgba(39,174,96,0.3)',
                    color: 'var(--green-gain-light)',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.68rem', letterSpacing: '0.15em',
                    textTransform: 'uppercase', cursor: 'pointer',
                    opacity: cargandoIngresos ? 0.5 : 0.7,
                    transition: 'opacity 0.2s',
                    marginTop: '0.3rem',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = cargandoIngresos ? '0.5' : '0.7')}>
                    {cargandoIngresos ? 'Cargando...' : '↓ Ver más ingresos'}
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Balance */}
          <div className="balance-section-wrap" style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-card2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: '0.4rem' }}>Balance · {seleccionada?.año}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', fontWeight: 700, color: balance >= 0 ? 'var(--green-gain-light)' : 'var(--red-loss-light)' }}>
                {balance >= 0 ? '+' : '−'}{fmt(Math.abs(balance))} €
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 150 }}>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.max(Math.min((totalIngresosAll / (totalGastosAll || 1)) * 100, 100), totalGastosAll > 0 ? 3 : 0)}%`, background: 'linear-gradient(to right, var(--red-loss), var(--green-gain))', transition: 'width 0.8s ease' }} />
              </div>
              <div style={{ fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--cream-dim)', marginTop: '0.4rem' }}>
                {totalIngresosAll === 0 ? 'Los ingresos cerrarán el balance' : `${fmt(totalIngresosAll)} € ingresados de ${fmt(totalGastosAll)} € invertidos`}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cream-dim)', marginBottom: '0.4rem' }}>Total ingresos</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', fontWeight: 700, color: 'var(--green-gain-light)' }}>+{fmt(totalIngresosAll)} €</div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
