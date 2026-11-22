import { useState } from 'react'

function Topbar({ userName, isMenuOpen, menuButtonRef, onMenuToggle, onNotify }) {
  const [query, setQuery] = useState('')

  function handleSearch(event) {
    event.preventDefault()
    onNotify(query.trim() ? 'A busca chega em breve.' : 'Digite o que deseja buscar.')
  }

  return (
    <header className="topbar">
      <button
        ref={menuButtonRef}
        className="icon-btn menu-toggle"
        type="button"
        aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isMenuOpen}
        aria-controls="sidebar"
        onClick={onMenuToggle}
      >
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <form className="topbar__search" role="search" onSubmit={handleSearch}>
        <span className="icon" data-icon="lupa" aria-hidden="true" />
        <input
          type="search"
          name="q"
          placeholder="Buscar"
          aria-label="Buscar no FlashBank"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>

      <div className="topbar__actions">
        <button className="icon-btn" type="button" aria-label="Mensagens" onClick={() => onNotify('As mensagens chegam em breve.')}>
          <span className="icon" data-icon="mensagem2" aria-hidden="true" />
        </button>
        <button className="icon-btn has-dot" type="button" aria-label="Notificações, há novas" onClick={() => onNotify('As notificações chegam em breve.')}>
          <span className="icon" data-icon="notificacao" aria-hidden="true" />
        </button>
      </div>

      <span className="topbar__divider" aria-hidden="true" />
      <a className="topbar__user" href="/pages/minha-conta.html">
        <span className="avatar avatar--soft" aria-hidden="true">
          <span className="icon" data-icon="avatar" />
        </span>
        <div><strong>{userName}</strong><small>Minha conta</small></div>
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </a>
    </header>
  )
}

export default Topbar
