import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import HeroSection from '@/components/HeroSection'
import FinanzasSection from '@/components/FinanzasSection'
import RecorridoSection from '@/components/RecorridoSection'
import DonacionesSection from '@/components/DonacionesSection'

export const revalidate = 60

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)

  const { data: temporadaActiva } = await supabase
    .from('temporadas').select('*').eq('activa', true).single()

  const { data: gastos } = await supabase
    .from('gastos').select('*').eq('temporada_id', temporadaActiva?.id).order('fecha', { ascending: false })

  const { data: ingresos } = await supabase
    .from('ingresos').select('*').eq('temporada_id', temporadaActiva?.id).order('fecha', { ascending: false })

  const { data: temporadas } = await supabase
    .from('temporadas').select('*').order('año')

  const { data: hitos } = await supabase
    .from('hitos').select('*').order('orden')

  const { data: config } = await supabase
    .from('configuracion').select('valor').eq('clave', 'video_youtube').single()

  const videoUrl = config?.valor ?? ''
  const totalGastosInicial = gastos?.reduce((acc, g) => acc + Number(g.importe), 0) ?? 0
  const totalIngresosInicial = ingresos?.reduce((acc, i) => acc + Number(i.importe), 0) ?? 0

  return (
    <>
      <nav>
        <a className="nav-logo" href="#">Juan Vilas <span>— del código al olivar</span></a>
        <ul className="nav-links">
          <li><a href="#finanzas">Temporada</a></li>
          <li><a href="#recorrido">Recorrido</a></li>
          <li><a href="#donaciones">Apoyar</a></li>
          <li><a href="https://youtube.com/@juanvilas" target="_blank">YouTube ↗</a></li>
        </ul>
        <div className="nav-mobile-links">
          <a href="#finanzas">Cuentas</a>
          <a href="#recorrido">Ruta</a>
          <a href="#donaciones">Apoyar</a>
        </div>
      </nav>

      <main>
        <HeroSection videoUrl={videoUrl} />
        <FinanzasSection
          temporadaActiva={temporadaActiva}
          temporadas={temporadas ?? []}
          gastosIniciales={gastos ?? []}
          ingresosIniciales={ingresos ?? []}
          totalGastosInicial={totalGastosInicial}
          totalIngresosInicial={totalIngresosInicial}
        />
        <RecorridoSection hitos={hitos ?? []} />
        <DonacionesSection />
      </main>

      <footer>
        <div><div className="footer-brand">Juan Vilas <span>— juanvilas.com</span></div></div>
        <div className="footer-links">
          <a href="#finanzas">Temporada</a>
          <a href="#recorrido">Recorrido</a>
          <a href="https://youtube.com" target="_blank">YouTube</a>
          <a href="#donaciones">Donar</a>
        </div>
        <div className="footer-copy">Jaén · Temporada 2026 · Hecho con tierra y código</div>
      </footer>
    </>
  )
}
