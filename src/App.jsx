import { useState, useEffect } from 'react'
import './index.css'
import { useGameState, getLevel } from './useGameState'
import Home from './Home'
import CharScreen from './CharScreen'
import ProgScreen from './ProgScreen'
import HistScreen from './HistScreen'
import NavBar from './NavBar'
import LevelUpModal from './LevelUpModal'
import styles from './App.module.css'

export default function App() {
  const { state, toggleQuest, resetGame, clearHistory } = useGameState()
  const [screen, setScreen] = useState('home')
  const [toast, setToast] = useState(null)
  const [levelUpModal, setLevelUpModal] = useState(null)

  useEffect(() => {
    if (state._leveledUp) setLevelUpModal(state._leveledUp)
  }, [state._leveledUp])

  function handleToggleQuest(quest) {
    toggleQuest(quest)
    const isDone = !state.questStates[quest.id]
    if (isDone) showToast(`+${quest.xp} XP — ${quest.name.slice(0, 22)}`, 'xp')
  }

  function showToast(msg, type = 'xp') {
    setToast({ msg, type, id: Date.now() })
    setTimeout(() => setToast(null), 2400)
  }

  function handleReset() {
    if (window.confirm('¿Reiniciar TODO el progreso?')) {
      resetGame()
      showToast('Reset completo', 'warn')
    }
  }

  const screens = {
    home: <Home state={state} toggleQuest={handleToggleQuest} onNav={setScreen} />,
    char: <CharScreen state={state} onNav={setScreen} onReset={handleReset} />,
    prog: <ProgScreen state={state} />,
    hist: <HistScreen state={state} onClear={() => { if (window.confirm('¿Limpiar historial?')) clearHistory() }} />,
  }

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        {screens[screen] || screens.home}
      </div>
      <NavBar active={screen} onNav={setScreen} />
      {toast && (
        <div key={toast.id} className={[styles.toast, styles['toast_' + toast.type]].join(' ')}>
          {toast.msg}
        </div>
      )}
      {levelUpModal && (
        <LevelUpModal level={levelUpModal} onClose={() => setLevelUpModal(null)} />
      )}
    </div>
  )
}
