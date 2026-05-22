'use client'

import { useState } from 'react'
import { ShoppingCart, Search } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

export function Vitrine({ produtos }: { produtos: any[] }) {
  const [busca, setBusca] = useState('')
  const [saborSelecionado, setSaborSelecionado] = useState('Todos')
  const { carrinho, adicionarAoCarrinho, totalItens } = useCart()

  const saboresRaizes = [
    "Morango", "Melancia", "Uva", "Menta", "Maçã", "Banana", "Kiwi", 
    "Pêssego", "Cereja", "Manga", "Abacaxi", "Maracujá", "Tropical"
  ]

  const botoesSabores = ['Todos']
  saboresRaizes.forEach(raiz => {
    const existeNoEstoque = produtos.some(p => {
      const nome = p.nome?.toLowerCase() || ''
      const saborTexto = p.sabor?.toLowerCase() || ''
      const detalhesTexto = p.detalhes?.toLowerCase() || ''
      const termo = raiz.toLowerCase()

      return nome.includes(termo) || saborTexto.includes(termo) || detalhesTexto.includes(termo)
    })

    if (existeNoEstoque) {
      botoesSabores.push(raiz)
    }
  })

  const produtosFiltrados = produtos.filter((produto) => {
    const nome = produto.nome?.toLowerCase() || ''
    const saborTexto = produto.sabor?.toLowerCase() || ''
    const detalhesTexto = produto.detalhes?.toLowerCase() || ''
    const termoBusca = busca.toLowerCase()
    const termoSaborSelecionado = saborSelecionado.toLowerCase()

    const passaBusca = nome.includes(termoBusca) || 
                       saborTexto.includes(termoBusca) || 
                       detalhesTexto.includes(termoBusca)

    const passaSabor = saborSelecionado === 'Todos' || 
                       saborTexto.includes(termoSaborSelecionado) || 
                       detalhesTexto.includes(termoSaborSelecionado)

    return passaBusca && passaSabor
  })

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-[#070708]/95 backdrop-blur-md border-b border-gray-800 py-2 px-4 md:px-8 z-[100] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-1.5 shrink-0 select-none">
          <div className="-mt-3.5 w-8 h-8 flex items-center justify-center">
            <img src="/logo-coroa.png" alt="Coroa" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col leading-[0.75]">
            <span className="text-lg font-black text-yellow-500 uppercase tracking-widest">Royal</span>
            <span className="text-lg font-black text-yellow-500 uppercase tracking-widest ml-5 mt-0">Pod's</span>
          </div>
          <div className="mt-3.5 w-8 h-8 flex items-center justify-center">
            <img src="/logo-coroa.png" alt="Coroa" className="w-full h-full object-contain" />
          </div>
        </Link>

        {/* INPUT DE BUSCA */}
        <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg">
          <input 
            type="text" 
            placeholder="Buscar modelo ou sabor..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-[#111113] border border-gray-800 rounded-full py-2 px-5 text-sm text-gray-200 placeholder:text-gray-600 focus:border-yellow-500 outline-none transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 h-4 w-4" />
        </div>

        {/* ÍCONE DO CARRINHO */}
        <div className="relative p-2 border border-gray-800 rounded-xl bg-[#111113] text-gray-400">
          <ShoppingCart className="h-5 w-5" />
          {totalItens > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-black font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
              {totalItens}
            </span>
          )}
        </div>
      </nav>

      <div className={`pt-32 md:pt-28 p-4 md:p-8 ${totalItens > 0 ? 'pb-32' : 'pb-12'}`}>
        <div className="max-w-6xl mx-auto">
          
          {/* BARRA DE FILTRO POR SABOR RAIZ */}
          {botoesSabores.length > 1 && (
              <div className="flex flex-wrap justify-center gap-3 mb-8 px-4">
  {botoesSabores.map((sabor) => (
    <button
      key={sabor}
      onClick={() => setSaborSelecionado(sabor)}
      className={`px-4 py-2 rounded-lg font-bold transition-all ${
        saborSelecionado === sabor 
          ? "bg-yellow-500 text-black" 
          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
      }`}
    >
      {sabor}
    </button>
  ))}
                    </div>     
)}

          {/* GRID DE PRODUTOS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {produtosFiltrados.map((produto) => {
              const itemNoCarrinho = carrinho.find(item => item.id === produto.id)
              const qtdNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0

              return (
                <div 
                  key={produto.id} 
                  className="bg-[#111113] rounded-2xl p-4 border border-gray-800 flex flex-col justify-between min-h-[380px] transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500 group relative"
                >
                  <Link href={`/produto/${produto.id}`} className="flex flex-col flex-grow cursor-pointer relative z-10">
                    <div className="w-full h-48 bg-black rounded-xl mb-4 flex items-center justify-center overflow-hidden p-2">
                      {produto.imagem_url ? (
                        <img 
                          src={produto.imagem_url} 
                          alt={produto.nome} 
                          className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <span className="text-gray-600 text-xs">Sem imagem</span>
                      )}
                    </div>
                    
                    <h2 className="text-sm md:text-base font-black text-gray-100 uppercase tracking-wide line-clamp-1 group-hover:text-yellow-500 transition-colors">
                      {produto.nome}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 font-bold mb-3 line-clamp-1">
                      {produto.sabor || 'Sabor não definido'}
                    </p>

                    <div className="mt-auto">
                      <p className="text-yellow-500 font-black text-lg md:text-xl mb-3">
                        R$ {Number(produto.preco || 0).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </Link>

                  <div className="flex gap-2 w-full mt-2 relative z-20">
                    <Link 
                      href={`/produto/${produto.id}`} 
                      className="w-1/2 flex items-center justify-center border-2 border-gray-800 text-gray-400 font-black py-2 rounded-xl uppercase text-[10px] md:text-xs tracking-wider text-center hover:border-yellow-500 hover:text-yellow-500 transition-colors"
                    >
                      Detalhes
                    </Link>
                    
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        adicionarAoCarrinho(produto)
                      }}
                      className={`w-1/2 font-black py-2 rounded-xl uppercase text-[10px] md:text-xs tracking-wider text-center transition-colors ${
                        qtdNoCarrinho > 0 ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-yellow-500 text-black hover:bg-yellow-400'
                      }`}
                    >
                      {qtdNoCarrinho > 0 ? `Sacola (${qtdNoCarrinho})` : 'Comprar'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {produtosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 font-bold uppercase tracking-wider">
                Nenhum modelo encontrado com este sabor.
              </p>
            </div>
          )}

        </div>
      </div>

          {/* RODAPÉ / FOOTER */}
      <footer className={`bg-[#111113] border-t border-gray-800 pt-6 mt-8 transition-all duration-300 ${
        totalItens > 0 ? 'pb-28' : 'pb-6'
      }`}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo no Rodapé */}
          <div className="flex items-center gap-2 select-none opacity-80 hover:opacity-100 transition-opacity">
            <img src="/logo-coroa.png" alt="Coroa" className="w-5 h-5 object-contain" />
            <span className="text-yellow-500 font-black tracking-widest uppercase text-sm"> Royal Pod&apos;s</span>
            <img src="/logo-coroa.png" alt="Coroa" className="w-5 h-5 object-contain" />
          </div>
          
          {/* Direitos Autorais */}
          <p className="text-gray-600 text-xs text-center font-medium">
            © {new Date().getFullYear()}{' '}Royal Pod&apos;s. Todos os direitos reservados.
          </p>
          {/* Redes Sociais */}
          <div className="flex gap-4">
            <a 
              href="https://instagram.com/-----INSTA AQUI-----" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 bg-[#070708] border border-gray-800 rounded-full text-gray-400 hover:text-yellow-500 hover:border-yellow-500 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
          </div>

        </div>
      </footer>

            <a
        href="https://wa.me/5511999999999?text=Olá!%20Estou%20no%20site%20da%20Royal%20Pod's%20e%20preciso%20de%20ajuda."
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed right-6 z-[90] flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-400 hover:scale-110 hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all duration-300 ${
          totalItens > 0 ? 'bottom-28' : 'bottom-6'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-0.5 mt-0.5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>
      </>
  )
}
