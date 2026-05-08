import s from './NavBar.module.css'

const TABS = [
  { id: 'home',     icon: '⌂', label: 'Inicio' },
  { id: 'missions', icon: '◈', label: 'Misiones' },
  { id: 'char',     icon: '◉', label: 'Personaje' },
  { id: 'hist',     icon: '◎', label: 'Log' },
]

export default function NavBar({ active, onNav }) {
  return (
    <nav className={s.nav}>
      {TABS.map(t => (
        <button key={t.id} className={[s.tab, active === t.id ? s.activeTab : ''].join(' ')} onClick={() => onNav(t.id)}>
          <span className={s.tabIcon}>{t.icon}</span>
          <span className={s.tabLabel}>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
