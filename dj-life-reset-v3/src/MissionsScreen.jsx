import { getWeekMissions, getEvolution, CAT, XP_PER_LEVEL } from './missions'
import { getLevel } from './useGameState'
import s from './MissionsScreen.module.css'

export default function MissionsScreen({ state, toggleMissionActive }) {
  const lvl = getLevel(state.xp)
  const ev = getEvolution(lvl)
  const allMissions = getWeekMissions(lvl)
  const cats = ['music', 'food', 'fitness', 'sleep']

  const activeCount = allMissions.filter(m => !state.disabledQuests[m.id]).length
  const totalXP = allMissions.filter(m => !state.disabledQuests[m.id]).reduce((a, m) => a + m.xp, 0)

  // Next week preview
  const nextMissions = getWeekMissions(lvl + 1)
  const newNextWeek = nextMissions.filter(n => !allMissions.find(m => m.id === n.id && m.name === n.name))

  return (
    <div className={s.wrap}>
      <div className={s.header}>
        <div className={s.headerTitle}>Semana {lvl} — {ev.name}</div>
        <div className={s.headerSub}>{activeCount} misiones activas · {totalXP} XP posible/día</div>
      </div>

      <div className={s.hint}>
        Tocá para activar o desactivar una misión. Las desactivadas no dan XP ni penalizan.
      </div>

      {cats.map(cat => {
        const qs = allMissions.filter(m => m.cat === cat)
        if (!qs.length) return null
        return (
          <div key={cat}>
            <div className={s.qCat}>
              <span>{CAT[cat].label}</span>
              <span className={s.qLine} />
            </div>
            {qs.map(q => {
              const isActive = !state.disabledQuests[q.id]
              return (
                <div key={q.id} className={[s.qitem, !isActive ? s.qOff : ''].join(' ')} onClick={() => toggleMissionActive(q.id)}>
                  <div className={[s.toggle, isActive ? s.toggleOn : ''].join(' ')}>
                    <div className={s.toggleThumb} />
                  </div>
                  <span className={s.qIcon}>{q.icon}</span>
                  <div className={s.qInfo}>
                    <div className={s.qName}>{q.name}</div>
                    <div className={s.qMeta}>{q.meta}</div>
                  </div>
                  <span className={s.qxp} style={{
                    color: isActive ? CAT[cat].color : '#3d4a60',
                    borderColor: isActive ? CAT[cat].color + '55' : '#1c2535',
                    background: isActive ? CAT[cat].color + '15' : 'transparent'
                  }}>+{q.xp}</span>
                </div>
              )
            })}
          </div>
        )
      })}

      {newNextWeek.length > 0 && (
        <div className={s.nextWrap}>
          <div className={s.nextTitle}>Novedades en semana {lvl + 1}</div>
          {newNextWeek.map(q => (
            <div key={q.id} className={s.nextItem}>
              <span className={s.newBadge}>NUEVO</span>
              <span style={{ fontSize: 14 }}>{q.icon}</span>
              <div className={s.qInfo}>
                <div className={s.qName}>{q.name}</div>
                <div className={s.qMeta}>{q.meta}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
