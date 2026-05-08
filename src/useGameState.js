import { useState, useEffect, useCallback } from 'react'
import { XP_PER_LEVEL, MAX_LEVEL } from './missions'

const SK = 'djreset_v1'

function freshState() {
  return {
    xp: 0,
    streak: 0,
    totalDone: 0,
    todayDone: 0,
    musicSessions: 0,
    lastDate: '',
    questStates: {}, // { [questId]: boolean }
    history: [],
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(SK)
    if (raw) return { ...freshState(), ...JSON.parse(raw) }
  } catch (e) {}
  return freshState()
}

export function getLevel(xp) {
  return Math.min(Math.floor(xp / XP_PER_LEVEL) + 1, MAX_LEVEL)
}

export function getLevelXP(xp) {
  return xp % XP_PER_LEVEL
}

export function useGameState() {
  const [state, setStateRaw] = useState(() => {
    const s = loadState()
    return checkNewDay(s)
  })

  // Persist on every change
  useEffect(() => {
    try { localStorage.setItem(SK, JSON.stringify(state)) } catch (e) {}
  }, [state])

  const setState = useCallback((updater) => {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      return next
    })
  }, [])

  const toggleQuest = useCallback((quest) => {
    setState(prev => {
      const wasDone = !!prev.questStates[quest.id]
      const lvlBefore = getLevel(prev.xp)
      let next = { ...prev, questStates: { ...prev.questStates } }

      if (!wasDone) {
        next.questStates[quest.id] = true
        next.xp = prev.xp + quest.xp
        next.todayDone = prev.todayDone + 1
        next.totalDone = prev.totalDone + 1
        if (quest.cat === 'music') next.musicSessions = prev.musicSessions + 1
        const d = new Date()
        const ds = d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        next.history = [
          { icon: quest.icon, title: quest.name, desc: quest.meta, date: ds, xp: quest.xp },
          ...prev.history,
        ].slice(0, 150)
      } else {
        next.questStates[quest.id] = false
        next.xp = Math.max(0, prev.xp - quest.xp)
        next.todayDone = Math.max(0, prev.todayDone - 1)
        next.totalDone = Math.max(0, prev.totalDone - 1)
        if (quest.cat === 'music') next.musicSessions = Math.max(0, prev.musicSessions - 1)
      }

      const lvlAfter = getLevel(next.xp)
      if (lvlAfter > lvlBefore) {
        const d = new Date()
        const ds = d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        next.history = [
          { icon: '🏆', title: `¡LEVEL UP! LVL ${lvlAfter}`, desc: `Semana ${lvlAfter} desbloqueada`, date: ds, xp: 0 },
          ...next.history,
        ]
        next._leveledUp = lvlAfter
      } else {
        next._leveledUp = null
      }

      return next
    })
  }, [setState])

  const resetGame = useCallback(() => {
    const fresh = freshState()
    fresh.lastDate = new Date().toDateString()
    setStateRaw(fresh)
  }, [])

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }))
  }, [setState])

  return { state, toggleQuest, resetGame, clearHistory }
}

function checkNewDay(state) {
  const today = new Date().toDateString()
  if (state.lastDate === today) return state

  const next = { ...state }
  const yest = new Date(); yest.setDate(yest.getDate() - 1)

  if (state.lastDate === yest.toDateString() && state.todayDone > 0) {
    next.streak = state.streak + 1
  } else if (state.lastDate && state.lastDate !== today && state.todayDone === 0) {
    next.streak = 0
  }

  if (state.todayDone > 0) {
    const d = new Date(state.lastDate || Date.now())
    const ds = d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
    next.history = [
      { icon: '📅', title: 'Día completado', desc: `${state.todayDone} misiones`, date: ds, xp: state.todayDone * 20 },
      ...state.history,
    ].slice(0, 150)
  }

  next.lastDate = today
  next.todayDone = 0
  next.questStates = {}
  return next
}
