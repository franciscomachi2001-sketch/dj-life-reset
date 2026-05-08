import CharCanvas from './CharCanvas'
import { EVOLUTIONS, getEvolution } from './missions'
import { getLevel } from './useGameState'
import s from './CharScreen.module.css'

export default function CharScreen({ state, onReset }) {
  const lvl = getLevel(state.xp)
  const ev = getEvolution(lvl)

  const attrs = [
    { n: 'Producción', v: Math.min(99, Math.floor(state.musicSessions * 1.1 + lvl * 0.3)), c: '#b48cff' },
    { n: 'Técnica DJ',  v: Math.min(99, Math.floor(state.musicSessions * 0.8 + lvl * 0.4)), c: '#00d4ff' },
    { n: 'Disciplina',  v: Math.min(99, (state.streak || 0) * 2 + lvl), c: '#f5c542' },
    { n: 'Físico',      v: Math.min(99, Math.floor(state.totalDone * 0.35 + lvl * 0.3)), c: '#ff4d8d' },
  ]

  return (
    <div className={s.wrap}>
      <div className={s.secTitle}>— alter ego —</div>
      <div className={s.charName}>{ev.name}</div>
      <div className={s.charTitle}>"{ev.title}"</div>

      <CharCanvas level={lvl} scale={1.55} width={210} height={255}
        style={{ display: 'block', margin: '0 auto 14px' }} />

      <div className={s.attrs}>
        {attrs.map(a => (
          <div key={a.n} className={s.attrCard}>
            <div className={s.attrName}>{a.n}</div>
            <div className={s.attrVal} style={{ color: a.c }}>{Math.round(a.v)}</div>
            <div className={s.barBg}>
              <div className={s.barFill} style={{ width: `${Math.round(a.v)}%`, background: a.c }} />
            </div>
          </div>
        ))}
      </div>

      <div className={s.secTitle} style={{ marginTop: 4 }}>— evolución —</div>
      <div className={s.evolList}>
        {EVOLUTIONS.map((e, i) => {
          const next = EVOLUTIONS[i + 1]
          const reached = lvl >= e.lvl
          const isCur = reached && (!next || lvl < next.lvl)
          return (
            <div key={e.lvl} className={[s.evolItem, reached ? s.reached : '', isCur ? s.current : ''].join(' ')}>
              <span style={{ fontSize: 17, flexShrink: 0 }}>{reached ? '🎭' : '🔒'}</span>
              <div style={{ flex: 1 }}>
                <div className={s.evolName}>{e.name}</div>
                <div className={s.evolDesc}>{e.title}</div>
              </div>
              <span className={s.evolLvl}>LVL {e.lvl}</span>
            </div>
          )
        })}
      </div>

      <button className={s.resetBtn} onClick={onReset}>↺ Reiniciar progreso</button>
    </div>
  )
}
