import { CartProvider } from './context/CartContext'
import  CarrinhoBarra  from './components/CarrinhoBarra'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>
          {children}
          <CarrinhoBarra />
        </CartProvider>
      </body>
    </html>
  )
}