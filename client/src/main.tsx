import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.tsx'
import '@/assets/styles/index.css'
import { ContextProvider } from '@/contexts/userContext.tsx'
import AuthProvider from '@/config/auth0.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ContextProvider>
        <App />
      </ContextProvider>
    </AuthProvider>
  </React.StrictMode>,
)
