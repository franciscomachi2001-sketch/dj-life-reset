import { useEffect, useRef } from 'react'
import { drawChar } from './CharCanvas'
import { getEvolution, getWeekMissions } from './missions'
import s from './LevelUpModal.module.css'

export default function LevelUpModal({ level, onClose }) {
  const ref = useRef(null)
  const ev = getEvolution(level)
  const nextMissions = getWeekMissions(level)

  useEffect(() => { if (ref.current) drawChar(ref.current, level, 1.5) }, [level])

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>
        <div className={s.title}>SEMANA {level} DESBLOQUEADA</div>
        <canvas ref={ref} width={150} height={182} style={{ display: 'block', margin: '0 auto 10px', background: '#07090f', borderRadius: 8, imageRendering: 'pixelated' }} />
        <div className={s.rankName}>{ev.name}</div>
        <div className={s.rankDesc}>"{ev.title}"</div>
        <div className={s.nextBox}>
          <div className={s.nextLabel}>Misiones esta semana:</div>
          {nextMissions.slice(0, 4).map(m => <div key={m.id} className={s.nextItem}>{m.icon} {m.name}</div>)}
          {nextMissions.length > 4 && <div className={s.nextMore}>+ {nextMissions.length - 4} más</div>}
        </div>
        <button className={s.btn} onClick={onClose}>Fua fua fua... ¡A trabajar! 🎭</button>
      </div>
    </div>
  )
}
