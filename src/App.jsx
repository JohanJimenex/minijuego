import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import TransferForm from './pages/TransferForm'

export default function App() {
  const [screen, setScreen] = useState('login')
  const [user, setUser] = useState('')
  const [result, setResult] = useState(null)

  if (result) {
    return (
      <div className={`result-overlay ${result.success ? 'success' : 'fail'}`}>
        <div className="result-card">
          <div className="result-icon">{result.success ? '✓' : '✗'}</div>
          <h2 style={{ color: result.success ? '#059669' : '#dc2626' }}>
            {result.success ? 'Transferencia exitosa' : 'Transferencia rechazada'}
          </h2>
          <p>
            {result.success
              ? 'Los fondos han sido transferidos correctamente al banco destino.'
              : 'La transferencia no pudo ser completada. Verifica los datos e intenta nuevamente.'}
          </p>
          <button
            className="retry-btn primary"
            onClick={() => { setScreen('dashboard'); setResult(null) }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'login') {
    return <Login onLogin={(name) => { setUser(name); setScreen('dashboard') }} />
  }

  if (screen === 'dashboard') {
    return <Dashboard user={user} onTransfer={() => setScreen('transfer')} onLogout={() => setScreen('login')} />
  }

  if (screen === 'transfer') {
    return <TransferForm onBack={() => setScreen('dashboard')} onComplete={(ok) => setResult({ success: ok })} />
  }

  return null
}
