import CharCanvas from './CharCanvas'
import { getWeekMissions, getEvolution, CAT, XP_PER_LEVEL, MAX_LEVEL } from './missions'
import { getLevel, getLevelXP } from './useGameState'
import s from './Home.module.css'

export default function Home({ state, toggleQuest, onNav }) {
  const lvl = getLevel(state.xp)
  const lvlXP = getLevelXP(state.xp)
  const ev = getEvolution(lvl)
  const allMissions = getWeekMissions(lvl)
  const activeMissions = allMissions.filter(m => !state.disabledQuests[m.id])
  const doneCt = activeMissions.filter(m => state.questStates[m.id]).length
  const cats = ['music', 'food', 'fitness', 'sleep']
  const today = new Date()
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  // Road
  const start = Math.max(1, lvl - 3), end = Math.min(MAX_LEVEL, lvl + 16)
  const nodes = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  // Penalty warning
  const missedDays = state.missedDays || 0

  return (
    <div className={s.wrap}>
      {/* HEADER */}
      <div className={s.topBar}>
        <CharCanvas level={lvl} scale={0.82} width={72} height={88} onClick={() => onNav('char')} />
        <div className={s.heroInfo}>
          <div className={s.nameRow}>
            <span className={s.heroName}>{ev.name.toUpperCase()}</span>
            <span className={s.lvlBadge}>LVL {lvl}</span>
          </div>
          <div className={s.heroClass}>{ev.title}</div>
          <div className={s.xpRow}>
            <div className={s.barBg}>
              <div className={s.barFill} style={{ width: `${Math.round(lvlXP / XP_PER_LEVEL * 100)}%`, background: 'linear-gradient(90deg,#b48cff,#ff4d8d)' }} />
            </div>
            <span className={s.xpTxt}>{lvlXP}/{XP_PER_LEVEL} XP</span>
          </div>
          <div className={s.xpRow} style={{ marginTop: 3 }}>
            <div className={s.barBg} style={{ height: 3 }}>
              <div className={s.barFill} style={{ width: `${Math.round(lvl / MAX_LEVEL * 100)}%`, background: '#f5c542' }} />
            </div>
            <span className={s.xpTxt} style={{ fontSize: 9 }}>Semana {lvl}/200</span>
          </div>
        </div>
      </div>

      {/* PENALTY WARNING */}
      {missedDays >= 2 && (
        <div className={s.penaltyWarn}>
          ⚠️ {missedDays} días sin completar misiones — próxima penalización activa
        </div>
      )}

      {/* STATS */}
      <div className={s.statsRow}>
        {[
          { icon: '🔥', val: state.streak, label: 'Racha' },
          { icon: '⚡', val: state.xp, label: 'XP Total' },
          { icon: '🎛️', val: state.musicSessions, label: 'Sesiones' },
          { icon: '✅', val: `${doneCt}/${activeMissions.length}`, label: 'Hoy' },
        ].map(st => (
          <div key={st.label} className={s.scard}>
            <div className={s.scardIcon}>{st.icon}</div>
            <div className={s.scardVal}>{st.val}</div>
            <div className={s.scardLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* WEEK BANNER */}
      <div className={s.weekBanner}>
        <div>
          <div className={s.weekTitle}>SEMANA {lvl}</div>
          <div className={s.weekSub}>{dayNames[today.getDay()]} {today.getDate()}/{today.getMonth() + 1}/{today.getFullYear()}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className={s.weekCount}>{doneCt}/{activeMissions.length}</div>
          <div className={s.weekDots}>
            {[1, 2, 3, 4, 5, 6, 7].map(d => (
              <div key={d} className={[s.wdot, d < today.getDay() ? s.wdotDone : d === today.getDay() ? s.wdotToday : ''].join(' ')} />
            ))}
          </div>
        </div>
      </div>

      {/* MISSIONS */}
      <div className={s.secTitle}>— misiones de hoy —</div>
      <div className={s.questList}>
        {cats.map(cat => {
          const qs = activeMissions.filter(m => m.cat === cat)
          if (!qs.length) return null
          return (
            <div key={cat}>
              <div className={s.qCat}>
                <span>{CAT[cat].label}</span>
                <span className={s.qLine} />
              </div>
              {qs.map(q => {
                const done = !!state.questStates[q.id]
                return (
                  <div key={q.id} className={[s.qitem, done ? s.qDone : ''].join(' ')} onClick={() => toggleQuest(q)}>
                    <div className={[s.qcheck, done ? s.qcheckDone : ''].join(' ')}>{done && '✓'}</div>
                    <span className={s.qIcon}>{q.icon}</span>
                    <div className={s.qInfo}>
                      <div className={s.qName}>{q.name}</div>
                      <div className={s.qMeta}>{q.meta}</div>
                    </div>
                    <span className={s.qxp} style={{ color: CAT[cat].color, borderColor: CAT[cat].color + '55', background: CAT[cat].color + '15' }}>+{q.xp}</span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* ROAD */}
      <div className={s.secTitle}>— camino del artista —</div>
      <div className={s.roadWrap}>
        <div className={s.road}>
          {nodes.map(i => {
            const isMile = i % 25 === 0
            let cls = s.roadNode + ' '
            if (i < lvl) cls += s.roadPassed
            else if (i === lvl) cls += s.roadCurrent
            else if (isMile) cls += s.roadMile
            else cls += s.roadLocked
            return <div key={i} className={cls}>{isMile && i !== lvl ? '★' : i}</div>
          })}
        </div>
      </div>
    </div>
  )
}
