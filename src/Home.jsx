import CharCanvas from './CharCanvas'
import { getWeekMissions, EVOLUTIONS, getEvolution, CAT_COLORS, CAT_LABELS, XP_PER_LEVEL, MAX_LEVEL } from './missions'
import { getLevel, getLevelXP } from './useGameState'
import styles from './Home.module.css'

export default function Home({ state, toggleQuest, onNav }) {
  const lvl = getLevel(state.xp)
  const lvlXP = getLevelXP(state.xp)
  const ev = getEvolution(lvl)
  const missions = getWeekMissions(lvl)
  const doneCt = missions.filter(m => state.questStates[m.id]).length

  const today = new Date()
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const todayName = dayNames[today.getDay()]

  // Road nodes
  const start = Math.max(1, lvl - 3)
  const end = Math.min(MAX_LEVEL, lvl + 15)
  const nodes = []
  for (let i = start; i <= end; i++) nodes.push(i)

  // Group missions by cat
  const cats = ['music', 'food', 'fitness', 'sleep']

  return (
    <div className={styles.wrap}>
      {/* HEADER */}
      <div className={styles.topBar}>
        <CharCanvas level={lvl} scale={0.78} width={64} height={78} onClick={() => onNav('char')} />
        <div className={styles.heroInfo}>
          <div className={styles.nameRow}>
            <span className={styles.heroName}>PRODUCER</span>
            <span className={styles.lvlBadge}>LVL {lvl}</span>
          </div>
          <div className={styles.heroClass}>{ev.name}</div>
          <div className={styles.xpRow}>
            <div className={styles.barBg}>
              <div className={styles.barFill} style={{ width: `${Math.round(lvlXP / XP_PER_LEVEL * 100)}%`, background: 'linear-gradient(90deg,#00c3ff,#9b59ff)' }} />
            </div>
            <span className={styles.xpTxt}>{lvlXP}/{XP_PER_LEVEL}</span>
          </div>
          <div className={styles.xpRow} style={{ marginTop: 3 }}>
            <div className={styles.barBg} style={{ height: 4 }}>
              <div className={styles.barFill} style={{ width: `${Math.round(lvl / MAX_LEVEL * 100)}%`, background: '#f0a500' }} />
            </div>
            <span className={styles.xpTxt} style={{ fontSize: 9 }}>WK {lvl}/200</span>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className={styles.statsRow}>
        {[
          { icon: '🔥', val: state.streak, label: 'Racha' },
          { icon: '⚡', val: state.xp, label: 'XP Total' },
          { icon: '🎛️', val: state.musicSessions, label: 'Sesiones' },
          { icon: '✅', val: `${doneCt}/${missions.length}`, label: 'Hoy' },
        ].map(s => (
          <div key={s.label} className={styles.scard}>
            <div className={styles.scardIcon}>{s.icon}</div>
            <div className={styles.scardVal}>{s.val}</div>
            <div className={styles.scardLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* WEEK BANNER */}
      <div className={styles.weekBanner}>
        <div>
          <div className={styles.weekTitle}>SEMANA {lvl}</div>
          <div className={styles.weekSub}>{ev.name} · {todayName} {today.getDate()}/{today.getMonth() + 1}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className={styles.weekDays}>{doneCt}/{missions.length} misiones</div>
          <div className={styles.weekDots}>
            {[1, 2, 3, 4, 5, 6, 7].map(d => (
              <div key={d} className={[styles.wdot, d < today.getDay() ? styles.wdotDone : d === today.getDay() ? styles.wdotToday : ''].join(' ')} />
            ))}
          </div>
        </div>
      </div>

      {/* MISSIONS */}
      <div className={styles.secTitle}>— misiones de hoy —</div>
      <div className={styles.questList}>
        {cats.map(cat => {
          const qs = missions.filter(m => m.cat === cat)
          if (!qs.length) return null
          return (
            <div key={cat}>
              <div className={styles.qCat}>
                <span>{CAT_LABELS[cat]}</span>
                <span className={styles.qCatLine} />
              </div>
              {qs.map(q => {
                const done = !!state.questStates[q.id]
                return (
                  <div key={q.id} className={[styles.qitem, done ? styles.qDone : ''].join(' ')} onClick={() => toggleQuest(q)}>
                    <div className={[styles.qcheck, done ? styles.qcheckDone : ''].join(' ')}>
                      {done && '✓'}
                    </div>
                    <span className={styles.qIcon}>{q.icon}</span>
                    <div className={styles.qInfo}>
                      <div className={styles.qName}>{q.name}</div>
                      <div className={styles.qMeta}>{q.meta}</div>
                    </div>
                    <span className={styles.qxp} style={{ color: CAT_COLORS[cat], borderColor: CAT_COLORS[cat] + '55', background: CAT_COLORS[cat] + '15' }}>+{q.xp}</span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* ROAD */}
      <div className={styles.secTitle}>— camino del artista —</div>
      <div className={styles.roadWrap}>
        <div className={styles.road} id="road-scroll">
          {nodes.map(i => {
            const isMile = i % 25 === 0
            let cls = styles.roadNode
            if (i < lvl) cls += ' ' + styles.roadPassed
            else if (i === lvl) cls += ' ' + styles.roadCurrent
            else if (isMile) cls += ' ' + styles.roadMile
            else cls += ' ' + styles.roadLocked
            return <div key={i} className={cls}>{isMile && i !== lvl ? '★' : i}</div>
          })}
        </div>
      </div>
    </div>
  )
}
