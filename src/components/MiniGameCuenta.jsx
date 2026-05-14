import { useEffect, useRef, useState } from 'react'

const W = 700, H = 300
const DICE_COUNT = 8

export default function MiniGameCuenta({ onWin }) {
  const canvasRef = useRef(null)
  const onWinRef = useRef(onWin)
  onWinRef.current = onWin
  const [digits, setDigits] = useState(Array(DICE_COUNT).fill(0))
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = W; canvas.height = H

    let digits = Array(DICE_COUNT).fill(0)
    let currentDie = 0
    let jumping = false
    let jumpFrame = 0
    let charX = 50
    const dieSize = 56
    const gap = 16
    const startX = (W - (DICE_COUNT * dieSize + (DICE_COUNT - 1) * gap)) / 2
    const dieY = 40

    const kd = e => {
      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault()
        if (done) return
        if (currentDie < DICE_COUNT) {
          digits[currentDie] = (digits[currentDie] + 1) % 10
          setDigits([...digits])
          jumping = true
          jumpFrame = 0
        }
      }
      if ((e.key === 'Enter' || e.key === 'ArrowDown') && currentDie < DICE_COUNT) {
        e.preventDefault()
        currentDie++
        setCurrent(currentDie)
        if (currentDie >= DICE_COUNT) {
          setDone(true)
          onWinRef.current?.(digits.join(''))
        }
      }
    }
    window.addEventListener('keydown', kd)

    function update() {
      if (jumping) {
        jumpFrame++
        if (jumpFrame > 12) jumping = false
      }
      charX = startX + currentDie * (dieSize + gap) + dieSize / 2
    }

    function drawDie(x, y, digit, active, locked) {
      const r = 8
      ctx.fillStyle = active ? '#e0f2fe' : (locked ? '#d1fae5' : '#1e1e32')
      ctx.strokeStyle = active ? '#3b82f6' : (locked ? '#50BA40' : '#4a4a6a')
      ctx.lineWidth = active ? 3 : 2
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + dieSize - r, y)
      ctx.quadraticCurveTo(x + dieSize, y, x + dieSize, y + r)
      ctx.lineTo(x + dieSize, y + dieSize - r)
      ctx.quadraticCurveTo(x + dieSize, y + dieSize, x + dieSize - r, y + dieSize)
      ctx.lineTo(x + r, y + dieSize)
      ctx.quadraticCurveTo(x, y + dieSize, x, y + dieSize - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      if (active) {
        for (let i = 0; i < 3; i++) {
          const dot = i === 0 ? digit : (i === 1 ? digit + 1 : digit - 1)
          const d = (dot + 10) % 10
          ctx.fillStyle = `rgba(59,130,246,${0.2 - i * 0.06})`
          ctx.font = '10px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(d, x + dieSize / 2 + (i - 1) * 20, y + dieSize / 2 - 15)
        }
      }

      ctx.fillStyle = active ? '#1e40af' : (locked ? '#065f46' : '#fff')
      ctx.font = 'bold 26px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(digit, x + dieSize / 2, y + dieSize / 2)
    }

    function drawMario(cx, cy) {
      const j = jumping ? Math.sin(jumpFrame / 12 * Math.PI) * 20 : 0
      const by = cy - j

      ctx.fillStyle = '#e53e3e'
      ctx.fillRect(cx - 12, by - 20, 24, 8)
      ctx.fillStyle = '#fbd38d'
      ctx.fillRect(cx - 10, by - 12, 20, 10)
      ctx.fillStyle = '#e53e3e'
      ctx.fillRect(cx - 10, by - 2, 20, 10)
      ctx.fillStyle = '#2b6cb0'
      ctx.fillRect(cx - 10, by + 8, 20, 10)
      ctx.fillStyle = '#f6ad55'
      ctx.beginPath()
      ctx.arc(cx - 3, by + 3, 2, 0, Math.PI * 2)
      ctx.arc(cx + 3, by + 3, 2, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#fbd38d'
      ctx.fillRect(cx - 9, by + 18, 7, 8)
      ctx.fillRect(cx + 2, by + 18, 7, 8)
    }

    function draw() {
      ctx.fillStyle = '#0d0d2a'; ctx.fillRect(0, 0, W, H)

      ctx.strokeStyle = 'rgba(80,186,64,0.04)'
      for (let i = 0; i < W; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke() }
      for (let i = 0; i < H; i += 30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke() }

      for (let i = 0; i < DICE_COUNT; i++) {
        const x = startX + i * (dieSize + gap)
        drawDie(x, dieY, digits[i], i === currentDie && !done, i < currentDie || done)
      }

      if (!done) {
        drawMario(charX, dieY + dieSize + 30)
      }

      ctx.fillStyle = '#9ca3af'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      if (!done) {
        ctx.fillText('ESPACIO: girar dado  ·  ENTER: confirmar dado', W / 2, H - 20)
      } else {
        ctx.fillStyle = '#50BA40'
        ctx.font = '16px sans-serif'
        ctx.fillText('✓ Cuenta: ' + digits.join(''), W / 2, H - 30)
      }
    }

    function loop() {
      if (!running) return
      update(); draw()
      animId = requestAnimationFrame(loop)
    }

    let animId, running = true
    animId = requestAnimationFrame(loop)
    return () => { running = false; cancelAnimationFrame(animId); window.removeEventListener('keydown', kd) }
  }, [])

  const account = digits.join('')

  return (
    <div>
      <canvas ref={canvasRef} className="game-canvas" />
      {done && (
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <button
            onClick={() => onWinRef.current?.(account)}
            style={{
              padding: '10px 32px',
              background: '#50BA40',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Usar cuenta {account}
          </button>
        </div>
      )}
    </div>
  )
}
