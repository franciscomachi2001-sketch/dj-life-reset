import { useEffect, useRef } from 'react'
import { getEvolution } from './missions'

function px(ctx, x, y, w, h) {
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}

function shade(hex, amt) {
  const r = Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) + amt))
  const g = Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) + amt))
  const b = Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) + amt))
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

export function drawDJChar(canvas, lvl, sc = 1) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height, cx = W / 2
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#080c14'; ctx.fillRect(0, 0, W, H)

  const ev = getEvolution(lvl)
  const skin = ev.skin

  // BG aura glow
  const lmap = {
    none: null, blue: 'rgba(0,195,255,0.12)', purple: 'rgba(155,89,255,0.14)',
    multi: 'rgba(0,229,160,0.12)', fire: 'rgba(255,80,20,0.15)',
    gold: 'rgba(240,165,0,0.14)', rainbow: 'rgba(0,195,255,0.12)', cosmic: 'rgba(155,89,255,0.22)'
  }
  const lc = lmap[ev.lights]
  if (lc) {
    const g = ctx.createRadialGradient(cx, H * .45, 8 * sc, cx, H * .45, 75 * sc)
    g.addColorStop(0, lc); g.addColorStop(1, 'transparent')
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
  }

  // Stage spotlights for high levels
  if (lvl >= 50) {
    const sc2 = ['rgba(0,195,255,0.07)', 'rgba(255,61,127,0.07)', 'rgba(155,89,255,0.07)']
    for (let i = 0; i < 3; i++) {
      ctx.save(); ctx.fillStyle = sc2[i % 3]
      ctx.beginPath()
      const sx = cx + (i - 1) * 28 * sc
      ctx.moveTo(sx, 0); ctx.lineTo(sx - 10 * sc, H * .65); ctx.lineTo(sx + 10 * sc, H * .65)
      ctx.closePath(); ctx.fill(); ctx.restore()
    }
  }

  const by = H * .13

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath()
  ctx.ellipse(cx, H * .89, 18 * sc, 5 * sc, 0, 0, Math.PI * 2); ctx.fill()

  // DJ DECKS / BOOTH
  if (ev.gear !== 'basic') {
    const dy = H * .71
    const dc = ev.gear === 'god' ? '#553388' : ev.gear === 'iconic' ? '#225566' : ev.gear === 'legend' ? '#663300' : '#1a2030'
    ctx.fillStyle = dc; px(ctx, cx - 32 * sc, dy, 64 * sc, 16 * sc)
    ctx.fillStyle = shade(dc, 22); px(ctx, cx - 30 * sc, dy + 2 * sc, 26 * sc, 12 * sc); px(ctx, cx + 4 * sc, dy + 2 * sc, 26 * sc, 12 * sc)
    // turntable circles
    ctx.strokeStyle = ev.gear === 'god' ? '#9b59ff' : ev.gear === 'legend' ? '#f0a500' : '#00c3ff'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.arc(cx - 17 * sc, dy + 8 * sc, 9 * sc, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.arc(cx + 17 * sc, dy + 8 * sc, 9 * sc, 0, Math.PI * 2); ctx.stroke()
    // mixer center
    ctx.fillStyle = '#0d1220'; px(ctx, cx - 6 * sc, dy, 12 * sc, 16 * sc)
    ctx.fillStyle = '#00c3ff'; px(ctx, cx - 4 * sc, dy + 3 * sc, 3 * sc, 3 * sc); px(ctx, cx + 1 * sc, dy + 3 * sc, 3 * sc, 3 * sc)
    ctx.fillStyle = '#ff3d7f'; px(ctx, cx - 4 * sc, dy + 8 * sc, 8 * sc, 2 * sc)
  }

  // LEGS
  const legC = lvl >= 100 ? '#220033' : lvl >= 50 ? '#1a1a3a' : '#0d1220'
  ctx.fillStyle = legC
  px(ctx, cx - 10 * sc, by + 53 * sc, 9 * sc, 22 * sc)
  px(ctx, cx + 1 * sc, by + 53 * sc, 9 * sc, 22 * sc)
  ctx.fillStyle = shade(legC, -15)
  px(ctx, cx - 10 * sc, by + 73 * sc, 10 * sc, 5 * sc)
  px(ctx, cx + 1 * sc, by + 73 * sc, 10 * sc, 5 * sc)

  // TORSO / JACKET
  const jMap = { basic: '#0a0a1a', decks: '#0a0a1a', booth: '#1a0a2a', stage: '#0d1a2a', mainstage: '#1a1a1a', legend: '#2a0033', iconic: '#1a0044', god: '#330066' }
  const jc = jMap[ev.gear] || '#0a0a1a'
  ctx.fillStyle = jc; px(ctx, cx - 12 * sc, by + 26 * sc, 24 * sc, 28 * sc)
  ctx.fillStyle = shade(jc, 30)
  px(ctx, cx - 10 * sc, by + 28 * sc, 4 * sc, 22 * sc)
  px(ctx, cx + 6 * sc, by + 28 * sc, 4 * sc, 22 * sc)
  // accent stripes
  const strC = ev.lights === 'gold' ? '#f0a500' : ev.lights === 'fire' ? '#ff3d7f' : (ev.lights === 'rainbow' || ev.lights === 'cosmic') ? '#9b59ff' : '#00c3ff'
  ctx.fillStyle = strC + '99'
  px(ctx, cx - 12 * sc, by + 26 * sc, 24 * sc, 2 * sc)
  px(ctx, cx - 12 * sc, by + 52 * sc, 24 * sc, 2 * sc)
  // headphone cable on neck
  ctx.fillStyle = '#222'
  px(ctx, cx - 13 * sc, by + 24 * sc, 3 * sc, 6 * sc)
  px(ctx, cx + 10 * sc, by + 24 * sc, 3 * sc, 6 * sc)

  // ARMS
  ctx.fillStyle = skin
  px(ctx, cx - 21 * sc, by + 26 * sc, 9 * sc, 20 * sc)
  px(ctx, cx + 12 * sc, by + 26 * sc, 9 * sc, 20 * sc)
  ctx.fillStyle = shade(skin, -20)
  px(ctx, cx - 21 * sc, by + 44 * sc, 9 * sc, 5 * sc)
  px(ctx, cx + 12 * sc, by + 44 * sc, 9 * sc, 5 * sc)

  // HEAD
  ctx.fillStyle = skin; px(ctx, cx - 10 * sc, by, 20 * sc, 23 * sc)
  ctx.fillStyle = shade(skin, -15)
  px(ctx, cx - 13 * sc, by + 8 * sc, 4 * sc, 8 * sc)
  px(ctx, cx + 9 * sc, by + 8 * sc, 4 * sc, 8 * sc)
  ctx.fillStyle = shade(skin, -30); px(ctx, cx - 5 * sc, by + 17 * sc, 10 * sc, 3 * sc)
  // eyes
  ctx.fillStyle = '#111'
  px(ctx, cx - 7 * sc, by + 8 * sc, 5 * sc, 5 * sc)
  px(ctx, cx + 2 * sc, by + 8 * sc, 5 * sc, 5 * sc)
  const eyeC = lvl >= 150 ? '#9b59ff' : lvl >= 100 ? '#ff3d7f' : '#00c3ff'
  ctx.fillStyle = eyeC
  px(ctx, cx - 6 * sc, by + 9 * sc, 3 * sc, 3 * sc)
  px(ctx, cx + 3 * sc, by + 9 * sc, 3 * sc, 3 * sc)

  // HEADPHONES
  const hpC = lvl >= 150 ? '#9b59ff' : lvl >= 100 ? '#f0a500' : lvl >= 50 ? '#ff3d7f' : '#00c3ff'
  ctx.fillStyle = '#1a1a2a'; px(ctx, cx - 12 * sc, by - 2 * sc, 24 * sc, 9 * sc)
  ctx.fillStyle = hpC
  ctx.beginPath(); ctx.arc(cx - 11 * sc, by + 6 * sc, 5 * sc, Math.PI, 0); ctx.fill()
  ctx.beginPath(); ctx.arc(cx + 11 * sc, by + 6 * sc, 5 * sc, Math.PI, 0); ctx.fill()
  ctx.fillStyle = '#1a1a2a'
  px(ctx, cx - 15 * sc, by + 3 * sc, 5 * sc, 8 * sc)
  px(ctx, cx + 10 * sc, by + 3 * sc, 5 * sc, 8 * sc)
  ctx.fillStyle = hpC
  px(ctx, cx - 15 * sc, by + 4 * sc, 3 * sc, 6 * sc)
  px(ctx, cx + 12 * sc, by + 4 * sc, 3 * sc, 6 * sc)

  // HAIR
  if (lvl >= 150) {
    ctx.fillStyle = '#9b59ff'
    px(ctx, cx - 10 * sc, by - 5 * sc, 20 * sc, 8 * sc)
    px(ctx, cx - 4 * sc, by - 8 * sc, 8 * sc, 5 * sc)
  } else if (lvl >= 75) {
    ctx.fillStyle = '#1a1a1a'; px(ctx, cx - 10 * sc, by - 3 * sc, 20 * sc, 6 * sc)
  } else {
    ctx.fillStyle = '#0a0a0a'; px(ctx, cx - 10 * sc, by - 2 * sc, 20 * sc, 5 * sc)
  }

  // Level badge
  ctx.fillStyle = 'rgba(0,195,255,0.18)'; ctx.fillRect(cx - 20, H - 19, 40, 15)
  ctx.fillStyle = '#00c3ff'
  ctx.font = `bold ${Math.round(6.5 * sc)}px Orbitron, monospace`
  ctx.textAlign = 'center'
  ctx.fillText('LVL ' + lvl, cx, H - 8)
}

export default function CharCanvas({ level, scale = 1, width = 64, height = 78, onClick, style }) {
  const ref = useRef(null)

  useEffect(() => {
    drawDJChar(ref.current, level, scale)
  }, [level, scale])

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      onClick={onClick}
      style={{
        borderRadius: 8,
        border: '1px solid #1e2d45',
        background: '#080c14',
        cursor: onClick ? 'pointer' : 'default',
        imageRendering: 'pixelated',
        ...style,
      }}
    />
  )
}
