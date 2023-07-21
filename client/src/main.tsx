import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.tsx'
import '@/assets/styles/index.css'
import { BrowserRouter } from "react-router-dom"
import AuthProvider from './config/auth0'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
