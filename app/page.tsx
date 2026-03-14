import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import HeroSection from '@/components/HeroSection'
import FinanzasSection from '@/components/FinanzasSection'
import RecorridoSection from '@/components/RecorridoSection'
import DonacionesSection from '@/components/DonacionesSection'

export const revalidate = 3600

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)

  const { data: temporada } = await supabase
    .from('temporadas')
    .select('*')
    .eq('activa', true)
    .single()

  const { data: gastos } = await supabase
    .from('gastos')
    .select('*')
    .eq('temporada_id', temporada?.id)
    .order('fecha', { ascending: false })

  const { data: ingresos } = await supabase
    .from('ingresos')
    .select('*')
    .eq('temporada_id', temporada?.id)
    .order('fecha', { ascending: false })

  const { data: temporadasRaw } = await supabase
    .from('temporadas')
    .select('*')
    .order('id')

  const temporadas = temporadasRaw ?? []

  const { data: hitos } = await supabase
    .from('hitos')
    .select('*')
    .order('orden')

  const totalGastos = gastos?.reduce((acc, g) => acc + Number(g.importe), 0) ?? 0
  const totalIngresos = ingresos?.reduce((acc, i) => acc + Number(i.importe), 0) ?? 0

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
      </nav>

      <main>
        <HeroSection />
        <FinanzasSection
          temporada={temporada}
          temporadas={temporadas}
          gastos={gastos ?? []}
          ingresos={ingresos ?? []}
          totalGastos={totalGastos}
          totalIngresos={totalIngresos}
        />
        <RecorridoSection hitos={hitos ?? []} />
        <DonacionesSection />
      </main>

      <footer>
        <div>
          <div className="footer-brand">Juan Vilas <span>— juanvilas.com</span></div>
        </div>
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