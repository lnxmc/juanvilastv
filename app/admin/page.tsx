// app/admin/page.tsx — Panel privado de administración
// Solo accesible si estás autenticado con tu cuenta de Supabase

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Tab = 'gastos' | 'ingresos' | 'hitos'

export default function AdminPage() {
  const supabase = createClient()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('gastos')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  // ── Proteger la ruta ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin/login')
    })
  }, [])

  // ── Formulario gasto ──
  const [gasto, setGasto] = useState({
    nombre: '', importe: '', categoria: 'equipo',
    emoji: '📌', fecha: new Date().toISOString().split('T')[0], notas: ''
  })

  // ── Formulario ingreso ──
  const [ingreso, setIngreso] = useState({
    nombre: '', importe: '', categoria: 'cosecha',
    emoji: '💰', fecha: new Date().toISOString().split('T')[0],
    kilos_aceituna: '', precio_kilo: '', notas: ''
  })

  // ── Guardar gasto ──
  async function saveGasto(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Obtener temporada activa
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
    if (error) { setMsg('❌ Error: ' + error.message) }
    else {
      setMsg('✓ Gasto añadido correctamente')
      setGasto({ nombre: '', importe: '', categoria: 'equipo', emoji: '📌', fecha: new Date().toISOString().split('T')[0], notas: '' })
    }
    setLoading(false)
    setTimeout(() => setMsg(''), 3000)
  }

  // ── Guardar ingreso ──
  async function saveIngreso(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
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
    if (error) { setMsg('❌ Error: ' + error.message) }
    else {
      setMsg('✓ Ingreso añadido correctamente')
      setIngreso({ nombre: '', importe: '', categoria: 'cosecha', emoji: '💰', fecha: new Date().toISOString().split('T')[0], kilos_aceituna: '', precio_kilo: '', notas: '' })
    }
    setLoading(false)
    setTimeout(() => setMsg(''), 3000)
  }

  // ── Marcar hito completado ──
  async function toggleHito(id: number, completado: boolean) {
    await supabase.from('hitos').update({
      completado: !completado,
      fecha_completado: !completado ? new Date().toISOString().split('T')[0] : null
    }).eq('id', id)
    router.refresh()
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

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontFamily: 'Georgia', fontSize: '2rem', color: '#c8a04a', marginBottom: '0.3rem' }}>Panel Admin</h1>
          <p style={{ color: '#b8a87a', fontStyle: 'italic' }}>juanvilas.com — gestión de temporada</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
          {(['gastos', 'ingresos', 'hitos'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '0.5rem 1.5rem', fontFamily: 'monospace', fontSize: '0.75rem',
              letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              border: '1px solid rgba(200,160,74,0.3)',
              background: tab === t ? '#c8a04a' : 'transparent',
              color: tab === t ? '#0e120b' : '#b8a87a'
            }}>{t}</button>
          ))}
        </div>

        {/* Mensaje de feedback */}
        {msg && (
          <div style={{
            padding: '1rem', marginBottom: '1.5rem',
            background: msg.startsWith('✓') ? 'rgba(39,174,96,0.1)' : 'rgba(192,57,43,0.1)',
            border: `1px solid ${msg.startsWith('✓') ? 'rgba(39,174,96,0.4)' : 'rgba(192,57,43,0.4)'}`,
            color: msg.startsWith('✓') ? '#2ecc71' : '#e74c3c',
            fontFamily: 'monospace', fontSize: '0.85rem'
          }}>{msg}</div>
        )}

        {/* ── TAB GASTOS ── */}
        {tab === 'gastos' && (
          <form onSubmit={saveGasto}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Nombre del gasto *</label>
                <input style={inputStyle} required value={gasto.nombre}
                  onChange={e => setGasto({...gasto, nombre: e.target.value})}
                  placeholder="Ej: Gasolina semana 12" />
              </div>
              <div>
                <label style={labelStyle}>Importe (€) *</label>
                <input style={inputStyle} type="number" step="0.01" min="0" required
                  value={gasto.importe} onChange={e => setGasto({...gasto, importe: e.target.value})}
                  placeholder="0.00" />
              </div>
              <div>
                <label style={labelStyle}>Fecha *</label>
                <input style={inputStyle} type="date" required
                  value={gasto.fecha} onChange={e => setGasto({...gasto, fecha: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>Categoría</label>
                <select style={inputStyle} value={gasto.categoria}
                  onChange={e => setGasto({...gasto, categoria: e.target.value})}>
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
                <input style={inputStyle} value={gasto.emoji}
                  onChange={e => setGasto({...gasto, emoji: e.target.value})} placeholder="📌" />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Notas (opcional)</label>
                <textarea style={{...inputStyle, height: 80, resize: 'vertical'}}
                  value={gasto.notas} onChange={e => setGasto({...gasto, notas: e.target.value})}
                  placeholder="Detalles adicionales..." />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              background: '#c8a04a', color: '#0e120b', padding: '0.9rem 2.5rem',
              border: 'none', fontFamily: 'monospace', fontWeight: 700,
              fontSize: '0.8rem', letterSpacing: '0.15em', cursor: 'pointer',
              textTransform: 'uppercase', opacity: loading ? 0.6 : 1
            }}>
              {loading ? 'Guardando...' : '+ Añadir gasto'}
            </button>
          </form>
        )}

        {/* ── TAB INGRESOS ── */}
        {tab === 'ingresos' && (
          <form onSubmit={saveIngreso}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Nombre del ingreso *</label>
                <input style={inputStyle} required value={ingreso.nombre}
                  onChange={e => setIngreso({...ingreso, nombre: e.target.value})}
                  placeholder="Ej: Venta aceituna cooperativa Úbeda" />
              </div>
              <div>
                <label style={labelStyle}>Importe total (€) *</label>
                <input style={inputStyle} type="number" step="0.01" min="0" required
                  value={ingreso.importe} onChange={e => setIngreso({...ingreso, importe: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>Fecha *</label>
                <input style={inputStyle} type="date" required
                  value={ingreso.fecha} onChange={e => setIngreso({...ingreso, fecha: e.target.value})} />
              </div>
              <div>
                <label style={labelStyle}>Kilos de aceituna</label>
                <input style={inputStyle} type="number" step="0.1"
                  value={ingreso.kilos_aceituna}
                  onChange={e => setIngreso({...ingreso, kilos_aceituna: e.target.value})}
                  placeholder="Ej: 12500" />
              </div>
              <div>
                <label style={labelStyle}>Precio €/kg</label>
                <input style={inputStyle} type="number" step="0.001"
                  value={ingreso.precio_kilo}
                  onChange={e => setIngreso({...ingreso, precio_kilo: e.target.value})}
                  placeholder="Ej: 0.650" />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Notas</label>
                <textarea style={{...inputStyle, height: 80, resize: 'vertical'}}
                  value={ingreso.notas} onChange={e => setIngreso({...ingreso, notas: e.target.value})} />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              background: '#27ae60', color: 'white', padding: '0.9rem 2.5rem',
              border: 'none', fontFamily: 'monospace', fontWeight: 700,
              fontSize: '0.8rem', letterSpacing: '0.15em', cursor: 'pointer',
              textTransform: 'uppercase', opacity: loading ? 0.6 : 1
            }}>
              {loading ? 'Guardando...' : '+ Añadir ingreso'}
            </button>
          </form>
        )}

        {/* ── TAB HITOS ── */}
        {tab === 'hitos' && (
          <HitosTab supabase={supabase} />
        )}

      </div>
    </div>
  )
}

// Componente separado para los hitos
function HitosTab({ supabase }: { supabase: any }) {
  const [hitos, setHitos] = useState<any[]>([])

  useEffect(() => {
    supabase.from('hitos').select('*').order('orden').then(({ data }: any) => setHitos(data ?? []))
  }, [])

  async function toggle(id: number, completado: boolean) {
    await supabase.from('hitos').update({
      completado: !completado,
      fecha_completado: !completado ? new Date().toISOString().split('T')[0] : null
    }).eq('id', id)
    const { data } = await supabase.from('hitos').select('*').order('orden')
    setHitos(data ?? [])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      {hitos.map(h => (
        <div key={h.id} style={{
          display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '1rem 1.2rem',
          background: h.completado ? 'rgba(107,140,58,0.08)' : '#1b2415',
          border: `1px solid ${h.completado ? 'rgba(107,140,58,0.4)' : 'rgba(200,160,74,0.2)'}`,
          cursor: 'pointer', transition: 'all 0.2s'
        }} onClick={() => toggle(h.id, h.completado)}>
          <span style={{ fontSize: '1.5rem' }}>{h.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: h.completado ? '#8fbc50' : '#f0e6c8' }}>{h.nombre}</div>
            <div style={{ fontSize: '0.75rem', color: '#b8a87a', fontFamily: 'monospace' }}>
              {h.completado ? `✓ Completado ${h.fecha_completado}` : `Objetivo: ${h.año_objetivo}`}
            </div>
          </div>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: h.completado ? '#27ae60' : 'transparent',
            border: `2px solid ${h.completado ? '#27ae60' : 'rgba(200,160,74,0.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '0.8rem'
          }}>{h.completado ? '✓' : ''}</div>
        </div>
      ))}
      <p style={{ marginTop: '1rem', fontSize: '0.8rem', fontStyle: 'italic', color: '#b8a87a', opacity: 0.7 }}>
        Haz clic en un hito para marcarlo como completado / pendiente
      </p>
    </div>
  )
}
