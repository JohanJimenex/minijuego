import MiniGameBanco from './MiniGameBanco'
import MiniGameMonto from './MiniGameMonto'
import MiniGameJefe from './MiniGameJefe'

const TITLES = {
  banco: 'Selecciona el banco destino',
  monto: 'Define el monto exacto',
  jefe: 'Autoriza la transferencia',
}

export default function GameModal({ game, onWin, onLose, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{TITLES[game]}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {game === 'banco' && <MiniGameBanco onWin={(b) => onWin(b)} />}
          {game === 'monto' && <MiniGameMonto onWin={(m) => onWin(m)} />}
          {game === 'jefe' && (
            <MiniGameJefe
              onWin={() => onWin('jefe')}
              onLose={onLose}
            />
          )}
        </div>
        {game !== 'jefe' && (
          <div className="modal-controls">
            Presiona ESPACIO para interactuar · Haz clic fuera para cancelar
          </div>
        )}
      </div>
    </div>
  )
}
