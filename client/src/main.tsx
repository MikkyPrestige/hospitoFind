import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.tsx'
import '@/assets/styles/index.css'
import { ContextProvider } from '@/contexts/userContext.tsx'
import AuthProvider from '@/authConfig/auth0'
import { BrowserRouter } from "react-router-dom"
import { disableReactDevTools } from '@fvilers/disable-react-devtools'


if (process.env.NODE_ENV === 'production') disableReactDevTools()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ContextProvider>
    </AuthProvider>
  </React.StrictMode>,
)
