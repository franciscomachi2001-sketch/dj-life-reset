import { useState } from 'react'
import './index.css'
import { useGameState } from './useGameState'
import Home from './Home'
import MissionsScreen from './MissionsScreen'
import CharScreen from './CharScreen'
import HistScreen from './HistScreen'
import NavBar from './NavBar'
import LevelUpModal from './LevelUpModal'
import s from './App.module.css'

export default function App() {
  const { state, toggleQuest, toggleMissionActive, resetGame, clearHistory, levelUpData, setLevelUpData } = useGameState()
  const [screen, setScreen] = useState('home')
  const [toast, setToast] = useState(null)

  function showToast(msg, type = 'xp') {
    setToast({ msg, type, id: Date.now() })
    setTimeout(() => setToast(null), 2400)
  }

  function handleToggleQuest(quest) {
    const wasDone = !!state.questStates[quest.id]
    toggleQuest(quest)
    if (!wasDone) showToast(`+${quest.xp} XP`, 'xp')
  }

  function handleReset() {
    if (window.confirm('¿Reiniciar TODO el progreso? No se puede deshacer.')) {
      resetGame()
      showToast('Progreso reiniciado', 'warn')
    }
  }

  const screens = {
    home:     <Home state={state} toggleQuest={handleToggleQuest} onNav={setScreen} />,
    missions: <MissionsScreen state={state} toggleMissionActive={toggleMissionActive} />,
    char:     <CharScreen state={state} onReset={handleReset} />,
    hist:     <HistScreen state={state} onClear={() => { if (window.confirm('¿Limpiar historial?')) clearHistory() }} />,
  }

  return (
    <div className={s.root}>
      <div className={s.content}>{screens[screen] || screens.home}</div>
      <NavBar active={screen} onNav={setScreen} />
      {toast && (
        <div key={toast.id} className={[s.toast, s['toast_' + toast.type]].join(' ')}>
          {toast.msg}
        </div>
      )}
      {levelUpData && <LevelUpModal level={levelUpData} onClose={() => setLevelUpData(null)} />}
    </div>
  )
}
