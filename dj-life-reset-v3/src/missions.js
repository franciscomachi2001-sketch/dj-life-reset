// ─── REALISTIC MISSION PROGRESSION ───
// Difficulty grows fast early, then plateaus. High levels = mastery, not more hours.

export const XP_PER_LEVEL = 800
export const MAX_LEVEL = 200

export const CAT = {
  music:   { label: '🎛️ Producción & DJ', color: '#b48cff', dark: '#b48cff22' },
  food:    { label: '🥗 Alimentación',     color: '#00e5a0', dark: '#00e5a022' },
  fitness: { label: '💪 Actividad física',  color: '#ff4d8d', dark: '#ff4d8d22' },
  sleep:   { label: '😴 Sueño',            color: '#00d4ff', dark: '#00d4ff22' },
}

// Plateau helper: grows fast early, slows after `peak`, stops at `max`
function ramp(week, base, growthPerWeek, peakWeek, max) {
  const w = Math.min(week, peakWeek)
  return Math.min(max, base + w * growthPerWeek)
}

// ─── MUSIC MISSIONS ───
export function getMusicMissions(week) {
  const w = week
  const missions = []

  // Production study: 1h30 → peaks at 4h (week 40), stays 4h after
  const prodMins = Math.round(ramp(w, 90, 3.75, 40, 240))
  const ph = Math.floor(prodMins / 60), pm = prodMins % 60
  const prodStr = pm ? `${ph}h ${pm}min` : `${ph}h`

  let prodExtra = ''
  if (w >= 4)  prodExtra = ' + 1 demo track'
  if (w >= 10) prodExtra = ' + 1 track terminado/mes'
  if (w >= 20) prodExtra = ' + feedback de otro productor'
  if (w >= 35) prodExtra = ' + 1 release en plataformas/mes'
  if (w >= 60) prodExtra = ' + EP trimestral'
  if (w >= 100) prodExtra = ' + álbum anual'

  missions.push({
    id: 'm_prod', icon: '🎛️', cat: 'music', defaultActive: true,
    name: `Producción: ${prodStr} de estudio${prodExtra}`,
    meta: 'DAW · síntesis · arrangement · mezcla',
    xp: Math.round(ramp(w, 120, 2, 50, 320)),
  })

  // Mixing practice: 45min → peaks at 2h (week 30)
  const mixMins = Math.round(ramp(w, 45, 2.25, 30, 120))
  const mh = Math.floor(mixMins / 60), mm = mixMins % 60
  const mixStr = mm ? `${mh}h ${mm}min` : `${mh}h`

  let mixExtra = ''
  if (w >= 6)  mixExtra = ' + grabar set completo'
  if (w >= 18) mixExtra = ' + publicar set 1x/semana'
  if (w >= 40) mixExtra = ' + set en vivo mensual'
  if (w >= 70) mixExtra = ' + residencia / gigs regulares'

  missions.push({
    id: 'm_mix', icon: '🎧', cat: 'music', defaultActive: true,
    name: `Mezcla: ${mixStr} de práctica${mixExtra}`,
    meta: 'Técnica DJ · transiciones · lectura de pista',
    xp: Math.round(ramp(w, 90, 1.5, 40, 240)),
  })

  // Music theory: unlocked week 3, plateaus fast
  if (w >= 3) {
    const thMins = Math.round(ramp(w - 3, 20, 1.5, 20, 50))
    let thName = `Teoría musical: ${thMins} min`
    if (w >= 15) thName = 'Sound design: 30 min síntesis avanzada'
    if (w >= 30) thName = 'Composición: trabajar en un arreglo complejo'
    if (w >= 60) thName = 'Masterización: mejorar un track propio'
    missions.push({
      id: 'm_theory', icon: '🎵', cat: 'music', defaultActive: true,
      name: thName,
      meta: 'Conocimiento profundo del sonido',
      xp: Math.round(ramp(w, 60, 1, 40, 160)),
    })
  }

  // Networking / release: unlocked week 20
  if (w >= 20) {
    let netName = 'Conectar con 1 artista / colega esta semana'
    if (w >= 40) netName = 'Colaborar en 1 proyecto externo / mes'
    if (w >= 80) netName = 'Gestionar branding artístico (redes / prensa)'
    missions.push({
      id: 'm_net', icon: '🌐', cat: 'music', defaultActive: false,
      name: netName,
      meta: 'Red · visibilidad · carrera',
      xp: Math.round(ramp(w, 80, 0.8, 80, 200)),
    })
  }

  return missions
}

// ─── FOOD MISSIONS ───
export function getFoodMissions(week) {
  const w = week
  const missions = []

  // Gradual meal progression
  if (w <= 2) {
    missions.push({ id: 'f_main', icon: '🥗', cat: 'food', defaultActive: true, xp: 55,
      name: 'Merienda y cena saludables', meta: 'Sin ultraprocesados en esas 2 comidas' })
  } else if (w <= 4) {
    missions.push({ id: 'f_main', icon: '🥗', cat: 'food', defaultActive: true, xp: 65,
      name: 'Almuerzo + merienda + cena sanos', meta: '3 comidas limpias' })
  } else if (w <= 7) {
    missions.push({ id: 'f_main', icon: '🥗', cat: 'food', defaultActive: true, xp: 75,
      name: '4 comidas saludables todo el día', meta: 'Desayuno + almuerzo + merienda + cena' })
  } else if (w <= 14) {
    missions.push({ id: 'f_main', icon: '🥗', cat: 'food', defaultActive: true, xp: 82,
      name: 'Sin ultraprocesados todo el día', meta: 'Sin excepción. Agua como bebida principal' })
  } else if (w <= 25) {
    missions.push({ id: 'f_main', icon: '🥗', cat: 'food', defaultActive: true, xp: 88,
      name: 'Dieta limpia + 2.5L de agua', meta: 'Sin procesados · hidratación completa' })
    missions.push({ id: 'f_prep', icon: '🥦', cat: 'food', defaultActive: true, xp: 65,
      name: 'Preparar comidas del día (meal prep)', meta: 'Planificación · no improvisar' })
  } else {
    const mainXP = Math.round(ramp(w - 25, 92, 0.3, 50, 110))
    missions.push({ id: 'f_main', icon: '🥗', cat: 'food', defaultActive: true, xp: mainXP,
      name: 'Dieta anti-inflamatoria completa', meta: 'Omega 3 · fibra · sin azúcar · colores variados' })
    missions.push({ id: 'f_prep', icon: '🥦', cat: 'food', defaultActive: true, xp: 75,
      name: 'Meal prep semanal completo', meta: 'Toda la semana planificada de antemano' })
    if (w >= 40) missions.push({ id: 'f_supp', icon: '💊', cat: 'food', defaultActive: false, xp: 55,
      name: 'Suplementación inteligente', meta: 'Creatina · Omega 3 · Vitamina D · Magnesio' })
  }

  return missions
}

// ─── FITNESS MISSIONS ───
export function getFitnessMissions(week) {
  const w = week
  const missions = []

  // Gym frequency: 3x → 4x (week 7) → 5x (week 15). Duration: 60→90min (week 10), stays 90 after
  const gymDays = w <= 6 ? 3 : w <= 14 ? 4 : 5
  const gymMins = Math.round(ramp(w, 60, 1.5, 20, 90))
  const gh = Math.floor(gymMins / 60), gm = gymMins % 60
  const gymStr = gm ? `${gh}h ${gm}min` : `${gh}h`

  let gymExtra = ''
  if (w >= 8)  gymExtra = ' · registrar cargas'
  if (w >= 20) gymExtra = ' · progresión de fuerza documentada'
  if (w >= 40) gymExtra = ' · periodización consciente'

  missions.push({
    id: 'g_gym', icon: '🏋️', cat: 'fitness', defaultActive: true,
    name: `Gym ${gymDays}x/semana — ${gymStr} c/sesión${gymExtra}`,
    meta: 'Fuerza · hipertrofia · movilidad',
    xp: Math.round(ramp(w, 55, 1.2, 25, 120)),
  })

  // Cardio: unlocked week 3
  if (w >= 3) {
    const cardioMins = Math.round(ramp(w - 3, 20, 0.8, 35, 45))
    let cardioExtra = ''
    if (w >= 15) cardioExtra = ' · zona 2 (baja intensidad)'
    if (w >= 30) cardioExtra = ' · HIIT 1x/semana incluido'
    missions.push({
      id: 'g_cardio', icon: '🏃', cat: 'fitness', defaultActive: true,
      name: `Cardio ${cardioMins} min${cardioExtra}`,
      meta: 'Salud cardiovascular · energía para sesiones largas',
      xp: Math.round(ramp(w, 40, 0.8, 30, 80)),
    })
  }

  // Mobility: unlocked week 6
  if (w >= 6) {
    missions.push({
      id: 'g_mob', icon: '🧘', cat: 'fitness', defaultActive: true, xp: 38,
      name: 'Movilidad y stretching 15 min',
      meta: 'Prevención · recuperación · postura (importante en estudio)',
    })
  }

  // Sport variety: unlocked week 16
  if (w >= 16) {
    missions.push({
      id: 'g_sport', icon: '⚽', cat: 'fitness', defaultActive: false, xp: 55,
      name: 'Deporte recreativo o clase grupal',
      meta: 'Variedad · social · disfrute del movimiento',
    })
  }

  return missions
}

// ─── SLEEP MISSIONS ───
export function getSleepMissions(week) {
  const w = week
  const missions = []

  missions.push({ id: 's_sleep', icon: '😴', cat: 'sleep', defaultActive: true, xp: 48,
    name: 'Dormir 7-8 horas con horario fijo',
    meta: 'Consistencia · mismo horario todos los días' })

  if (w >= 4) missions.push({ id: 's_screen', icon: '📵', cat: 'sleep', defaultActive: true, xp: 38,
    name: 'Sin pantallas 1h antes de dormir',
    meta: 'Melatonina · calidad del sueño profundo' })

  if (w >= 10) missions.push({ id: 's_routine', icon: '🌙', cat: 'sleep', defaultActive: false, xp: 38,
    name: 'Rutina nocturna completa',
    meta: 'Lectura · temperatura fresca · sin alcohol' })

  if (w >= 20) missions.push({ id: 's_morning', icon: '🌅', cat: 'sleep', defaultActive: false, xp: 35,
    name: 'Levantarse sin alarma o con 1 sola',
    meta: 'Señal de que el sueño fue suficiente y reparador' })

  return missions
}

// ─── COMBINED ───
export function getWeekMissions(week) {
  const w = Math.max(1, Math.min(200, week))
  return [
    ...getMusicMissions(w),
    ...getFoodMissions(w),
    ...getFitnessMissions(w),
    ...getSleepMissions(w),
  ]
}

// ─── CHARACTER EVOLUTIONS (Doflamingo style) ───
export const EVOLUTIONS = [
  { lvl: 1,   name: 'El Principiante',    title: 'Nadie te conoce todavía.',          tier: 0 },
  { lvl: 8,   name: 'El Aprendiz',        title: 'Empezás a entender el juego.',       tier: 1 },
  { lvl: 18,  name: 'El Rebelde',         title: 'Rompés las reglas con intención.',   tier: 2 },
  { lvl: 30,  name: 'El Operador',        title: 'Movés hilos en las sombras.',        tier: 3 },
  { lvl: 45,  name: 'El Señor del Club',  title: 'Tu nombre abre puertas.',            tier: 4 },
  { lvl: 60,  name: 'El Capo',            title: 'El escenario es tuyo.',              tier: 5 },
  { lvl: 80,  name: 'La Leyenda Oscura',  title: 'Sos la razón por la que vienen.',   tier: 6 },
  { lvl: 110, name: 'El Inmortal',        title: 'Tu música sobrevivirá todo.',        tier: 7 },
  { lvl: 150, name: 'El Dios del Sonido', title: 'Creaste un universo propio.',        tier: 8 },
  { lvl: 200, name: 'Don Flamingo',       title: 'Fua fua fua... lo lograste.',        tier: 9 },
]

export function getEvolution(lvl) {
  let ev = EVOLUTIONS[0]
  for (const e of EVOLUTIONS) { if (lvl >= e.lvl) ev = e; else break }
  return ev
}

// ─── PENALTY SYSTEM ───
// Returns XP to deduct based on consecutive missed days
export function getPenalty(missedDays, currentXP) {
  if (missedDays <= 1) return 0           // 1 day grace
  if (missedDays === 2) return Math.round(currentXP * 0.03)  // -3%
  if (missedDays === 3) return Math.round(currentXP * 0.07)  // -7%
  if (missedDays === 4) return Math.round(currentXP * 0.12)  // -12%
  return Math.round(currentXP * 0.18)    // 5+ days: -18%
}
