import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './utils/Themes/ThemeProvider'
import ThemeCssVariables from './utils/Themes/ThemeCssVariable'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ThemeCssVariables />
      <Toaster
        position="top-right"
        richColors={false}
        closeButton
        toastOptions={{ style: { fontFamily: "'Poppins', sans-serif", fontSize: "0.875rem" } }}
      />
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)

