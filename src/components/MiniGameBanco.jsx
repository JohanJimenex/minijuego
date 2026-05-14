import { useEffect, useRef } from 'react'

const BANKS = [
  'BBVA', 'SANTANDER', 'BANAMEX', 'HSBC', 'SCOTIABANK',
  'BANREGIO', 'AZTECA', 'BANORTE', 'INBURSA', 'AFIRME',
]

const W = 700, H = 450

export default function MiniGameBanco({ onWin, onLose }) {
  const canvasRef = useRef(null)
  const onWinRef = useRef(onWin)
  onWinRef.current = onWin

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = W; canvas.height = H

    const target = BANKS[Math.floor(Math.random() * BANKS.length)]

    const balloons = BANKS.map(name => ({
      name,
      target: name === target,
      x: 50 + Math.random() * (W - 100),
      y: 60 + Math.random() * (H - 120),
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      r: 28,
    }))

    let state = 'playing', endCounter = 0, frame = 0, speed = 1
    let particles = [], cursor = { x: 0, y: 0 }

    function spawnParticles(x, y, color, count = 12) {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2
        const sp = 1 + Math.random() * 3
        particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 30, maxLife: 30, color, r: 2 + Math.random() * 3 })
      }
    }

    const handleClick = (e) => {
      if (state !== 'playing') return
      const rect = canvas.getBoundingClientRect()
      const mx = (e.clientX - rect.left) * (W / rect.width)
      const my = (e.clientY - rect.top) * (H / rect.height)
      for (const b of balloons) {
        const dx = mx - b.x, dy = my - b.y
        if (dx * dx + dy * dy < b.r * b.r) {
          if (b.target) {
            spawnParticles(b.x, b.y, '#4f4')
            state = 'won'; endCounter = 0
          }
          break
        }
      }
    }

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      cursor.x = (e.clientX - rect.left) * (W / rect.width)
      cursor.y = (e.clientY - rect.top) * (H / rect.height)
    }

    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('mousemove', handleMove)

    function update() {
      if (state !== 'playing') return
      frame++
      speed = 1 + frame / 1200

      for (const b of balloons) {
        b.x += b.vx * speed
        b.y += b.vy * speed
        if (b.x - b.r < 0) { b.x = b.r; b.vx *= -1 }
        if (b.x + b.r > W) { b.x = W - b.r; b.vx *= -1 }
        if (b.y - b.r < 50) { b.y = 50 + b.r; b.vy *= -1 }
        if (b.y + b.r > H - 10) { b.y = H - 10 - b.r; b.vy *= -1 }
        if (Math.random() < 0.005) { b.vx += (Math.random() - 0.5) * 2; b.vy += (Math.random() - 0.5) * 2 }
        b.vx = Math.max(-3, Math.min(3, b.vx))
        b.vy = Math.max(-3, Math.min(3, b.vy))
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy
        p.life--
        if (p.life <= 0) particles.splice(i, 1)
      }
    }

    function draw() {
      ctx.fillStyle = '#0d0d2a'
      ctx.fillRect(0, 0, W, H)

      ctx.strokeStyle = 'rgba(80,186,64,0.04)'
      for (let i = 0; i < W; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke() }
      for (let i = 0; i < H; i += 30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke() }

      let hovered = null
      for (const b of balloons) {
        const dx = cursor.x - b.x, dy = cursor.y - b.y
        if (dx * dx + dy * dy < b.r * b.r) hovered = b
      }

      for (const b of balloons) {
        const isHover = b === hovered
        const isTarget = b.target

        if (isHover) {
          ctx.beginPath(); ctx.arc(b.x, b.y, b.r + 6, 0, Math.PI * 2)
          ctx.fillStyle = isTarget ? 'rgba(80,186,64,0.2)' : 'rgba(200,200,200,0.1)'
          ctx.fill()
        }

        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = '#1a1a2e'
        ctx.fill()
        ctx.strokeStyle = isTarget ? '#50BA40' : (isHover ? '#fff' : '#3a3a5c')
        ctx.lineWidth = isHover ? 3 : 2
        ctx.stroke()

        if (isTarget) {
          ctx.strokeStyle = 'rgba(80,186,64,0.15)'
          ctx.lineWidth = 1
          ctx.beginPath(); ctx.arc(b.x, b.y, b.r + 4, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.fillStyle = isHover ? '#fff' : '#ccc'
        ctx.font = 'bold 10px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const name = b.name.length > 8 ? b.name.slice(0, 7) + '.' : b.name
        ctx.fillText(name, b.x, b.y - 3)
      }

      for (const p of particles) {
        const alpha = p.life / p.maxLife
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * alpha, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalAlpha = 1

      ctx.fillStyle = '#50BA40'
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Selecciona: ' + target, W / 2, 24)
      ctx.fillStyle = '#9ca3af'
      ctx.font = '12px sans-serif'
      ctx.fillText('Haz clic sobre el banco que quieras', W / 2, 44)

      if (state === 'won') {
        ctx.fillStyle = '#50BA40'
        ctx.font = '28px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('✓ ' + target, W / 2, H / 2 - 10)
        ctx.fillStyle = '#fff'
        ctx.font = '14px sans-serif'
        ctx.fillText('Seleccionado correctamente', W / 2, H / 2 + 20)
      }
    }

    function loop() {
      if (!running) return
      update(); draw()
      if (state === 'playing') { animId = requestAnimationFrame(loop); return }
      endCounter++
      if (endCounter > 40) { running = false; onWinRef.current?.(target); return }
      animId = requestAnimationFrame(loop)
    }

    let animId, running = true
    animId = requestAnimationFrame(loop)
    return () => {
      running = false
      cancelAnimationFrame(animId)
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('mousemove', handleMove)
    }
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} className="game-canvas" style={{ cursor: 'pointer' }} />
      <div className="modal-controls">Haz clic en el banco que deseas seleccionar</div>
    </div>
  )
}
