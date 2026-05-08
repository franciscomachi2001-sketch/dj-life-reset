// ─── MISSION PROGRESSION ENGINE ───
// Each week generates missions based on the current level (week number)

export function getMusicMissions(week) {
  const w = week
  const missions = []

  // PRODUCTION: starts 2h, +15min every 2 weeks
  const prodMins = 120 + Math.floor((w - 1) / 2) * 15
  const h = Math.floor(prodMins / 60), m = prodMins % 60
  const timeStr = m ? `${h}h ${m}min` : `${h}h`
  let extra = ''
  if (w >= 3)  extra = ' + 1 track'
  if (w >= 8)  extra = ' + 2 tracks'
  if (w >= 16) extra = ' + 1 EP (3 tracks)'
  if (w >= 30) extra = ' + remix'
  if (w >= 50) extra = ' + 1 release'
  if (w >= 80) extra = ' + 2 releases/mes'
  missions.push({
    id: 'm_prod', icon: '🎛️', cat: 'music',
    name: `Estudiar producción ${timeStr}${extra}`,
    meta: 'DAW / teoría / sound design',
    xp: Math.min(400, 130 + Math.floor((w - 1) / 2) * 8),
  })

  // MIXING: starts 1h, +10min every 3 weeks
  const mixMins = 60 + Math.floor((w - 1) / 3) * 10
  const mh = Math.floor(mixMins / 60), mm = mixMins % 60
  const mixStr = mm ? `${mh}h ${mm}min` : `${mh}h`
  let mixExtra = ''
  if (w >= 5)  mixExtra = ' + grabar set'
  if (w >= 15) mixExtra = ' + set de 1h publicado'
  if (w >= 30) mixExtra = ' + set de 2h'
  if (w >= 50) mixExtra = ' + live set'
  missions.push({
    id: 'm_mix', icon: '🎧', cat: 'music',
    name: `Práctica de mezcla ${mixStr}${mixExtra}`,
    meta: 'Técnica DJ / transiciones',
    xp: Math.min(300, 100 + Math.floor((w - 1) / 3) * 6),
  })

  // EXTRA music missions unlocked progressively
  if (w >= 6) {
    let name = '', meta = '', xp = 80
    if (w < 15)      { name = 'Analizar 2 tracks de referencia'; meta = 'EQ / estructura / arrangement'; xp = 80 }
    else if (w < 30) { name = 'Sound design: 5 samples originales'; meta = 'Síntesis / sampleo'; xp = 100 }
    else if (w < 50) { name = 'Masterizar 1 track propio'; meta = 'Loudness / dinámica'; xp = 120 }
    else if (w < 80) { name = 'Colaborar con otro productor'; meta = 'Red / feedback'; xp = 150 }
    else if (w < 120){ name = 'Publicar contenido musical'; meta = 'Redes / branding artístico'; xp = 160 }
    else             { name = 'Desarrollar tu identidad sonora'; meta = 'Firma / estilo único'; xp = 180 }
    missions.push({ id: 'm_extra', icon: '🎵', cat: 'music', name, meta, xp })
  }

  return missions
}

export function getFoodMissions(week) {
  const w = week
  const missions = []

  if (w <= 2) {
    missions.push({ id: 'f_main', icon: '🥗', cat: 'food', xp: 60,
      name: 'Merienda y cena saludable', meta: 'Sin ultraprocesados en esas comidas' })
  } else if (w <= 4) {
    missions.push({ id: 'f_main', icon: '🥗', cat: 'food', xp: 70,
      name: 'Almuerzo, merienda y cena sana', meta: '3 comidas limpias' })
  } else if (w <= 6) {
    missions.push({ id: 'f_main', icon: '🥗', cat: 'food', xp: 80,
      name: 'Las 4 comidas saludables', meta: 'Desayuno + almuerzo + merienda + cena' })
  } else if (w <= 11) {
    missions.push({ id: 'f_main', icon: '🥗', cat: 'food', xp: 85,
      name: 'Sin ultraprocesados todo el día', meta: 'Ninguna excepción' })
  } else if (w <= 19) {
    missions.push({ id: 'f_main', icon: '🥗', cat: 'food', xp: 90,
      name: 'Sin ultraprocesados + 2L de agua', meta: 'Alimentación limpia completa' })
    missions.push({ id: 'f_prep', icon: '🥦', cat: 'food', xp: 70,
      name: 'Meal prep del día', meta: 'Planificación nutricional' })
  } else {
    missions.push({ id: 'f_main', icon: '🥗', cat: 'food', xp: 100,
      name: 'Dieta anti-inflamatoria', meta: 'Omega 3 / verduras / sin azúcar' })
    missions.push({ id: 'f_prep', icon: '🥦', cat: 'food', xp: 80,
      name: 'Meal prep semanal', meta: 'Planificar toda la semana' })
    if (w >= 30) missions.push({ id: 'f_supp', icon: '💊', cat: 'food', xp: 60,
      name: 'Suplementación correcta', meta: 'Proteína / vitaminas / minerales' })
  }

  return missions
}

export function getFitnessMissions(week) {
  const w = week
  const missions = []

  const gymDays = w <= 2 ? 3 : w <= 6 ? 3 : w <= 12 ? 4 : 5
  const gymMins = w <= 2 ? 60 : w <= 5 ? 75 : w <= 10 ? 90 : w <= 20 ? 90 : 105
  const gh = Math.floor(gymMins / 60), gm = gymMins % 60
  const gymStr = gm ? `${gh}h ${gm}min` : `${gh}h`
  const gymXP = Math.min(150, 55 + Math.floor((w - 1) / 3) * 5)

  missions.push({ id: 'g_gym', icon: '🏋️', cat: 'fitness', xp: gymXP,
    name: `Gym ${gymDays}x/semana — ${gymStr} c/u`,
    meta: 'Fuerza + acondicionamiento' })

  if (w >= 4) {
    const cardioMins = w <= 8 ? 20 : w <= 15 ? 30 : w <= 25 ? 40 : 45
    missions.push({ id: 'g_cardio', icon: '🏃', cat: 'fitness',
      xp: Math.min(90, 45 + Math.floor((w - 4) / 4) * 5),
      name: `Cardio ${cardioMins} min`, meta: 'Correr / bici / HIIT' })
  }

  if (w >= 8) {
    missions.push({ id: 'g_stretch', icon: '🧘', cat: 'fitness', xp: 35,
      name: 'Stretching / movilidad 15 min', meta: 'Recuperación activa' })
  }

  if (w >= 20) {
    missions.push({ id: 'g_extra', icon: '⚽', cat: 'fitness', xp: 60,
      name: 'Deporte extra o clase grupal', meta: 'Variedad de movimiento' })
  }

  return missions
}

export function getSleepMissions(week) {
  const w = week
  const missions = []

  missions.push({ id: 's_sleep', icon: '😴', cat: 'sleep', xp: 50,
    name: 'Dormir 7-8 horas', meta: 'Horario consistente' })

  if (w >= 5) missions.push({ id: 's_screen', icon: '📵', cat: 'sleep', xp: 40,
    name: 'Sin pantallas 1h antes de dormir', meta: 'Higiene del sueño' })

  if (w >= 12) missions.push({ id: 's_routine', icon: '🌙', cat: 'sleep', xp: 40,
    name: 'Rutina nocturna completa', meta: 'Relax / lectura / temperatura fresca' })

  return missions
}

export function getWeekMissions(week) {
  const w = Math.max(1, Math.min(200, week))
  return [
    ...getMusicMissions(w),
    ...getFoodMissions(w),
    ...getFitnessMissions(w),
    ...getSleepMissions(w),
  ]
}

export const EVOLUTIONS = [
  { lvl: 1,   name: 'Bedroom Producer', desc: 'Todo empezó en tu cuarto.',        gear: 'basic',     lights: 'none',    skin: '#c8a87a' },
  { lvl: 10,  name: 'Underground DJ',   desc: 'Tus sets suenan en el barrio.',    gear: 'decks',     lights: 'blue',    skin: '#b89060' },
  { lvl: 25,  name: 'Club Resident',    desc: 'El club te conoce de memoria.',    gear: 'booth',     lights: 'purple',  skin: '#a07850' },
  { lvl: 50,  name: 'Festival Artist',  desc: 'Tu nombre en el cartel.',          gear: 'stage',     lights: 'multi',   skin: '#906040' },
  { lvl: 75,  name: 'Headliner',        desc: 'Sos el plato principal.',          gear: 'mainstage', lights: 'fire',    skin: '#804030' },
  { lvl: 100, name: 'Producer Legend',  desc: 'Tus tracks los conoce el mundo.',  gear: 'legend',    lights: 'gold',    skin: '#702020' },
  { lvl: 150, name: 'Iconic DJ',        desc: 'Tu nombre es una marca.',          gear: 'iconic',    lights: 'rainbow', skin: '#6020a0' },
  { lvl: 200, name: 'Immortal Artist',  desc: 'Eres historia de la música.',      gear: 'god',       lights: 'cosmic',  skin: '#4010c0' },
]

export function getEvolution(lvl) {
  let ev = EVOLUTIONS[0]
  for (const e of EVOLUTIONS) { if (lvl >= e.lvl) ev = e; else break }
  return ev
}

export const XP_PER_LEVEL = 700
export const MAX_LEVEL = 200

export const CAT_COLORS = {
  music:   '#00c3ff',
  food:    '#00e5a0',
  fitness: '#ff3d7f',
  sleep:   '#9b59ff',
}

export const CAT_LABELS = {
  music:   '🎛️ Producción & DJ',
  food:    '🥗 Alimentación',
  fitness: '💪 Actividad física',
  sleep:   '😴 Sueño',
}
