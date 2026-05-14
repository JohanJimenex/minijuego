import { useState } from 'react'
import GameModal from '../components/GameModal'

const CUENTA_ORIGEN = '1234-5678-9012-3456'

const INITIAL = {
  cuentaOrigen: CUENTA_ORIGEN,
  bancoDestino: '',
  cuentaDestino: '',
  monto: '',
}

export default function TransferForm({ onBack, onComplete }) {
  const [form, setForm] = useState(INITIAL)
  const [modal, setModal] = useState(null)

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const openModal = (game) => {
    if (game === 'destino') setModal('destino')
    if (game === 'banco') setModal('banco')
    if (game === 'monto') setModal('monto')
  }

  const handleGameWin = (game, value) => {
    if (game === 'destino') update('cuentaDestino', value)
    if (game === 'banco') update('bancoDestino', value)
    if (game === 'monto') update('monto', String(value))
    if (game === 'jefe') { onComplete(true); return }
    setModal(null)
  }

  const handleGameLose = () => {
    setModal(null)
  }

  const allFilled = form.bancoDestino && form.cuentaDestino && form.monto

  return (
    <div className="transfer-page">
      <div className="transfer-header">
        <button className="back-btn" onClick={onBack}>← Volver</button>
        <h2>Transferencia a otro banco</h2>
      </div>
      <div className="transfer-body">
        <div className="transfer-card">
          <div className="transfer-title">Nueva transferencia</div>

          <div className="form-group">
            <label>Cuenta origen</label>
            <input
              type="text"
              value={CUENTA_ORIGEN}
              disabled
              style={{ background: '#f3f4f6', color: '#6b7280', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label>
              Banco destino
              <span className="game-badge">🎮 minijuego</span>
            </label>
            <div className={`game-field ${form.bancoDestino ? 'completed' : ''}`} onClick={() => openModal('banco')}>
              <input
                type="text"
                placeholder="Haz clic para seleccionar banco"
                value={form.bancoDestino}
                readOnly
              />
              <span className="click-hint">{form.bancoDestino ? '✓' : '🎮'}</span>
            </div>
          </div>

          <div className="form-group">
            <label>
              Cuenta destino
              <span className="game-badge">🎮 minijuego</span>
            </label>
            <div className={`game-field ${form.cuentaDestino ? 'completed' : ''}`} onClick={() => openModal('destino')}>
              <input
                type="text"
                placeholder="Haz clic para generar cuenta"
                value={form.cuentaDestino}
                readOnly
              />
              <span className="click-hint">{form.cuentaDestino ? '✓' : '🎮'}</span>
            </div>
          </div>

          <div className="form-group">
            <label>
              Monto
              <span className="game-badge">🎮 minijuego</span>
            </label>
            <div className={`game-field ${form.monto ? 'completed' : ''}`} onClick={() => openModal('monto')}>
              <input
                type="text"
                placeholder="Haz clic para definir monto"
                value={form.monto ? '$' + form.monto : ''}
                readOnly
              />
              <span className="click-hint">{form.monto ? '✓' : '🎮'}</span>
            </div>
          </div>

          <button
            className="submit-btn"
            disabled={!allFilled}
            onClick={() => setModal('jefe')}
          >
            Confirmar transferencia
          </button>
        </div>
      </div>

      {modal && (
        <GameModal
          game={modal}
          onWin={(val) => handleGameWin(modal, val)}
          onLose={handleGameLose}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
