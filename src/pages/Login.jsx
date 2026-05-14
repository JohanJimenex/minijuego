import { useState } from 'react'

export default function Login({ onLogin }) {
  const [user, setUser] = useState('johan')
  const [pass, setPass] = useState('123456')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user || !pass) {
      setError('Completa todos los campos')
      return
    }
    onLogin(user)
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <h1>🏦 BankInvaders</h1>
          <p>Banca digital segura</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Usuario</label>
            <input
              type="text"
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="tu usuario"
              autoFocus
            />
          </div>
          <div className="login-field">
            <label>Contraseña</label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="login-btn">Iniciar sesión</button>
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#9ca3af' }}>
            Usuario: <strong>johan</strong> · Contraseña: <strong>123456</strong>
          </div>
          {error && <div className="login-error">{error}</div>}
        </form>
      </div>
    </div>
  )
}
