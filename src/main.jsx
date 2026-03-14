import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App.jsx'
import { ErrorBoundary } from './app/ErrorBoundary.jsx'
import { validateEnv } from './shared/config/env.js'
import { initializeGlobalErrorHandlers, logInfo } from './shared/observability/logger.js'
import { storage } from './shared/lib/storage.js'
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento #root não encontrado no documento.')
}

validateEnv()
initializeGlobalErrorHandlers()

// Inicializa Sentry se DSN estiver configurado (deixar vazio desativa)
const sentryDsn = import.meta.env.VITE_SENTRY_DSN
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.VITE_APP_ENV ?? 'production',
    release: import.meta.env.VITE_APP_VERSION,
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    integrations: [Sentry.browserTracingIntegration()],
  })
}

// Hardening: migrar schema e purgar chaves expiradas
storage.migrate()
storage.purgeExpired()

logInfo('app_loaded')

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)