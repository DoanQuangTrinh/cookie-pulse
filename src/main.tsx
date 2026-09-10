import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SolanaWalletProvider } from './context/SolanaWalletProvider'
import { TokenDataProvider } from './context/TokenDataContext'
import { LanguageProvider } from './context/LanguageContext'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <SolanaWalletProvider>
        <TokenDataProvider>
          <App />
        </TokenDataProvider>
      </SolanaWalletProvider>
    </LanguageProvider>
  </StrictMode>,
)

