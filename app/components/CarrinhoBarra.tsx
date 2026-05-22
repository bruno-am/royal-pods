'use client'

import { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function CarrinhoBarra() {
  const { carrinho, totalItens, valorTotal, limparCarrinho, adicionarAoCarrinho, diminuirQuantidade } = useCart()
  
  const [modalAberto, setModalAberto] = useState(false)
  const [nomeCliente, setNomeCliente] = useState('')
  const [endereco, setEndereco] = useState('')
  const [formaPagamento, setFormaPagamento] = useState('Pix')

  if (totalItens === 0) return null

  const fecharPedidoWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nomeCliente.trim() || !endereco.trim()) {
      alert('Por favor, preencha o seu nome e endereço de entrega!')
      return
    }

    const itensTexto = carrinho
      .map(item => `• *${item.quantidade}x* ${item.nome} - R$ ${(Number(item.preco) * item.quantidade).toFixed(2)}`)
      .join('\n')
    
    const textoMensagem = 
      `👑 *NOVO PEDIDO - ROYAL POD'S* 👑\n\n` +
      `👤 *Cliente:* ${nomeCliente}\n` +
      `📍 *Endereço:* ${endereco}\n` +
      `💳 *Forma de Pagamento:* ${formaPagamento}\n\n` +
      `📦 *Itens do Pedido:*\n${itensTexto}\n\n` +
      `💵 *Total: R$ ${valorTotal.toFixed(2)}*\n\n` +
      `*Aguardando confirmação...*`

    const numeroLoja = "------NUMERO DO WPP------" 
    const url = `https://wa.me/${numeroLoja}?text=${encodeURIComponent(textoMensagem)}`
    window.open(url, '_blank')
    
    setModalAberto(false)
  }

  return (
    <>
      {/* BARRA INFERIOR DA SACOLA */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111113] border-t border-gray-800 z-50 px-4 py-4 md:px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
              Sacola ({totalItens} {totalItens === 1 ? 'item' : 'itens'})
            </span>
            <span className="text-yellow-500 font-black text-xl md:text-2xl">
              R$ {valorTotal.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={limparCarrinho}
              className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-200"
              title="Limpar sacola"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>

            <button
              onClick={() => setModalAberto(true)}
              className="bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-wider text-sm px-6 py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(34,197,94,0.3)] hover:scale-[1.02]"
            >
              Enviar Pedido
            </button>
          </div>
        </div>
      </div>

      {/* JANELA FLUTUANTE */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#111113] border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="mb-4">
              <h3 className="text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                👑 Finalizar Pedido
              </h3>
              <p className="text-gray-400 text-xs mt-1">Revise seus itens e preencha a entrega.</p>
            </div>

            {/* LISTA DE PRODUTOS */}
            <div className="mb-6 space-y-2 max-h-40 overflow-y-auto pr-2">
              {carrinho.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-[#18181b] p-3 rounded-xl border border-gray-800/50">
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-bold">{item.nome}</span>
                    <span className="text-gray-400 text-xs">R$ {(Number(item.preco) * item.quantidade).toFixed(2)}</span>
                  </div>
                  
                  {/* Controles de Quantidade */}
                  <div className="flex items-center bg-[#111113] border border-gray-800 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => diminuirQuantidade(item.id)}
                      className="px-3 py-1 text-red-500 hover:bg-gray-800 font-black text-sm transition-colors"
                    >
                      -
                    </button>
                    <span className="text-white text-xs font-bold px-2 min-w-[20px] text-center">
                      {item.quantidade}
                    </span>
                    <button
                      type="button"
                      onClick={() => adicionarAoCarrinho(item)}
                      className="px-3 py-1 text-green-500 hover:bg-gray-800 font-black text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={fecharPedidoWhatsApp} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Seu Nome</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: João Silva"
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  className="w-full bg-[#18181b] border border-gray-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Endereço de Entrega</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Rua, número, bairro e CEP"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="w-full bg-[#18181b] border border-gray-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Pix', 'Cartão de crédito/débito'].map((opcao) => (
                    <button
                      key={opcao}
                      type="button"
                      onClick={() => setFormaPagamento(opcao)}
                      className={`py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all ${
                        formaPagamento === opcao
                          ? "bg-yellow-500 text-black border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                          : "bg-[#18181b] text-gray-400 border-gray-800 hover:bg-gray-800"
                      }`}
                    >
                      {opcao}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-800 my-6 pt-4 flex justify-between items-center">
                <span className="text-gray-400 text-sm font-medium">Total a pagar:</span>
                <span className="text-yellow-500 font-black text-xl">R$ {valorTotal.toFixed(2)}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="w-1/3 bg-transparent border border-gray-800 hover:bg-gray-800 text-gray-400 font-bold py-3.5 rounded-xl text-sm transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-wider py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                >
                  Concluir compra no WhatsApp
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  )
}