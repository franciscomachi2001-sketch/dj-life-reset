import styles from './HistScreen.module.css'

export default function HistScreen({ state, onClear }) {
  const { history } = state

  return (
    <div className={styles.wrap}>
      <div className={styles.secTitle}>— historial de logros —</div>

      {!history.length ? (
        <div className={styles.empty}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🎛️</div>
          <div>Completá tus primeras misiones</div>
          <div style={{ marginTop: 4, color: '#4a5568' }}>para llenar el log</div>
        </div>
      ) : (
        <>
          {history.map((h, i) => (
            <div key={i} className={styles.item}>
              <span className={styles.icon}>{h.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className={styles.title}>{h.title}</div>
                <div className={styles.date}>{h.desc} — {h.date}</div>
              </div>
              {h.xp > 0 && <span className={styles.xp}>+{h.xp}</span>}
            </div>
          ))}
          <button className={styles.clearBtn} onClick={onClear}>
            🗑 Limpiar historial
          </button>
        </>
      )}
    </div>
  )
}
