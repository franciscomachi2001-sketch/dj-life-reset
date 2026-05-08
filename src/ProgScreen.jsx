import { useState } from 'react'
import { getWeekMissions, getEvolution, CAT_COLORS, CAT_LABELS } from './missions'
import { getLevel } from './useGameState'
import styles from './ProgScreen.module.css'

export default function ProgScreen({ state }) {
  const currentWeek = getLevel(state.xp)
  const [week, setWeek] = useState(currentWeek)

  const missions = getWeekMissions(week)
  const nextMissions = getWeekMissions(week + 1)
  const ev = getEvolution(week)
  const cats = ['music', 'food', 'fitness', 'sleep']

  // Find what's new next week
  const newNextWeek = nextMissions.filter(n =>
    !missions.find(m => m.id === n.id && m.name === n.name)
  )

  return (
    <div className={styles.wrap}>
      <div className={styles.navRow}>
        <button className={styles.navBtn} onClick={() => setWeek(w => Math.max(1, w - 1))}>‹ Ant.</button>
        <div className={styles.weekLabel}>
          <div className={styles.weekNum}>SEMANA {week}</div>
          <div className={styles.weekEv}>{ev.name}</div>
        </div>
        <button className={styles.navBtn} onClick={() => setWeek(w => Math.min(200, w + 1))}>Sig. ›</button>
      </div>

      {week === currentWeek && (
        <div className={styles.currentBadge}>✦ Semana actual</div>
      )}

      {cats.map(cat => {
        const qs = missions.filter(m => m.cat === cat)
        if (!qs.length) return null
        return (
          <div key={cat}>
            <div className={styles.qCat}>
              <span>{CAT_LABELS[cat]}</span>
              <span className={styles.qCatLine} />
            </div>
            {qs.map(q => (
              <div key={q.id} className={styles.qitem}>
                <span className={styles.qIcon}>{q.icon}</span>
                <div className={styles.qInfo}>
                  <div className={styles.qName}>{q.name}</div>
                  <div className={styles.qMeta}>{q.meta}</div>
                </div>
                <span className={styles.qxp} style={{ color: CAT_COLORS[cat], borderColor: CAT_COLORS[cat] + '55', background: CAT_COLORS[cat] + '15' }}>+{q.xp}</span>
              </div>
            ))}
          </div>
        )
      })}

      {week < 200 && newNextWeek.length > 0 && (
        <div className={styles.nextWrap}>
          <div className={styles.nextTitle}>Novedad en semana {week + 1}</div>
          {newNextWeek.map(q => (
            <div key={q.id} className={styles.newItem}>
              <span className={styles.newBadge}>NUEVO</span>
              <span style={{ fontSize: 15, marginLeft: 4 }}>{q.icon}</span>
              <div className={styles.qInfo}>
                <div className={styles.qName}>{q.name}</div>
                <div className={styles.qMeta}>{q.meta}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
