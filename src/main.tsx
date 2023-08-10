import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.tsx'
import '@/assets/styles/index.css'
import { BrowserRouter } from "react-router-dom"
import { ContextProvider } from './context/userContext'
import AuthProvider from './config/auth0'
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <HelmetProvider>
          <ContextProvider>
            <App />
          </ContextProvider>
        </HelmetProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
