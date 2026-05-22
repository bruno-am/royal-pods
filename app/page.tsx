import { supabase } from '../lib/supabase'
import { Vitrine } from './components/Vitrine'

export const revalidate = 0

export default async function Home() {
  const { data: produtos } = await supabase
    .from('produtos')
    .select('*')
    .order('nome', { ascending: true })

  return (
    <main className="min-h-screen bg-[#070708] text-white">
      <Vitrine produtos={produtos || []} />
    </main>
  )
}