'use client'

import { useCart } from '../context/CartContext'

export function BotaoAdicionar({ produto }: { produto: any }) {
  const { adicionarAoCarrinho } = useCart()

  return (
    <button 
      onClick={() => adicionarAoCarrinho(produto)}
      className="w-full bg-yellow-500 text-black font-black py-3 rounded-xl hover:bg-yellow-400 transition-all uppercase text-sm mt-4"
    >
      Adicionar ao Carrinho
    </button>
  )
}