import { useEffect, useRef, useState } from 'react'

const W = 700, H = 350
const DICE_COUNT = 8

export default function MiniGameCuenta({ onWin }) {
  const canvasRef = useRef(null)
  const onWinRef = useRef(onWin)
  onWinRef.current = onWin
  const [digits, setDigits] = useState(Array(DICE_COUNT).fill(0))

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = W; canvas.height = H

    const dieSize = 54
    const gap = 14
    const startX = (W - (DICE_COUNT * dieSize + (DICE_COUNT - 1) * gap)) / 2
    const dieY = 30

    const player = {
      x: startX + dieSize / 2,
      y: H - 60,
      w: 20,
      h: 28,
      vx: 0,
      vy: 0,
      grounded: true,
    }

    let digits = Array(DICE_COUNT).fill(0)
    let hitCooldowns = Array(DICE_COUNT).fill(0)
    let animId, running = true
    const keys = {}
    let jumpFrames = 0

    const kd = e => {
      keys[e.key] = true
      if ((e.key === ' ' || e.key === 'Space') && player.grounded) {
        e.preventDefault()
        player.vy = -9
        player.grounded = false
        jumpFrames = 20
      }
    }
    const ku = e => keys[e.key] = false
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku)

    function update() {
      if (keys['ArrowLeft'] || keys['a']) player.vx = -4
      else if (keys['ArrowRight'] || keys['d']) player.vx = 4
      else player.vx *= 0.7

      player.x += player.vx
      player.x = Math.max(10, Math.min(W - 10, player.x))

      if (!player.grounded) {
        player.vy += 0.5
        player.y += player.vy
        if (jumpFrames > 0) jumpFrames--
      }

      if (player.y >= H - 60) {
        player.y = H - 60
        player.vy = 0
        player.grounded = true
      }

      for (let i = 0; i < DICE_COUNT; i++) {
        if (hitCooldowns[i] > 0) hitCooldowns[i]--
      }

      if (!player.grounded && player.vy < 0) {
        const headY = player.y
        for (let i = 0; i < DICE_COUNT; i++) {
          if (hitCooldowns[i] > 0) continue
          const dx = startX + i * (dieSize + gap) + dieSize / 2
          if (Math.abs(player.x - dx) < dieSize / 2 + 8 && headY < dieY + dieSize && headY > dieY) {
            digits[i] = (digits[i] + 1) % 10
            setDigits([...digits])
            player.vy = 5
            hitCooldowns[i] = 15
          }
        }
      }
    }

    function drawDie(x, y, digit, idx) {
      const r = 8
      const cd = hitCooldowns[idx] > 0

      ctx.fillStyle = '#1e1e32'
      ctx.strokeStyle = cd ? '#50BA40' : '#4a4a6a'
      ctx.lineWidth = cd ? 3 : 2
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

      const isActive = Math.abs(player.x - (x + dieSize / 2)) < dieSize / 2 + 8

      if (isActive && player.grounded) {
        ctx.fillStyle = 'rgba(80,186,64,0.12)'
        ctx.beginPath()
        ctx.arc(x + dieSize / 2, y + dieSize / 2, dieSize / 2 + 6, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = '#fff'
      ctx.font = 'bold 24px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(digit, x + dieSize / 2, y + dieSize / 2 - 2)
    }

    function drawPlayer() {
      const bobY = player.grounded ? Math.sin(Date.now() / 200) * 1 : 0
      const px = player.x
      const py = player.y + bobY

      ctx.fillStyle = '#e53e3e'
      ctx.fillRect(px - 10, py - 20, 20, 8)
      ctx.fillStyle = '#fbd38d'
      ctx.fillRect(px - 8, py - 12, 16, 8)
      ctx.fillStyle = '#e53e3e'
      ctx.fillRect(px - 8, py - 4, 16, 10)
      ctx.fillStyle = '#2b6cb0'
      ctx.fillRect(px - 8, py + 6, 16, 10)
      ctx.fillStyle = '#f6ad55'
      ctx.beginPath()
      ctx.arc(px - 2, py - 1, 1.5, 0, Math.PI * 2)
      ctx.arc(px + 2, py - 1, 1.5, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#fbd38d'
      ctx.fillRect(px - 6, py + 16, 5, 6)
      ctx.fillRect(px + 1, py + 16, 5, 6)
    }

    function draw() {
      ctx.fillStyle = '#0d0d2a'
      ctx.fillRect(0, 0, W, H)

      ctx.strokeStyle = 'rgba(80,186,64,0.03)'
      for (let i = 0; i < W; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke() }
      for (let i = 0; i < H; i += 30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke() }

      ctx.fillStyle = '#2a2a3e'
      ctx.fillRect(0, H - 30, W, 30)
      ctx.strokeStyle = '#3a3a5c'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, H - 30); ctx.lineTo(W, H - 30); ctx.stroke()

      for (let i = 0; i < DICE_COUNT; i++) {
        const x = startX + i * (dieSize + gap)
        drawDie(x, dieY, digits[i], i)
      }

      drawPlayer()

      ctx.fillStyle = '#fff'
      ctx.font = 'bold 18px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(digits.join(''), W / 2, H - 8)
    }

    function loop() {
      if (!running) return
      update(); draw()
      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => { running = false; cancelAnimationFrame(animId); window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku) }
  }, [])

  const account = digits.join('')

  return (
    <div>
      <canvas ref={canvasRef} className="game-canvas" />
      <div className="modal-controls">
        ← → mover · ESPACIO saltar y golpear dados
      </div>
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
    </div>
  )
}
