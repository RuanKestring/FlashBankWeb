import { useEffect, useRef, useState } from 'react'
import { logout } from '../lib/auth.js'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import Toast from './Toast.jsx'

function AppShell({ activePage, userName, children, onNotify, notice }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)

  useEffect(() => {
    if (menuOpen) document.querySelector('#sidebar .nav a')?.focus()
  }, [menuOpen])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    const closeOnWideScreen = (event) => {
      if (event.matches) setMenuOpen(false)
    }
    const wideScreen = window.matchMedia('(min-width: 901px)')

    document.addEventListener('keydown', closeOnEscape)
    wideScreen.addEventListener('change', closeOnWideScreen)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      wideScreen.removeEventListener('change', closeOnWideScreen)
    }
  }, [])

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        isOpen={menuOpen}
        onLogout={logout}
        onNotify={onNotify}
      />
      <Topbar
        userName={userName}
        isMenuOpen={menuOpen}
        menuButtonRef={menuButtonRef}
        onMenuToggle={() => setMenuOpen((open) => !open)}
        onNotify={onNotify}
      />
      {menuOpen && (
        <button
          className="backdrop"
          type="button"
          aria-label="Fechar menu"
          onClick={() => {
            setMenuOpen(false)
            menuButtonRef.current?.focus()
          }}
        />
      )}
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      {children}
      <footer className="footer">
        <span>FlashBank. Com você em cada plano.</span>
        <span>Privacidade · Segurança · Ajuda</span>
      </footer>
      <Toast message={notice} />
    </div>
  )
}

export default AppShell
