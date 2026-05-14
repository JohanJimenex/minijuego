let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function play(type, freq = 440, dur = 0.15, vol = 0.3) {
  try {
    const c = getCtx()
    const o = c.createOscillator()
    const g = c.createGain()
    o.connect(g)
    g.connect(c.destination)
    o.type = type
    o.frequency.setValueAtTime(freq, c.currentTime)
    g.gain.setValueAtTime(vol, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
    o.start(c.currentTime)
    o.stop(c.currentTime + dur)
  } catch (e) { /* ignore */ }
}

function noise(dur = 0.1, vol = 0.2) {
  try {
    const c = getCtx()
    const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2)
    const s = c.createBufferSource()
    const g = c.createGain()
    s.buffer = buf
    s.connect(g)
    g.connect(c.destination)
    g.gain.setValueAtTime(vol, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
    s.start(c.currentTime)
  } catch (e) { /* ignore */ }
}

export function sfxClick() { play('sine', 600, 0.08, 0.15) }
export function sfxSelect() { play('sine', 880, 0.12, 0.2); setTimeout(() => play('sine', 1100, 0.1, 0.15), 60) }
export function sfxJump() { play('sine', 300, 0.15, 0.2); setTimeout(() => play('sine', 500, 0.1, 0.15), 30) }
export function sfxDiceHit() { play('square', 200, 0.1, 0.15); noise(0.05, 0.1) }
export function sfxCatch() { play('sine', 800, 0.08, 0.2); setTimeout(() => play('sine', 1200, 0.1, 0.2), 50) }
export function sfxShoot() { noise(0.08, 0.15); play('square', 150, 0.08, 0.1) }
export function sfxHit() { play('sawtooth', 150, 0.15, 0.25); noise(0.1, 0.2) }
export function sfxExplosion() { play('sawtooth', 80, 0.3, 0.3); noise(0.3, 0.25) }
export function sfxWin() {
  [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => play('sine', f, 0.2, 0.25), i * 100))
}
export function sfxLose() {
  [400, 350, 300, 200].forEach((f, i) => setTimeout(() => play('sawtooth', f, 0.2, 0.2), i * 120))
}

// Background music for minigames
let musicTimer = null

function musicTick(melody, wave, vol) {
  let i = 0
  return function tick() {
    const note = melody[i % melody.length]
    if (note[0] > 0) {
      play(wave, note[0] * 0.5, note[1] * 0.8, vol)
      if (i % 4 === 0) play('triangle', note[0], note[1] * 0.6, vol * 0.5)
    }
    i++
  }
}

const MELODY_CUENTA = [
  [330, 0.1], [392, 0.1], [440, 0.1], [392, 0.1],
  [330, 0.1], [262, 0.1], [330, 0.1], [392, 0.1],
  [440, 0.15], [392, 0.1], [330, 0.1], [262, 0.1],
  [294, 0.1], [330, 0.1], [349, 0.1], [392, 0.1],
  [523, 0.2], [0, 0.1], [440, 0.1], [392, 0.1],
  [349, 0.15], [330, 0.1], [262, 0.1], [294, 0.1],
  [330, 0.2], [0, 0.1], [262, 0.1], [330, 0.1],
  [392, 0.15], [523, 0.1], [392, 0.1], [330, 0.1],
]

const MELODY_BANCO = [
  [262, 0.2], [294, 0.15], [330, 0.2], [294, 0.15],
  [349, 0.25], [330, 0.2], [294, 0.15], [262, 0.2],
  [0, 0.15], [262, 0.15], [349, 0.2], [330, 0.15],
  [294, 0.25], [262, 0.2], [0, 0.15], [262, 0.15],
  [330, 0.2], [349, 0.15], [392, 0.2], [349, 0.15],
  [330, 0.25], [294, 0.2], [262, 0.15], [0, 0.15],
]

const MELODY_MONTO = [
  [392, 0.08], [440, 0.08], [494, 0.08], [523, 0.08],
  [494, 0.08], [440, 0.08], [392, 0.08], [349, 0.08],
  [392, 0.12], [349, 0.08], [330, 0.08], [262, 0.08],
  [330, 0.08], [392, 0.08], [440, 0.08], [494, 0.08],
  [523, 0.12], [494, 0.08], [440, 0.08], [392, 0.08],
  [440, 0.08], [523, 0.08], [587, 0.08], [659, 0.08],
  [587, 0.12], [523, 0.08], [440, 0.08], [392, 0.08],
  [330, 0.12], [392, 0.08], [330, 0.08], [262, 0.08],
]

const MELODY_JEFE = [
  [196, 0.25], [0, 0.15], [196, 0.15], [220, 0.2],
  [233, 0.25], [0, 0.15], [233, 0.15], [262, 0.2],
  [220, 0.2], [196, 0.15], [220, 0.2], [233, 0.15],
  [196, 0.3], [0, 0.2], [175, 0.15], [165, 0.15],
  [175, 0.2], [196, 0.15], [220, 0.2], [233, 0.15],
  [262, 0.3], [0, 0.15], [233, 0.15], [220, 0.15],
  [196, 0.3], [0, 0.2], [165, 0.15], [196, 0.15],
  [220, 0.25], [233, 0.15], [262, 0.25], [0, 0.15],
]

function startMusicTrack(melody, wave, interval, vol) {
  stopMusic()
  const tick = musicTick(melody, wave, vol)
  tick()
  musicTimer = setInterval(tick, interval)
}

export function startMusicCuenta() { startMusicTrack(MELODY_CUENTA, 'square', 140, 0.04) }
export function startMusicBanco() { startMusicTrack(MELODY_BANCO, 'sine', 220, 0.035) }
export function startMusicMonto() { startMusicTrack(MELODY_MONTO, 'square', 120, 0.04) }
export function startMusicJefe() { startMusicTrack(MELODY_JEFE, 'sawtooth', 200, 0.05) }

export function stopMusic() {
  if (musicTimer) { clearInterval(musicTimer); musicTimer = null }
}
