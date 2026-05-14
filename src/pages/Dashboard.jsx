const OPTIONS = [
  { icon: '💰', title: 'Transferencias a otros bancos', desc: 'Envía dinero a cuentas de otros bancos', active: true },
  { icon: '🔄', title: 'Transferencias entre cuentas', desc: 'Mueve dinero entre tus cuentas', active: false },
  { icon: '💳', title: 'Pago de tarjetas', desc: 'Paga tus tarjetas de crédito', active: false },
]

export default function Dashboard({ user, onTransfer, onLogout }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>🏦 BankInvaders</h2>
        <div className="dashboard-user">
          {user} · <button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#fff', opacity: 0.8, cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}>Cerrar sesión</button>
        </div>
      </div>
      <div style={{ padding: '24px 32px 0', maxWidth: '1000px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151' }}>Tus operaciones</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Selecciona una opción para continuar</p>
      </div>
      <div className="dashboard-grid">
        {OPTIONS.map((opt, i) => (
          <div
            key={i}
            className={`dash-card ${opt.active ? '' : 'locked'}`}
            onClick={opt.active ? onTransfer : undefined}
          >
            <div className="dash-card-icon">{opt.icon}</div>
            <h3>{opt.title}</h3>
            <p>{opt.desc}</p>
            <span className={`badge ${opt.active ? 'active' : 'coming'}`}>
              {opt.active ? 'Disponible' : 'Próximamente'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
