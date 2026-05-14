import { useState } from 'react'
import GameModal from '../components/GameModal'

const INITIAL = {
  cuentaOrigen: '',
  bancoDestino: '',
  cuentaDestino: '',
  monto: '',
  correo: '',
  descripcion: '',
}

const ORIGENES = ['0001-1234-5678-9010', '0002-2345-6789-0120', '0003-3456-7890-1230']

export default function TransferForm({ onBack, onComplete }) {
  const [form, setForm] = useState(INITIAL)
  const [modal, setModal] = useState(null)

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const openModal = (game) => {
    if (game === 'banco' && !form.bancoDestino) setModal('banco')
    if (game === 'monto' && !form.monto) setModal('monto')
  }

  const handleGameWin = (game, value) => {
    if (game === 'banco') update('bancoDestino', value)
    if (game === 'monto') update('monto', String(value))
    if (game === 'jefe') { onComplete(true); return }
    setModal(null)
  }

  const handleGameLose = () => {
    setModal(null)
  }

  const allFilled = form.cuentaOrigen && form.bancoDestino && form.cuentaDestino && form.monto && form.correo && form.descripcion

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
            <select value={form.cuentaOrigen} onChange={e => update('cuentaOrigen', e.target.value)}>
              <option value="">Selecciona una cuenta</option>
              {ORIGENES.map((c, i) => (
                <option key={i} value={c}>{c} — ${[25000, 15000, 8000][i]}.00</option>
              ))}
            </select>
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
            <label>Cuenta destino</label>
            <input
              type="text"
              placeholder="0000-0000-0000-0000"
              value={form.cuentaDestino}
              onChange={e => update('cuentaDestino', e.target.value)}
            />
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

          <div className="form-group">
            <label>Correo de notificación</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.correo}
              onChange={e => update('correo', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <input
              type="text"
              placeholder="Motivo de la transferencia"
              value={form.descripcion}
              onChange={e => update('descripcion', e.target.value)}
            />
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
