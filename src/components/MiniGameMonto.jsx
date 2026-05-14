import { useEffect, useRef, useState } from 'react'

const BILLS = [50, 100, 200, 500, 1000]
const W = 700, H = 450

export default function MiniGameMonto({ onWin }) {
  const canvasRef = useRef(null)
  const onWinRef = useRef(onWin)
  onWinRef.current = onWin
  const [sum, setSum] = useState(0)
  const sumRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = W; canvas.height = H

    const keys = {}
    let animId, running = true
    const basket = { x: W / 2 - 40, y: H - 60, w: 80, h: 25 }
    let currentSum = 0, spawnTimer = 0, frame = 0
    const falling = []
    let catchCooldown = 0
    let flashMsg = '', flashTimer = 0

    const kd = e => {
      keys[e.key] = true
      if ((e.key === ' ' || e.key === 'Space') && catchCooldown <= 0) {
        e.preventDefault()
        let caught = null
        for (const f of falling) {
          if (f.y + f.h >= basket.y && f.y <= basket.y + basket.h &&
              f.x + f.w > basket.x && f.x < basket.x + basket.w) {
            caught = f; break
          }
        }
        if (caught) {
          currentSum += caught.value
          sumRef.current = currentSum
          setSum(currentSum)
          flashMsg = '+$' + caught.value
          flashTimer = 20
          caught.caught = true
          catchCooldown = 15
        }
      }
    }
    const ku = e => keys[e.key] = false
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku)

    function update() {
      frame++
      if (catchCooldown > 0) catchCooldown--
      if (flashTimer > 0) flashTimer--
      else if (flashMsg) flashMsg = ''

      if (keys['ArrowLeft'] || keys['a']) basket.x = Math.max(0, basket.x - 7)
      if (keys['ArrowRight'] || keys['d']) basket.x = Math.min(W - basket.w, basket.x + 7)

      spawnTimer++
      if (spawnTimer >= Math.max(15, 40 - frame / 300)) {
        spawnTimer = 0
        const val = BILLS[Math.floor(Math.random() * BILLS.length)]
        falling.push({ x: Math.random() * (W - 70), y: -50, w: 70, h: 40, value: val, caught: false })
      }

      for (let i = falling.length - 1; i >= 0; i--) {
        const f = falling[i]
        if (f.caught) { falling.splice(i, 1); continue }
        f.y += 2.5
        if (f.y > H) falling.splice(i, 1)
      }
    }

    function draw() {
      ctx.fillStyle = '#0d0d2a'; ctx.fillRect(0, 0, W, H)

      ctx.strokeStyle = 'rgba(80,186,64,0.04)'
      for (let i = 0; i < W; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke() }
      for (let i = 0; i < H; i += 30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke() }

      for (const f of falling) {
        const colors = { 50: '#d4edda', 100: '#c3e6cb', 200: '#ffeeba', 500: '#f8d7da', 1000: '#f5c6cb' }
        ctx.fillStyle = colors[f.value] || '#aaa'
        ctx.strokeStyle = '#666'; ctx.lineWidth = 1
        ctx.fillRect(f.x, f.y, f.w, f.h)
        ctx.strokeRect(f.x, f.y, f.w, f.h)
        ctx.fillStyle = '#000'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText('$' + f.value, f.x + f.w / 2, f.y + f.h / 2)
      }

      ctx.fillStyle = '#50BA40'
      ctx.fillRect(basket.x, basket.y, basket.w, basket.h)
      ctx.fillStyle = '#3d9a30'
      ctx.fillRect(basket.x + 10, basket.y - 6, basket.w - 20, 6)

      ctx.textAlign = 'left'
      ctx.fillStyle = '#fff'; ctx.font = '24px sans-serif'
      ctx.fillText('$' + currentSum, 15, 32)

      if (flashMsg) {
        ctx.fillStyle = '#50BA40'
        ctx.font = '20px sans-serif'
        ctx.textAlign = 'right'
        ctx.fillText(flashMsg, W - 15, 32)
      }
    }

    function loop() {
      if (!running) return
      update(); draw()
      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => {
      running = false
      cancelAnimationFrame(animId)
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
    }
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} className="game-canvas" />
      <div className="modal-controls">
        ← → mover cesta · ESPACIO atrapar
      </div>
      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <button
          onClick={() => onWinRef.current?.(sumRef.current)}
          style={{
            padding: '10px 32px',
            background: sum > 0 ? '#50BA40' : '#9ca3af',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: sum > 0 ? 'pointer' : 'not-allowed',
          }}
          disabled={sum === 0}
        >
          Continuar con ${sum}
        </button>
      </div>
    </div>
  )
}
