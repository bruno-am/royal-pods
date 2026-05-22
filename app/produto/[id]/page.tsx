import { supabase } from '../../../lib/supabase'
import Link from 'next/link'
import { BotaoComprarDireto } from '../../components/BotaoComprarDireto'

export default async function ProdutoDetalhes({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params
  const produtoId = resolvedParams.id

  const { data: produto } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', produtoId)
    .single()

  if (!produto) {
    return (
      <div className="min-h-screen bg-[#070708] text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Produto não encontrado</h1>
        <Link href="/" className="text-yellow-500 hover:underline">Voltar para a loja</Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#070708] text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto mt-6">
        
        {/* Botão Voltar */}
        <Link href="/" className="text-yellow-500 font-bold hover:text-yellow-400 transition-colors mb-8 inline-flex items-center gap-2 group">
          <span className="transition-transform group-hover:-translate-x-1">&larr;</span> Voltar para a loja
        </Link>

        {/* Bloco de Detalhes Extras */}
        <div className="bg-[#111113] border border-gray-800 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 mt-4">
          
          {/* Lado Esquerdo: Imagem Ampliada */}
          <div className="md:w-1/2 bg-black rounded-2xl p-6 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
            {produto.imagem_url ? (
              <img 
                src={produto.imagem_url} 
                alt={produto.nome} 
                className="max-w-full max-h-[380px] object-contain" 
              />
            ) : (
              <span className="text-gray-600">Sem imagem</span>
            )}
          </div>

          {/* Lado Direito: Informações e a Coluna de Detalhes do Supabase */}
          <div className="md:w-1/2 flex flex-col justify-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide mb-1">{produto.nome}</h1>
              <p className="text-lg md:text-xl text-gray-400 font-medium">{produto.sabor}</p>
              <p className="text-3xl md:text-4xl font-black text-yellow-500 mt-4">
                R$ {Number(produto.preco || 0).toFixed(2).replace('.', ',')}
              </p>
            </div>
            
            {/* Caixa que lê a coluna 'detalhes' do banco de dados */}
            <div className="bg-black/50 p-5 rounded-xl border border-gray-800/80">
              <h3 className="text-gray-500 uppercase text-xs font-black tracking-widest mb-2">Informações Adicionais</h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                {produto.detalhes || 'Nenhuma informação adicional cadastrada para este modelo.'}
              </p>
            </div>

            <BotaoComprarDireto produto={produto} />
          </div>

        </div>
      </div>
    </main>
  )
}