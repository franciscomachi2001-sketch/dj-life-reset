import styles from './NavBar.module.css'

const TABS = [
  { id: 'home',  icon: '⌂', label: 'Inicio' },
  { id: 'char',  icon: '◈', label: 'DJ' },
  { id: 'prog',  icon: '◷', label: 'Prog.' },
  { id: 'hist',  icon: '◎', label: 'Log' },
]

export default function NavBar({ active, onNav }) {
  return (
    <nav className={styles.nav}>
      {TABS.map(t => (
        <button
          key={t.id}
          className={[styles.tab, active === t.id ? styles.activeTab : ''].join(' ')}
          onClick={() => onNav(t.id)}
        >
          <span className={styles.tabIcon}>{t.icon}</span>
          <span className={styles.tabLabel}>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
