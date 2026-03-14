'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

type Tab = 'gastos' | 'ingresos' | 'hitos' | 'video'

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('gastos')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin/login')
    })
  }, [])

  const [gasto, setGasto] = useState({
    nombre: '', importe: '', categoria: 'equipo',
    emoji: '📌', fecha: new Date().toISOString().split('T')[0], notas: ''
  })

  const [ingreso, setIngreso] = useState({
    nombre: '', importe: '', categoria: 'cosecha',
    emoji: '💰', fecha: new Date().toISOString().split('T')[0],
    kilos_aceituna: '', precio_kilo: '', notas: ''
  })

  async function saveGasto(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: temp } = await supabase.from('temporadas').select('id').eq('activa', true).single()
    const { error } = await supabase.from('gastos').insert({
      temporada_id: temp?.id,
      nombre: gasto.nombre,
      importe: parseFloat(gasto.importe),
      categoria: gasto.categoria,
      emoji: gasto.emoji,
      fecha: gasto.fecha,
      notas: gasto.notas || null
    })
    if (error) setMsg('❌ Error: ' + error.message)
    else {
      setMsg('✓ Gasto añadido correctamente')
      setGasto({ nombre: '', importe: '', categoria: 'equipo', emoji: '📌', fecha: new Date().toISOString().split('T')[0], notas: '' })
    }
    setLoading(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function saveIngreso(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: temp } = await supabase.from('temporadas').select('id').eq('activa', true).single()
    const { error } = await supabase.from('ingresos').insert({
      temporada_id: temp?.id,
      nombre: ingreso.nombre,
      importe: parseFloat(ingreso.importe),
      categoria: ingreso.categoria,
      emoji: ingreso.emoji,
      fecha: ingreso.fecha,
      kilos_aceituna: ingreso.kilos_aceituna ? parseFloat(ingreso.kilos_aceituna) : null,
      precio_kilo: ingreso.precio_kilo ? parseFloat(ingreso.precio_kilo) : null,
      notas: ingreso.notas || null
    })
    if (error) setMsg('❌ Error: ' + error.message)
    else {
      setMsg('✓ Ingreso añadido correctamente')
      setIngreso({ nombre: '', importe: '', categoria: 'cosecha', emoji: '💰', fecha: new Date().toISOString().split('T')[0], kilos_aceituna: '', precio_kilo: '', notas: '' })
    }
    setLoading(false)
    setTimeout(() => setMsg(''), 3000)
  }

  const inputStyle = {
    background: '#1b2415', border: '1px solid rgba(200,160,74,0.3)',
    color: '#f0e6c8', padding: '0.7rem 1rem', width: '100%',
    fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none'
  } as React.CSSProperties

  const labelStyle = {
    display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em',
    textTransform: 'uppercase' as const, color: '#b8a87a', marginBottom: '0.4rem',
    fontFamily: 'monospace'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0e120b', color: '#f0e6c8', padding: '2rem', fontFamily: 'Georgia, serif' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'Georgia', fontSize: '2rem', color: '#c8a04a', marginBottom: '0.3rem' }}>Panel Admin</h1>
          <p style={{ color: '#b8a87a', fontStyle: 'italic' }}>juanvilas.com — gestión de temporada</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {(['gastos', 'ingresos', 'hitos', 'video'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '0.5rem 1.5rem', fontFamily: 'monospace', fontSize: '0.75rem',
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              border: '1px solid rgba(200,160,74,0.3)',
              background: tab === t ? '#c8a04a' : 'transparent',
              color: tab === t ? '#0e120b' : '#b8a87a'
            }}>{t === 'video' ? '▶ Vídeo' : t}</button>
          ))}
        </div>

        {msg && (
          <div style={{
            padding: '1rem', marginBottom: '1.5rem',
            background: msg.startsWith('✓') ? 'rgba(39,174,96,0.1)' : 'rgba(192,57,43,0.1)',
            border: `1px solid ${msg.startsWith('✓') ? 'rgba(39,174,96,0.4)' : 'rgba(192,57,43,0.4)'}`,
            color: msg.startsWith('✓') ? '#2ecc71' : '#e74c3c',
            fontFamily: 'monospace', fontSize: '0.85rem'
          }}>{msg}</div>
        )}

        {tab === 'gastos' && (
          <div>
            <form onSubmit={saveGasto} style={{ marginBottom: '3rem' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8a04a', marginBottom: '1.2rem' }}>+ Añadir gasto</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Nombre *</label>
                  <input style={inputStyle} required value={gasto.nombre} onChange={e => setGasto({...gasto, nombre: e.target.value})} placeholder="Ej: Gasolina semana 12" />
                </div>
                <div>
                  <label style={labelStyle}>Importe (€) *</label>
                  <input style={inputStyle} type="number" step="0.01" min="0" required value={gasto.importe} onChange={e => setGasto({...gasto, importe: e.target.value})} placeholder="0.00" />
                </div>
                <div>
                  <label style={labelStyle}>Fecha *</label>
                  <input style={inputStyle} type="date" required value={gasto.fecha} onChange={e => setGasto({...gasto, fecha: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Categoría</label>
                  <select style={inputStyle} value={gasto.categoria} onChange={e => setGasto({...gasto, categoria: e.target.value})}>
                    <option value="equipo">Equipo</option>
                    <option value="combustible">Combustible</option>
                    <option value="arrendamiento">Arrendamiento</option>
                    <option value="consumibles">Consumibles</option>
                    <option value="formacion">Formación</option>
                    <option value="canal">Canal YouTube</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Emoji</label>
                  <input style={inputStyle} value={gasto.emoji} onChange={e => setGasto({...gasto, emoji: e.target.value})} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Notas</label>
                  <textarea style={{...inputStyle, height: 80, resize: 'vertical'}} value={gasto.notas} onChange={e => setGasto({...gasto, notas: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={loading} style={{ background: '#c8a04a', color: '#0e120b', padding: '0.9rem 2.5rem', border: 'none', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.15em', cursor: 'pointer', textTransform: 'uppercase', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Guardando...' : '+ Añadir gasto'}
              </button>
            </form>
            <GastosLista onMsg={setMsg} />
          </div>
        )}

        {tab === 'ingresos' && (
          <div>
            <form onSubmit={saveIngreso} style={{ marginBottom: '3rem' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#27ae60', marginBottom: '1.2rem' }}>+ Añadir ingreso</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Nombre *</label>
                  <input style={inputStyle} required value={ingreso.nombre} onChange={e => setIngreso({...ingreso, nombre: e.target.value})} placeholder="Ej: Venta aceituna cooperativa Úbeda" />
                </div>
                <div>
                  <label style={labelStyle}>Importe total (€) *</label>
                  <input style={inputStyle} type="number" step="0.01" min="0" required value={ingreso.importe} onChange={e => setIngreso({...ingreso, importe: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Fecha *</label>
                  <input style={inputStyle} type="date" required value={ingreso.fecha} onChange={e => setIngreso({...ingreso, fecha: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Kilos de aceituna</label>
                  <input style={inputStyle} type="number" step="0.1" value={ingreso.kilos_aceituna} onChange={e => setIngreso({...ingreso, kilos_aceituna: e.target.value})} placeholder="Ej: 12500" />
                </div>
                <div>
                  <label style={labelStyle}>Precio €/kg</label>
                  <input style={inputStyle} type="number" step="0.001" value={ingreso.precio_kilo} onChange={e => setIngreso({...ingreso, precio_kilo: e.target.value})} placeholder="Ej: 0.650" />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Notas</label>
                  <textarea style={{...inputStyle, height: 80, resize: 'vertical'}} value={ingreso.notas} onChange={e => setIngreso({...ingreso, notas: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={loading} style={{ background: '#27ae60', color: 'white', padding: '0.9rem 2.5rem', border: 'none', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.15em', cursor: 'pointer', textTransform: 'uppercase', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Guardando...' : '+ Añadir ingreso'}
              </button>
            </form>
            <IngresosLista onMsg={setMsg} />
          </div>
        )}

        {tab === 'hitos' && <HitosTab />}
        {tab === 'video' && <VideoTab onMsg={setMsg} />}

      </div>
    </div>
  )
}

function GastosLista({ onMsg }: { onMsg: (m: string) => void }) {
  const [gastos, setGastos] = useState<any[]>([])
  useEffect(() => { cargar() }, [])
  async function cargar() {
    const supabase = createClient()
    const { data } = await supabase.from('gastos').select('*').order('fecha', { ascending: false })
    setGastos(data ?? [])
  }
  async function eliminar(id: number) {
    if (!confirm('¿Eliminar este gasto?')) return
    const supabase = createClient()
    const { error } = await supabase.from('gastos').delete().eq('id', id)
    if (error) onMsg('❌ Error al eliminar')
    else { onMsg('✓ Gasto eliminado'); cargar() }
    setTimeout(() => onMsg(''), 3000)
  }
  return (
    <div>
      <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8a87a', marginBottom: '1rem' }}>Gastos registrados ({gastos.length})</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {gastos.map(g => (
          <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', background: '#1b2415', border: '1px solid rgba(200,160,74,0.15)' }}>
            <span style={{ fontSize: '1.3rem' }}>{g.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f0e6c8' }}>{g.nombre}</div>
              <div style={{ fontSize: '0.7rem', color: '#b8a87a', fontFamily: 'monospace' }}>{g.fecha} · {g.categoria}</div>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#e74c3c', fontWeight: 700 }}>−{Number(g.importe).toLocaleString('es-ES')} €</div>
            <button onClick={() => eliminar(g.id)} style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)', color: '#e74c3c', padding: '0.3rem 0.8rem', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.7rem' }}>✕ Borrar</button>
          </div>
        ))}
        {gastos.length === 0 && <div style={{ color: '#b8a87a', fontStyle: 'italic', fontSize: '0.9rem' }}>Sin gastos registrados</div>}
      </div>
    </div>
  )
}

function IngresosLista({ onMsg }: { onMsg: (m: string) => void }) {
  const [ingresos, setIngresos] = useState<any[]>([])
  useEffect(() => { cargar() }, [])
  async function cargar() {
    const supabase = createClient()
    const { data } = await supabase.from('ingresos').select('*').order('fecha', { ascending: false })
    setIngresos(data ?? [])
  }
  async function eliminar(id: number) {
    if (!confirm('¿Eliminar este ingreso?')) return
    const supabase = createClient()
    const { error } = await supabase.from('ingresos').delete().eq('id', id)
    if (error) onMsg('❌ Error al eliminar')
    else { onMsg('✓ Ingreso eliminado'); cargar() }
    setTimeout(() => onMsg(''), 3000)
  }
  return (
    <div>
      <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b8a87a', marginBottom: '1rem' }}>Ingresos registrados ({ingresos.length})</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {ingresos.map(i => (
          <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', background: '#1b2415', border: '1px solid rgba(200,160,74,0.15)' }}>
            <span style={{ fontSize: '1.3rem' }}>{i.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f0e6c8' }}>{i.nombre}</div>
              <div style={{ fontSize: '0.7rem', color: '#b8a87a', fontFamily: 'monospace' }}>{i.fecha} · {i.categoria}</div>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#2ecc71', fontWeight: 700 }}>+{Number(i.importe).toLocaleString('es-ES')} €</div>
            <button onClick={() => eliminar(i.id)} style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)', color: '#e74c3c', padding: '0.3rem 0.8rem', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.7rem' }}>✕ Borrar</button>
          </div>
        ))}
        {ingresos.length === 0 && <div style={{ color: '#b8a87a', fontStyle: 'italic', fontSize: '0.9rem' }}>Sin ingresos registrados</div>}
      </div>
    </div>
  )
}

function HitosTab() {
  const [hitos, setHitos] = useState<any[]>([])
  useEffect(() => { cargar() }, [])
  async function cargar() {
    const supabase = createClient()
    const { data } = await supabase.from('hitos').select('*').order('orden')
    setHitos(data ?? [])
  }
  async function toggle(id: number, completado: boolean) {
    const supabase = createClient()
    await supabase.from('hitos').update({
      completado: !completado,
      fecha_completado: !completado ? new Date().toISOString().split('T')[0] : null
    }).eq('id', id)
    cargar()
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      {hitos.map(h => (
        <div key={h.id} onClick={() => toggle(h.id, h.completado)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.2rem', background: h.completado ? 'rgba(107,140,58,0.08)' : '#1b2415', border: `1px solid ${h.completado ? 'rgba(107,140,58,0.4)' : 'rgba(200,160,74,0.2)'}`, cursor: 'pointer' }}>
          <span style={{ fontSize: '1.5rem' }}>{h.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: h.completado ? '#8fbc50' : '#f0e6c8' }}>{h.nombre}</div>
            <div style={{ fontSize: '0.75rem', color: '#b8a87a', fontFamily: 'monospace' }}>{h.completado ? `✓ Completado ${h.fecha_completado}` : `Objetivo: ${h.año_objetivo}`}</div>
          </div>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: h.completado ? '#27ae60' : 'transparent', border: `2px solid ${h.completado ? '#27ae60' : 'rgba(200,160,74,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem' }}>{h.completado ? '✓' : ''}</div>
        </div>
      ))}
      <p style={{ marginTop: '1rem', fontSize: '0.8rem', fontStyle: 'italic', color: '#b8a87a', opacity: 0.7 }}>Haz clic en un hito para marcarlo como completado / pendiente</p>
    </div>
  )
}

function VideoTab({ onMsg }: { onMsg: (m: string) => void }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('configuracion').select('valor').eq('clave', 'video_youtube').single()
      .then(({ data }) => { if (data?.valor) setUrl(data.valor) })
  }, [])

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('configuracion')
      .upsert({ clave: 'video_youtube', valor: url })
    if (error) onMsg('❌ Error al guardar')
    else onMsg('✓ Vídeo actualizado — se verá en la web en unos minutos')
    setLoading(false)
    setTimeout(() => onMsg(''), 4000)
  }

  async function quitar() {
    if (!confirm('¿Quitar el vídeo de la página principal?')) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('configuracion').upsert({ clave: 'video_youtube', valor: '' })
    setUrl('')
    onMsg('✓ Vídeo eliminado de la página principal')
    setLoading(false)
    setTimeout(() => onMsg(''), 3000)
  }

  return (
    <div>
      <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8a04a', marginBottom: '1.5rem' }}>▶ Vídeo principal</div>
      <p style={{ color: '#b8a87a', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.7 }}>
        El vídeo que pongas aquí aparecerá en la parte superior de la página, junto al título. Pega la URL de cualquier vídeo de YouTube. Si lo dejas vacío no aparece nada.
      </p>
      <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#b8a87a', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
            URL del vídeo de YouTube
          </label>
          <input
            style={{ background: '#1b2415', border: '1px solid rgba(200,160,74,0.3)', color: '#f0e6c8', padding: '0.7rem 1rem', width: '100%', fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none' }}
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" disabled={loading} style={{ background: '#c8a04a', color: '#0e120b', padding: '0.9rem 2rem', border: 'none', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.15em', cursor: 'pointer', textTransform: 'uppercase', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Guardando...' : '✓ Guardar vídeo'}
          </button>
          {url && (
            <button type="button" onClick={quitar} disabled={loading} style={{ background: 'rgba(192,57,43,0.15)', color: '#e74c3c', padding: '0.9rem 2rem', border: '1px solid rgba(192,57,43,0.3)', fontFamily: 'monospace', fontSize: '0.8rem', letterSpacing: '0.15em', cursor: 'pointer', textTransform: 'uppercase' }}>
              ✕ Quitar vídeo
            </button>
          )}
        </div>
      </form>

      {url && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#b8a87a', marginBottom: '0.8rem' }}>Vista previa</div>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', border: '1px solid rgba(200,160,74,0.2)' }}>
            <iframe
              src={`https://www.youtube.com/embed/${url.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1]}?rel=0`}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  )
}
