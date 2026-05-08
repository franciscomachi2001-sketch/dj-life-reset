import { useEffect, useRef } from 'react'
import { drawDJChar } from './CharCanvas'
import { getEvolution, getWeekMissions } from './missions'
import styles from './LevelUpModal.module.css'

export default function LevelUpModal({ level, onClose }) {
  const canvasRef = useRef(null)
  const ev = getEvolution(level)
  const nextMissions = getWeekMissions(level)

  useEffect(() => {
    if (canvasRef.current) drawDJChar(canvasRef.current, level, 1.5)
  }, [level])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.title}>⬆ SEMANA {level} DESBLOQUEADA</div>
        <canvas ref={canvasRef} width={140} height={170}
          style={{ display: 'block', margin: '0 auto 12px', background: '#080c14', borderRadius: 8, imageRendering: 'pixelated' }} />
        <div className={styles.rankName}>{ev.name}</div>
        <div className={styles.rankDesc}>"{ev.desc}"</div>

        <div className={styles.nextBox}>
          <div className={styles.nextTitle}>Misiones que te esperan:</div>
          {nextMissions.slice(0, 3).map(m => (
            <div key={m.id} className={styles.nextItem}>{m.icon} {m.name}</div>
          ))}
          {nextMissions.length > 3 && <div className={styles.nextMore}>+ {nextMissions.length - 3} más...</div>}
        </div>

        <button className={styles.btn} onClick={onClose}>DROP IT 🎧</button>
      </div>
    </div>
  )
}
