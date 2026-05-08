import { useEffect, useRef } from 'react'
import { getEvolution } from './missions'

function px(ctx, x, y, w, h) { ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)) }
function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(Math.round(x), Math.round(y), r, 0, Math.PI * 2); ctx.fill() }
function sh(hex, a) {
  const r = Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) + a))
  const g = Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) + a))
  const b = Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) + a))
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

// Tier-based skin & style palette
const TIERS = [
  { skin: '#c9a87c', hair: '#1a1a1a', coat: null,      glasses: false, feathers: false, tattoo: false, threads: false, aura: null },
  { skin: '#c4a070', hair: '#111',    coat: '#1a1a2a',  glasses: false, feathers: false, tattoo: false, threads: false, aura: null },
  { skin: '#be9868', hair: '#0a0a0a', coat: '#0d0d1a',  glasses: true,  feathers: false, tattoo: false, threads: false, aura: null },
  { skin: '#b88f60', hair: '#050505', coat: '#110a1a',  glasses: true,  feathers: false, tattoo: true,  threads: false, aura: '#b48cff' },
  { skin: '#b28858', hair: '#050505', coat: '#150a20',  glasses: true,  feathers: true,  tattoo: true,  threads: false, aura: '#b48cff' },
  { skin: '#ac8050', hair: '#050505', coat: '#1a0a2a',  glasses: true,  feathers: true,  tattoo: true,  threads: true,  aura: '#ff4d8d' },
  { skin: '#a67848', hair: '#080508', coat: '#200830',  glasses: true,  feathers: true,  tattoo: true,  threads: true,  aura: '#ff4d8d' },
  { skin: '#a07040', hair: '#0a050a', coat: '#28063a',  glasses: true,  feathers: true,  tattoo: true,  threads: true,  aura: '#f5c542' },
  { skin: '#9a6838', hair: '#0a030a', coat: '#300550',  glasses: true,  feathers: true,  tattoo: true,  threads: true,  aura: '#f5c542' },
  { skin: '#9060ff', hair: '#3310aa', coat: '#3a006a',  glasses: true,  feathers: true,  tattoo: true,  threads: true,  aura: '#ffffff' },
]

function getTier(tier) { return TIERS[Math.min(tier, TIERS.length - 1)] }

export function drawChar(canvas, lvl, sc = 1) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height, cx = W / 2
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#07090f'; ctx.fillRect(0, 0, W, H)

  const ev = getEvolution(lvl)
  const t = getTier(ev.tier)
  const s = sc

  // ── AURA / atmosphere ──
  if (t.aura) {
    const gr = ctx.createRadialGradient(cx, H * 0.5, 5 * s, cx, H * 0.5, 90 * s)
    gr.addColorStop(0, t.aura + '22'); gr.addColorStop(1, 'transparent')
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H)
  }

  // ── SILK THREADS (Doflamingo power — high tiers) ──
  if (t.threads) {
    ctx.strokeStyle = t.aura + '55'; ctx.lineWidth = 1 * s
    const threadAngles = [15, 35, 160, 145, 80, 100]
    threadAngles.forEach(angle => {
      const rad = angle * Math.PI / 180
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(rad) * 5 * s, H * 0.35 + Math.sin(rad) * 5 * s)
      ctx.lineTo(cx + Math.cos(rad) * 70 * s, H * 0.35 + Math.sin(rad) * 70 * s)
      ctx.stroke()
    })
  }

  // ── SHADOW ──
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath()
  ctx.ellipse(cx, H * 0.92, 22 * s, 6 * s, 0, 0, Math.PI * 2); ctx.fill()

  const by = H * 0.1  // base Y of head

  // ── LONG COAT / OVERCOAT (Doflamingo style — worn on shoulders) ──
  if (t.coat) {
    // Coat draped over shoulders, flowing down
    const coatColor = t.coat
    ctx.fillStyle = coatColor
    // Left coat panel
    ctx.beginPath()
    ctx.moveTo(cx - 14 * s, by + 30 * s)
    ctx.lineTo(cx - 28 * s, by + 35 * s)
    ctx.lineTo(cx - 32 * s, H * 0.88)
    ctx.lineTo(cx - 6 * s, by + 58 * s)
    ctx.closePath(); ctx.fill()
    // Right coat panel
    ctx.beginPath()
    ctx.moveTo(cx + 14 * s, by + 30 * s)
    ctx.lineTo(cx + 28 * s, by + 35 * s)
    ctx.lineTo(cx + 32 * s, H * 0.88)
    ctx.lineTo(cx + 6 * s, by + 58 * s)
    ctx.closePath(); ctx.fill()
    // Coat inner lining (lighter)
    ctx.fillStyle = sh(coatColor, 25)
    ctx.beginPath()
    ctx.moveTo(cx - 6 * s, by + 58 * s)
    ctx.lineTo(cx - 14 * s, H * 0.88)
    ctx.lineTo(cx + 14 * s, H * 0.88)
    ctx.lineTo(cx + 6 * s, by + 58 * s)
    ctx.closePath(); ctx.fill()
  }

  // ── LEGS ──
  const legColor = lvl >= 80 ? '#1a0828' : lvl >= 40 ? '#12101e' : '#0e0c1a'
  ctx.fillStyle = legColor
  px(ctx, cx - 11 * s, by + 58 * s, 10 * s, 26 * s)
  px(ctx, cx + 1 * s, by + 58 * s, 10 * s, 26 * s)
  // Shoes
  ctx.fillStyle = sh(legColor, -10)
  px(ctx, cx - 13 * s, by + 82 * s, 13 * s, 5 * s)
  px(ctx, cx + 0 * s, by + 82 * s, 13 * s, 5 * s)

  // ── TORSO / SHIRT ──
  let shirtColor
  if (ev.tier >= 9)       shirtColor = '#2a0050'
  else if (ev.tier >= 7)  shirtColor = '#1e0038'
  else if (ev.tier >= 5)  shirtColor = '#200830'
  else if (ev.tier >= 3)  shirtColor = '#0d0820'
  else if (ev.tier >= 1)  shirtColor = '#0d0d1a'
  else                    shirtColor = '#1a1a2a'

  ctx.fillStyle = shirtColor
  px(ctx, cx - 13 * s, by + 30 * s, 26 * s, 30 * s)

  // Collar / V-neck open (Doflamingo style)
  ctx.fillStyle = t.skin
  ctx.beginPath()
  ctx.moveTo(cx - 3 * s, by + 30 * s)
  ctx.lineTo(cx, by + 42 * s)
  ctx.lineTo(cx + 3 * s, by + 30 * s)
  ctx.closePath(); ctx.fill()

  // Belt / waist detail
  if (ev.tier >= 2) {
    ctx.fillStyle = sh(shirtColor, 30)
    px(ctx, cx - 13 * s, by + 56 * s, 26 * s, 3 * s)
    ctx.fillStyle = '#f5c54288'
    px(ctx, cx - 3 * s, by + 57 * s, 6 * s, 2 * s)
  }

  // ── ARMS ──
  ctx.fillStyle = shirtColor
  px(ctx, cx - 22 * s, by + 30 * s, 9 * s, 22 * s)
  px(ctx, cx + 13 * s, by + 30 * s, 9 * s, 22 * s)
  ctx.fillStyle = t.skin
  px(ctx, cx - 22 * s, by + 50 * s, 9 * s, 6 * s)
  px(ctx, cx + 13 * s, by + 50 * s, 9 * s, 6 * s)

  // ── TATTOO on chest (tier 3+) ──
  if (t.tattoo) {
    ctx.fillStyle = '#b48cff66'
    // Simple cross/star tattoo pattern
    px(ctx, cx - 1 * s, by + 34 * s, 2 * s, 8 * s)
    px(ctx, cx - 4 * s, by + 37 * s, 8 * s, 2 * s)
  }

  // ── NECK ──
  ctx.fillStyle = t.skin
  px(ctx, cx - 4 * s, by + 23 * s, 8 * s, 8 * s)

  // ── HEAD ──
  ctx.fillStyle = t.skin
  // Main head shape (slightly wider jaw - Doflamingo style)
  ctx.beginPath()
  ctx.ellipse(cx, by + 14 * s, 11 * s, 13 * s, 0, 0, Math.PI * 2); ctx.fill()
  // Slight jaw emphasis
  ctx.fillStyle = sh(t.skin, -8)
  px(ctx, cx - 10 * s, by + 18 * s, 20 * s, 6 * s)
  ctx.fillStyle = t.skin
  px(ctx, cx - 9 * s, by + 18 * s, 18 * s, 5 * s)

  // ── SMILE / MOUTH (Doflamingo's iconic wide grin) ──
  if (ev.tier >= 2) {
    ctx.fillStyle = sh(t.skin, -35)
    ctx.beginPath()
    ctx.arc(cx, by + 19 * s, 6 * s, 0.1, Math.PI - 0.1); ctx.fill()
    ctx.fillStyle = t.skin
    ctx.beginPath()
    ctx.arc(cx, by + 17 * s, 5.5 * s, 0, Math.PI); ctx.fill()
    // Teeth
    ctx.fillStyle = '#f0f0f0'
    px(ctx, cx - 4 * s, by + 18 * s, 8 * s, 2 * s)
  } else {
    ctx.fillStyle = sh(t.skin, -30)
    px(ctx, cx - 4 * s, by + 19 * s, 8 * s, 2 * s)
  }

  // ── EYES ──
  ctx.fillStyle = '#111'
  px(ctx, cx - 7 * s, by + 11 * s, 5 * s, 4 * s)
  px(ctx, cx + 2 * s, by + 11 * s, 5 * s, 4 * s)
  // Eyebrow slant (menacing)
  ctx.fillStyle = t.hair === '#3310aa' ? '#6622dd' : sh(t.skin, -60)
  ctx.save()
  ctx.translate(cx - 5 * s, by + 9 * s); ctx.rotate(-0.3)
  px(ctx, 0, 0, 6 * s, 1.5 * s); ctx.restore()
  ctx.save()
  ctx.translate(cx + 4 * s, by + 9 * s); ctx.rotate(0.3)
  px(ctx, 0, 0, 6 * s, 1.5 * s); ctx.restore()

  // Eye color / glow (higher tiers)
  const eyeC = ev.tier >= 9 ? '#ffffff' : ev.tier >= 7 ? '#f5c542' : ev.tier >= 5 ? '#ff4d8d' : ev.tier >= 3 ? '#b48cff' : '#00d4ff'
  ctx.fillStyle = eyeC
  px(ctx, cx - 6 * s, by + 12 * s, 3 * s, 2 * s)
  px(ctx, cx + 3 * s, by + 12 * s, 3 * s, 2 * s)

  // ── GLASSES (Doflamingo's iconic round pink/rose tinted) ──
  if (t.glasses) {
    const glassC = ev.tier >= 9 ? '#ffffff' : ev.tier >= 7 ? '#f5c542' : ev.tier >= 5 ? '#ff4d8d' : '#ff8fbf'
    ctx.strokeStyle = glassC; ctx.lineWidth = 1.2 * s; ctx.fillStyle = glassC + '33'
    // Left lens
    ctx.beginPath(); ctx.arc(cx - 5 * s, by + 12 * s, 4.5 * s, 0, Math.PI * 2)
    ctx.fill(); ctx.stroke()
    // Right lens
    ctx.beginPath(); ctx.arc(cx + 5 * s, by + 12 * s, 4.5 * s, 0, Math.PI * 2)
    ctx.fill(); ctx.stroke()
    // Bridge
    ctx.beginPath(); ctx.moveTo(cx - 0.5 * s, by + 12 * s); ctx.lineTo(cx + 0.5 * s, by + 12 * s); ctx.stroke()
    // Arms
    ctx.beginPath(); ctx.moveTo(cx - 9.5 * s, by + 12 * s); ctx.lineTo(cx - 13 * s, by + 10 * s); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx + 9.5 * s, by + 12 * s); ctx.lineTo(cx + 13 * s, by + 10 * s); ctx.stroke()
  }

  // ── HAIR (slicked back, Doflamingo style - sparse/bald-ish at top) ──
  ctx.fillStyle = t.hair
  if (ev.tier >= 9) {
    // Wild purple hair
    px(ctx, cx - 10 * s, by - 6 * s, 20 * s, 10 * s)
    px(ctx, cx - 5 * s, by - 10 * s, 10 * s, 6 * s)
    px(ctx, cx - 2 * s, by - 14 * s, 4 * s, 6 * s)
  } else if (ev.tier >= 5) {
    // Very slicked back, almost shaved sides
    px(ctx, cx - 8 * s, by - 2 * s, 16 * s, 5 * s)
  } else if (ev.tier >= 2) {
    // Short, neat
    px(ctx, cx - 10 * s, by - 1 * s, 20 * s, 5 * s)
    px(ctx, cx - 8 * s, by + 2 * s, 4 * s, 4 * s)
    px(ctx, cx + 4 * s, by + 2 * s, 4 * s, 4 * s)
  } else {
    px(ctx, cx - 10 * s, by, 20 * s, 6 * s)
  }

  // ── FEATHER BOA collar (Doflamingo tier 4+) ──
  if (t.feathers) {
    const fColor = ev.tier >= 9 ? '#ffffff' : ev.tier >= 7 ? '#f5d0e8' : '#fce4ec'
    ctx.fillStyle = fColor
    for (let i = -5; i <= 5; i++) {
      const fx = cx + i * 3 * s
      const fy = by + 27 * s
      const fh = (3 + Math.abs(i % 2) * 2) * s
      px(ctx, fx - 1 * s, fy, 2 * s, fh)
    }
  }

  // ── DJ BOOTH / DECKS (higher tiers) ──
  if (ev.tier >= 2) {
    const dy = H * 0.88
    const dw = ev.tier >= 6 ? 60 * s : 50 * s
    const dc = ev.tier >= 7 ? '#2a0050' : ev.tier >= 4 ? '#150828' : '#0d1020'
    ctx.fillStyle = dc; px(ctx, cx - dw / 2, dy - 14 * s, dw, 14 * s)
    ctx.fillStyle = sh(dc, 20)
    px(ctx, cx - dw / 2 + 2 * s, dy - 12 * s, dw / 2 - 4 * s, 10 * s)
    px(ctx, cx + 2 * s, dy - 12 * s, dw / 2 - 4 * s, 10 * s)
    // Turntables
    const tColor = ev.tier >= 6 ? '#b48cff' : ev.tier >= 4 ? '#ff4d8d' : '#00d4ff'
    ctx.strokeStyle = tColor; ctx.lineWidth = 1
    ctx.beginPath(); ctx.arc(cx - dw / 4, dy - 7 * s, 6 * s, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.arc(cx + dw / 4, dy - 7 * s, 6 * s, 0, Math.PI * 2); ctx.stroke()
    // Mixer LEDs
    ctx.fillStyle = tColor + 'cc'
    for (let i = 0; i < 4; i++) px(ctx, cx - 3 * s + i * 2 * s, dy - 10 * s, 1.5 * s, 2 * s)
  }

  // ── HEADPHONES ──
  const hpC = ev.tier >= 9 ? '#ffffff' : ev.tier >= 7 ? '#f5c542' : ev.tier >= 5 ? '#ff4d8d' : ev.tier >= 3 ? '#b48cff' : '#00d4ff'
  // Only show headphones on neck/collar area (DJ style around neck)
  if (ev.tier >= 1) {
    ctx.fillStyle = '#1a1a2a'
    px(ctx, cx - 12 * s, by + 24 * s, 3 * s, 6 * s)
    px(ctx, cx + 9 * s, by + 24 * s, 3 * s, 6 * s)
    ctx.fillStyle = hpC
    px(ctx, cx - 13 * s, by + 25 * s, 2 * s, 4 * s)
    px(ctx, cx + 11 * s, by + 25 * s, 2 * s, 4 * s)
  } else {
    // Tier 0: wearing headphones on ears
    ctx.fillStyle = '#1a1a2a'; px(ctx, cx - 12 * s, by, 24 * s, 8 * s)
    ctx.fillStyle = hpC
    ctx.beginPath(); ctx.arc(cx - 11 * s, by + 6 * s, 5 * s, Math.PI, 0); ctx.fill()
    ctx.beginPath(); ctx.arc(cx + 11 * s, by + 6 * s, 5 * s, Math.PI, 0); ctx.fill()
    ctx.fillStyle = '#111'; px(ctx, cx - 14 * s, by + 3 * s, 4 * s, 7 * s); px(ctx, cx + 10 * s, by + 3 * s, 4 * s, 7 * s)
    ctx.fillStyle = hpC; px(ctx, cx - 14 * s, by + 4 * s, 3 * s, 5 * s); px(ctx, cx + 11 * s, by + 4 * s, 3 * s, 5 * s)
  }

  // ── LEVEL BADGE ──
  ctx.fillStyle = 'rgba(180,140,255,0.18)'; ctx.fillRect(cx - 22, H - 19, 44, 15)
  ctx.fillStyle = '#b48cff'
  ctx.font = `bold ${Math.round(6.5 * s)}px Cinzel, serif`
  ctx.textAlign = 'center'; ctx.fillText('LVL ' + lvl, cx, H - 8)
}

export default function CharCanvas({ level, scale = 1, width = 72, height = 88, onClick, style }) {
  const ref = useRef(null)
  useEffect(() => { drawChar(ref.current, level, scale) }, [level, scale])
  return (
    <canvas ref={ref} width={width} height={height} onClick={onClick}
      style={{ borderRadius: 8, border: '1px solid #1c2535', background: '#07090f', cursor: onClick ? 'pointer' : 'default', imageRendering: 'pixelated', ...style }} />
  )
}
