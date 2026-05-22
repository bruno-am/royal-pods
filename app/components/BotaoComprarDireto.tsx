'use client'

import { useCart } from '../context/CartContext'

export function BotaoComprarDireto({ produto }: { produto: any }) {
  const { carrinho, adicionarAoCarrinho } = useCart()

  const itemNoCarrinho = carrinho.find(item => item.id === produto.id)
  const qtdNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0

  const handleClique = (e: React.MouseEvent) => {
    e.preventDefault() 
    adicionarAoCarrinho(produto)
  }

  return (
    <button 
      onClick={handleClique}
      className={`w-full font-black py-4 rounded-xl uppercase text-base transition-all duration-300 hover:-translate-y-1 shadow-lg ${
        qtdNoCarrinho > 0 
          ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/10' 
          : 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-yellow-500/10'
      }`}
    >
      {qtdNoCarrinho > 0 ? `Na Sacola (${qtdNoCarrinho})` : 'Comprar Agora'}
    </button>
  )
}