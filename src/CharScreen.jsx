import CharCanvas from './CharCanvas'
import { EVOLUTIONS, getEvolution } from './missions'
import { getLevel } from './useGameState'
import styles from './CharScreen.module.css'

export default function CharScreen({ state, onNav, onReset }) {
  const lvl = getLevel(state.xp)
  const ev = getEvolution(lvl)

  const attrs = [
    { n: 'Producción', v: Math.min(99, Math.floor(state.musicSessions * 1.2 + lvl * 0.3)), c: '#00c3ff' },
    { n: 'Técnica DJ',  v: Math.min(99, Math.floor(state.musicSessions * 0.9 + lvl * 0.4)), c: '#9b59ff' },
    { n: 'Disciplina',  v: Math.min(99, state.streak * 2 + lvl), c: '#ff3d7f' },
    { n: 'Energía',     v: Math.min(99, Math.floor(state.totalDone * 0.4 + lvl * 0.3)), c: '#00e5a0' },
  ]

  return (
    <div className={styles.wrap}>
      <div className={styles.secTitle}>— tu alter ego —</div>

      <CharCanvas level={lvl} scale={1.5} width={200} height={240}
        style={{ display: 'block', margin: '0 auto 14px' }} />

      <div className={styles.attrs}>
        {attrs.map(a => (
          <div key={a.n} className={styles.attrCard}>
            <div className={styles.attrName}>{a.n}</div>
            <div className={styles.attrVal} style={{ color: a.c }}>{Math.round(a.v)}</div>
            <div className={styles.barBg}>
              <div className={styles.barFill} style={{ width: `${Math.round(a.v)}%`, background: a.c }} />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.secTitle}>— evolución del artista —</div>
      <div className={styles.evolList}>
        {EVOLUTIONS.map((e, i) => {
          const next = EVOLUTIONS[i + 1]
          const reached = lvl >= e.lvl
          const isCur = reached && (!next || lvl < next.lvl)
          return (
            <div key={e.lvl} className={[styles.evolItem, reached ? styles.reached : '', isCur ? styles.current : ''].join(' ')}>
              <span style={{ fontSize: 18 }}>{reached ? '🎧' : '🔒'}</span>
              <div style={{ flex: 1 }}>
                <div className={styles.evolName}>{e.name}</div>
                <div className={styles.evolDesc}>{e.desc}</div>
              </div>
              <span className={styles.evolLvl}>LVL {e.lvl}</span>
            </div>
          )
        })}
      </div>

      <button className={styles.resetBtn} onClick={onReset}>
        ↺ Reiniciar progreso
      </button>
    </div>
  )
}
