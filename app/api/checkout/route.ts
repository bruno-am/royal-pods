import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || ''
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items } = body

    const preference = new Preference(client)
    
    const response = await preference.create({
      body: {
        items: items, 
        
        back_urls: {
          success: 'http://localhost:3000/sucesso',
          failure: 'http://localhost:3000',
          pending: 'http://localhost:3000',
        },
        auto_return: 'approved',
      }
    })

    return NextResponse.json({ url: response.init_point })

  } catch (error) {
    console.error('Erro ao criar pagamento:', error)
    return NextResponse.json({ error: 'Erro ao gerar link de pagamento' }, { status: 500 })
  }
}