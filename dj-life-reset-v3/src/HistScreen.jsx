import s from './HistScreen.module.css'

const TYPE_COLORS = { quest: '#b48cff', levelup: '#f5c542', penalty: '#ff4d8d', day: '#00e5a0' }

export default function HistScreen({ state, onClear }) {
  const { history } = state
  const streak = state.streak || 0
  const totalDone = state.totalDone || 0
  const missedDays = state.missedDays || 0

  return (
    <div className={s.wrap}>
      <div className={s.summary}>
        <div className={s.summaryItem}><div className={s.summaryVal} style={{ color: '#f5c542' }}>{streak}</div><div className={s.summaryLabel}>Racha actual</div></div>
        <div className={s.summaryItem}><div className={s.summaryVal} style={{ color: '#00e5a0' }}>{totalDone}</div><div className={s.summaryLabel}>Total misiones</div></div>
        <div className={s.summaryItem}><div className={s.summaryVal} style={{ color: missedDays >= 3 ? '#ff4d8d' : '#8892aa' }}>{missedDays}</div><div className={s.summaryLabel}>Días perdidos</div></div>
      </div>

      <div className={s.secTitle}>— historial —</div>

      {!history.length ? (
        <div className={s.empty}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🎭</div>
          <div>Completá tus primeras misiones</div>
          <div style={{ marginTop: 4, color: '#3d4a60' }}>para llenar el historial</div>
        </div>
      ) : (
        <>
          {history.map((h, i) => (
            <div key={i} className={s.item}>
              <span className={s.icon}>{h.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className={s.title}>{h.title}</div>
                <div className={s.date}>{h.desc} — {h.date}</div>
              </div>
              {h.xp !== 0 && (
                <span className={s.xp} style={{ color: h.xp > 0 ? (TYPE_COLORS[h.type] || '#b48cff') : '#ff4d8d', borderColor: (h.xp > 0 ? (TYPE_COLORS[h.type] || '#b48cff') : '#ff4d8d') + '44', background: (h.xp > 0 ? (TYPE_COLORS[h.type] || '#b48cff') : '#ff4d8d') + '15' }}>
                  {h.xp > 0 ? '+' : ''}{h.xp}
                </span>
              )}
            </div>
          ))}
          <button className={s.clearBtn} onClick={onClear}>🗑 Limpiar historial</button>
        </>
      )}
    </div>
  )
}
