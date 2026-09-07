import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SolanaWalletProvider } from './context/SolanaWalletProvider'
import { TokenDataProvider } from './context/TokenDataContext'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SolanaWalletProvider>
      <TokenDataProvider>
        <App />
      </TokenDataProvider>
    </SolanaWalletProvider>
  </StrictMode>,
)

