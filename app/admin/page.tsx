'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

type Tab = 'gastos' | 'ingresos' | 'hitos' | 'temporadas' | 'donaciones' | 'patreon' | 'video'

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('gastos')
  const [msg, setMsg] = useState('')
  const [temporadas, setTemporadas] = useState<any[]>([])
  const [temporadaId, setTemporadaId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)  // ← NUEVO

  useEffect(() => {
    const s = createClient()
    s.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/admin/login')
      } else {
        setAuthChecked(true)  // ← solo activa el render si hay sesión
      }
    })
    s.from('temporadas').select('*').order('año').then(({ data }) => {
      setTemporadas(data ?? [])
      const activa = (data ?? []).find((t: any) => t.activa)
      if (activa) setTemporadaId(activa.id)
    })
  }, [])

  // ← NUEVO: no renderiza nada hasta confirmar sesión
  if (!authChecked) return null

  // ... todo lo demás igual desde aquí
