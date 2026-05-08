import { useState, useEffect, useCallback, useRef } from 'react'
import { XP_PER_LEVEL, MAX_LEVEL, getWeekMissions, getPenalty } from './missions'

const SK = 'djreset_v3'

export function getLevel(xp) { return Math.min(Math.floor(xp / XP_PER_LEVEL) + 1, MAX_LEVEL) }
export function getLevelXP(xp) { return xp % XP_PER_LEVEL }

function freshState() {
  return {
    xp: 0,
    streak: 0,
    totalDone: 0,
    todayDone: 0,
    musicSessions: 0,
    lastDate: '',
    missedDays: 0,
    questStates: {},       // { questId: true/false } for today
    disabledQuests: {},    // { questId: true } = permanently disabled by user
    history: [],
    penaltyLog: [],        // log of penalties applied
  }
}

function loadState() {
  try {
    const r = localStorage.getItem(SK)
    if (r) return { ...freshState(), ...JSON.parse(r) }
  } catch (e) {}
  return freshState()
}

function applyDayRollover(state) {
  const today = new Date().toDateString()
  if (state.lastDate === today) return { state, penalty: 0 }

  const next = { ...state }
  const yest = new Date(); yest.setDate(yest.getDate() - 1)
  const wasYesterday = state.lastDate === yest.toDateString()

  let penalty = 0

  if (state.lastDate) {
    if (state.todayDone > 0) {
      // Completed some missions — reset missed streak
      next.missedDays = 0
      if (wasYesterday) next.streak = state.streak + 1
      else next.streak = 1
      const d = new Date(state.lastDate)
      const ds = d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
      next.history = [
        { icon: '📅', title: 'Día completado', desc: `${state.todayDone} misiones`, date: ds, xp: state.todayDone * 15, type: 'day' },
        ...state.history,
      ].slice(0, 200)
    } else {
      // Missed day
      next.missedDays = (state.missedDays || 0) + 1
      next.streak = 0
      penalty = getPenalty(next.missedDays, state.xp)
      if (penalty > 0) {
        next.xp = Math.max(0, state.xp - penalty)
        const d = new Date()
        const ds = d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
        next.history = [
          { icon: '💀', title: `Penalización: -${penalty} XP`, desc: `${next.missedDays} días sin completar misiones`, date: ds, xp: -penalty, type: 'penalty' },
          ...state.history,
        ].slice(0, 200)
      }
    }
  }

  next.lastDate = today
  next.todayDone = 0
  next.questStates = {}
  return { state: next, penalty }
}

export function useGameState() {
  const initRef = useRef(false)
  const [state, setStateRaw] = useState(() => {
    const loaded = loadState()
    const { state: rolled } = applyDayRollover(loaded)
    return rolled
  })
  const [levelUpData, setLevelUpData] = useState(null)
  const [penaltyAlert, setPenaltyAlert] = useState(null)

  useEffect(() => {
    try { localStorage.setItem(SK, JSON.stringify(state)) } catch (e) {}
  }, [state])

  const toggleQuest = useCallback((quest) => {
    setStateRaw(prev => {
      const wasDone = !!prev.questStates[quest.id]
      const lvlBefore = getLevel(prev.xp)
      const next = { ...prev, questStates: { ...prev.questStates } }

      if (!wasDone) {
        next.questStates[quest.id] = true
        next.xp = prev.xp + quest.xp
        next.todayDone = prev.todayDone + 1
        next.totalDone = prev.totalDone + 1
        if (quest.cat === 'music') next.musicSessions = prev.musicSessions + 1
        const ds = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        next.history = [{ icon: quest.icon, title: quest.name, desc: quest.meta, date: ds, xp: quest.xp, type: 'quest' }, ...prev.history].slice(0, 200)
      } else {
        next.questStates[quest.id] = false
        next.xp = Math.max(0, prev.xp - quest.xp)
        next.todayDone = Math.max(0, prev.todayDone - 1)
        next.totalDone = Math.max(0, prev.totalDone - 1)
        if (quest.cat === 'music') next.musicSessions = Math.max(0, prev.musicSessions - 1)
      }

      const lvlAfter = getLevel(next.xp)
      if (lvlAfter > lvlBefore) {
        const ds = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
        next.history = [{ icon: '🏆', title: `LEVEL UP — LVL ${lvlAfter}`, desc: `Semana ${lvlAfter} desbloqueada`, date: ds, xp: 0, type: 'levelup' }, ...next.history]
        setTimeout(() => setLevelUpData(lvlAfter), 300)
      }

      return next
    })
  }, [])

  const toggleMissionActive = useCallback((questId) => {
    setStateRaw(prev => ({
      ...prev,
      disabledQuests: {
        ...prev.disabledQuests,
        [questId]: !prev.disabledQuests[questId],
      }
    }))
  }, [])

  const resetGame = useCallback(() => {
    const f = freshState()
    f.lastDate = new Date().toDateString()
    setStateRaw(f)
  }, [])

  const clearHistory = useCallback(() => {
    setStateRaw(p => ({ ...p, history: [] }))
  }, [])

  return { state, toggleQuest, toggleMissionActive, resetGame, clearHistory, levelUpData, setLevelUpData, penaltyAlert, setPenaltyAlert }
}
