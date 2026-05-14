import { useEffect, useRef } from 'react'

const W = 700, H = 450

export default function MiniGameJefe({ onWin, onLose }) {
  const canvasRef = useRef(null)
  const onWinRef = useRef(onWin)
  const onLoseRef = useRef(onLose)
  onWinRef.current = onWin
  onLoseRef.current = onLose

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = W; canvas.height = H

    const keys = {}
    let animId, running = true
    const p = { x: W / 2 - 25, y: H - 55, w: 50, h: 35 }
    const bullets = [], bossBullets = []
    let bossHP = 20, bossMaxHP = 20, bossShootTimer = 0, playerHP = 3
    let frame = 0, state = 'playing', endCounter = 0
    let bossFlash = 0, playerFlash = 0, playerInvincible = 0
    let shakeX = 0, shakeY = 0
    let redOverlay = 0
    const particles = [], hitSparks = []
    let bossShake = 0

    function spawnParticles(x, y, color, count = 15, spread = 4) {
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2
        const sp = 1 + Math.random() * spread
        particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 25 + Math.random() * 15, maxLife: 40, color, r: 1.5 + Math.random() * 3 })
      }
    }

    function spawnHitSpark(x, y) {
      for (let i = 0; i < 6; i++) {
        const a = Math.random() * Math.PI * 2
        hitSparks.push({ x, y, vx: Math.cos(a) * 5, vy: Math.sin(a) * 5, life: 8, maxLife: 8 })
      }
    }

    const kd = e => {
      keys[e.key] = true
      if ((e.key === ' ' || e.key === 'Space') && state === 'playing') {
        e.preventDefault()
        bullets.push({ x: p.x + p.w / 2 - 3, y: p.y - 10, w: 6, h: 12 })
      }
    }
    const ku = e => keys[e.key] = false
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku)

    function update() {
      if (state !== 'playing') return
      frame++
      if (keys['ArrowLeft'] || keys['a']) p.x = Math.max(0, p.x - 5)
      if (keys['ArrowRight'] || keys['d']) p.x = Math.min(W - p.w, p.x + 5)

      for (let i = bullets.length - 1; i >= 0; i--) { bullets[i].y -= 9; if (bullets[i].y < 0) bullets.splice(i, 1) }
      for (let i = bossBullets.length - 1; i >= 0; i--) { bossBullets[i].y += 4 + bossBullets[i].aim * 0.5; if (bossBullets[i].y > H) bossBullets.splice(i, 1) }

      bossShootTimer++
      const shootInterval = Math.max(20, 45 - (bossMaxHP - bossHP) * 0.8)
      if (bossShootTimer >= shootInterval) {
        bossShootTimer = 0
        const pattern = frame % 3
        if (pattern === 0) {
          const bx = 60 + Math.random() * (W - 200)
          bossBullets.push({ x: bx, y: 100, w: 10, h: 10, aim: 0 })
        } else if (pattern === 1) {
          for (let i = 0; i < 3; i++) {
            bossBullets.push({ x: 100 + i * 250, y: 100, w: 8, h: 8, aim: 0.5 })
          }
        } else {
          bossBullets.push({ x: 70, y: 100, w: 8, h: 8, aim: 1 })
          bossBullets.push({ x: W - 70, y: 100, w: 8, h: 8, aim: 1 })
        }
      }

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i]
        if (b.x < 140 && b.x + b.w > 60 && b.y < 120 && b.y + b.h > 60) {
          bullets.splice(i, 1)
          bossHP--
          bossFlash = 6
          bossShake = 8
          spawnParticles(100 + Math.random() * (W - 200), 80, '#ff0', 10, 3)
          spawnHitSpark(100 + Math.random() * (W - 200), 80)
          if (bossHP <= 0) { state = 'won'; endCounter = 0; spawnParticles(W / 2, 90, '#fa0', 50, 8) }
          continue
        }
      }

      if (playerInvincible > 0) playerInvincible--

      for (let i = bossBullets.length - 1; i >= 0; i--) {
        const bb = bossBullets[i]
        if (playerInvincible <= 0 && bb.x < p.x + p.w && bb.x + bb.w > p.x && bb.y < p.y + p.h && bb.y + bb.h > p.y) {
          bossBullets.splice(i, 1)
          playerHP--
          playerFlash = 10
          playerInvincible = 60
          shakeX = 10; shakeY = 10
          redOverlay = 8
          spawnParticles(p.x + p.w / 2, p.y + p.h / 2, '#0ff', 8, 2)
          if (playerHP <= 0) { state = 'lost'; endCounter = 0 }
          continue
        }
      }

      if (bossFlash > 0) bossFlash--
      if (playerFlash > 0) {
        playerFlash--
        p.y = H - 55 + (playerFlash % 2 === 0 ? 0 : 3)
      }
      if (bossShake > 0) bossShake *= 0.8
      if (bossShake < 0.3) bossShake = 0
      if (shakeX > 0) shakeX *= 0.8
      if (shakeY > 0) shakeY *= 0.8
      if (shakeX < 0.3) shakeX = 0
      if (shakeY < 0.3) shakeY = 0
      if (redOverlay > 0) redOverlay--

      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i]; pt.x += pt.vx; pt.y += pt.vy; pt.life--
        if (pt.life <= 0) particles.splice(i, 1)
      }
      for (let i = hitSparks.length - 1; i >= 0; i--) {
        const s = hitSparks[i]; s.x += s.vx; s.y += s.vy; s.life--
        if (s.life <= 0) hitSparks.splice(i, 1)
      }
    }

    function draw() {
      ctx.fillStyle = '#0a0a1a'
      ctx.fillRect(0, 0, W, H)

      ctx.save()
      const sx = shakeX > 0.5 ? (Math.random() - 0.5) * shakeX : 0
      const sy = shakeY > 0.5 ? (Math.random() - 0.5) * shakeY : 0
      ctx.translate(sx, sy)

      ctx.strokeStyle = 'rgba(255,100,0,0.04)'
      for (let i = 0; i < W; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke() }
      for (let i = 0; i < H; i += 30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke() }

      const bossColor = bossFlash > 0 ? '#fff' : (bossHP < bossMaxHP * 0.3 ? '#f44' : '#fa0')
      const bossStroke = bossFlash > 0 ? '#fff' : '#f80'
      const bossOffX = bossShake > 1 ? (Math.random() - 0.5) * bossShake : 0

      ctx.fillStyle = bossColor
      ctx.strokeStyle = bossStroke
      ctx.lineWidth = 3
      ctx.fillRect(60 + bossOffX, 60, W - 120, 60)
      ctx.strokeRect(60 + bossOffX, 60, W - 120, 60)

      ctx.fillStyle = '#630'
      ctx.beginPath(); ctx.arc(W / 2 + bossOffX, 90, 18, 0, Math.PI * 2); ctx.fill()

      if (bossFlash > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.fillRect(63 + bossOffX, 63, W - 126, 54)
      }

      const hpPct = bossHP / bossMaxHP
      ctx.fillStyle = '#222'
      ctx.fillRect(100, 130, W - 200, 10)
      ctx.fillStyle = hpPct > 0.5 ? '#4f4' : (hpPct > 0.25 ? '#ff0' : '#f44')
      ctx.fillRect(100, 130, (W - 200) * hpPct, 10)
      ctx.strokeStyle = '#555'
      ctx.lineWidth = 1
      ctx.strokeRect(100, 130, W - 200, 10)

      for (let i = 0; i < bossMaxHP; i++) {
        const segX = 100 + (W - 200) * (i / bossMaxHP)
        ctx.strokeStyle = 'rgba(0,0,0,0.3)'
        ctx.beginPath(); ctx.moveTo(segX, 130); ctx.lineTo(segX, 140); ctx.stroke()
      }

      const pFlash = playerFlash > 0 && playerFlash % 4 < 2
      if (!pFlash) {
        ctx.fillStyle = '#0ff'
        ctx.beginPath()
        ctx.moveTo(p.x + p.w / 2, p.y)
        ctx.lineTo(p.x, p.y + p.h)
        ctx.lineTo(p.x + p.w, p.y + p.h)
        ctx.closePath(); ctx.fill()

        ctx.fillStyle = 'rgba(0,255,255,0.3)'
        ctx.beginPath(); ctx.arc(p.x + p.w / 2, p.y + p.h / 2, 12, 0, Math.PI * 2); ctx.fill()
      }

      ctx.fillStyle = '#ff0'
      for (const b of bullets) ctx.fillRect(b.x, b.y, b.w, b.h)

      for (const bb of bossBullets) {
        ctx.fillStyle = '#f44'
        ctx.shadowColor = '#f44'
        ctx.shadowBlur = 10
        ctx.beginPath(); ctx.arc(bb.x + bb.w / 2, bb.y + bb.h / 2, 6, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur = 0
      }

      for (const p of particles) {
        const alpha = p.life / p.maxLife
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * alpha, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalAlpha = 1

      for (const s of hitSparks) {
        const alpha = s.life / s.maxLife
        ctx.globalAlpha = alpha
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 2, s.y - s.vy * 2); ctx.stroke()
      }
      ctx.globalAlpha = 1

      ctx.restore()

      if (redOverlay > 0) {
        ctx.fillStyle = `rgba(255,0,0,${redOverlay / 10})`
        ctx.fillRect(0, 0, W, H)
      }

      ctx.fillStyle = '#0f0'
      ctx.font = '10px monospace'
      ctx.textAlign = 'left'
      ctx.fillText('♥ '.repeat(playerHP) + '♡'.repeat(3 - playerHP), 10, 20)

      ctx.fillStyle = '#fff'
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('BÓVEDA BANCARIA', W / 2, 48)
      ctx.fillStyle = '#fa0'
      ctx.font = '9px monospace'
      ctx.fillText('HP: ' + bossHP + '/' + bossMaxHP, W / 2, 153)

      if (bossHP < bossMaxHP * 0.5) {
        ctx.fillStyle = '#f44'
        ctx.font = '8px monospace'
        ctx.textAlign = 'center'
        const warn = '⚠ SISTEMA DE SEGURIDAD ACTIVADO ⚠'
        ctx.fillText(warn, W / 2, 168)
      }

      if (state === 'won') {
        ctx.fillStyle = '#4f4'
        ctx.font = '26px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('✓ BÓVEDA ABIERTA!', W / 2, H / 2 - 10)
        ctx.fillStyle = '#ff0'
        ctx.font = '12px monospace'
        ctx.fillText('TRANSFERENCIA AUTORIZADA', W / 2, H / 2 + 25)
      }
      if (state === 'lost') {
        ctx.fillStyle = '#f44'
        ctx.font = '24px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('✗ SISTEMA BLOQUEADO', W / 2, H / 2 - 10)
        ctx.fillStyle = '#f88'
        ctx.font = '11px monospace'
        ctx.fillText('INTENTA DE NUEVO', W / 2, H / 2 + 25)
      }
    }

    function loop() {
      if (!running) return
      update(); draw()
      if (state === 'playing') { animId = requestAnimationFrame(loop); return }
      endCounter++
      if (endCounter > 50) { running = false; state === 'won' ? onWinRef.current?.() : onLoseRef.current?.(); return }
      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => { running = false; cancelAnimationFrame(animId); window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku) }
  }, [])

  return (
    <div>
      <canvas ref={canvasRef} className="game-canvas" />
      <div className="game-controls">← → MOVER | ESPACIO: DISPARAR | DESTRUYE LA BÓVEDA</div>
    </div>
  )
}
