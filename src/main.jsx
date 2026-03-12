import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ErrorBoundary } from './app/ErrorBoundary.jsx'
import { validateEnv } from './shared/config/env.js'
import { initializeGlobalErrorHandlers, logInfo } from './shared/observability/logger.js'
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento #root não encontrado no documento.')
}

validateEnv()
initializeGlobalErrorHandlers()
logInfo('app_loaded')

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)