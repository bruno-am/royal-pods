'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  nome: string
  sabor?: string
  preco: number | string
  imagem_url?: string
  quantidade: number
}

interface CartContextType {
  carrinho: CartItem[]
  adicionarAoCarrinho: (produto: any) => void
  removerDoCarrinho: (id: string) => void
  diminuirQuantidade: (id: string) => void
  limparCarrinho: () => void
  totalItens: number
  valorTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [carrinho, setCarrinho] = useState<CartItem[]>([])
    const [carregou, setCarregou] = useState(false)

    useEffect(() => {
      const carrinhoSalvo = localStorage.getItem('royalPods_carrinho')
      if (carrinhoSalvo) {
        setCarrinho(JSON.parse(carrinhoSalvo))
      }
      setCarregou(true)
    }, [])

    useEffect(() => {
      if (carregou) { 
        localStorage.setItem('royalPods_carrinho', JSON.stringify(carrinho))
      }
    }, [carrinho, carregou])

  const adicionarAoCarrinho = (produto: any) => {
    setCarrinho((carrinhoAtual) => {
      const existe = carrinhoAtual.find(item => item.id === produto.id)
      if (existe) {
        return carrinhoAtual.map(item => 
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        )
      }
      return [...carrinhoAtual, { ...produto, quantidade: 1 }]
    })
  }

  const removerDoCarrinho = (id: string) => {
    setCarrinho((carrinhoAtual) => carrinhoAtual.filter(item => item.id !== id))
  }

const diminuirQuantidade = (id: string) => {
    setCarrinho((carrinhoAtual) =>
      carrinhoAtual
        .map((item) =>
          item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item
        )
        .filter((item) => item.quantidade > 0)
    )
  }
  const limparCarrinho = () => setCarrinho([])

  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0)
  const valorTotal = carrinho.reduce((acc, item) => acc + (Number(item.preco || 0) * item.quantidade), 0)

  return (
    <CartContext.Provider value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho, diminuirQuantidade, limparCarrinho, totalItens, valorTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart deve ser usado dentro de um CartProvider')
  return context
}