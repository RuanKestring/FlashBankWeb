import logo from '../assets/icons/Logo.svg'

const navigationItems = [
  { id: 'home', label: 'Início', href: '/pages/home.html', icon: 'casa' },
  { id: 'account', label: 'Minha conta', href: '/pages/minha-conta.html', icon: 'carteira' },
  { id: 'pix', label: 'Pix', href: '/pages/pix.html', icon: 'pix' },
  { id: 'cards', label: 'Cartões', href: '/pages/cartoes.html', icon: 'cartao' },
  { id: 'investments', label: 'Investimentos', href: '/pages/investimentos.html', icon: 'investimentos' },
  { id: 'savings', label: 'Cofrinhos', href: '/pages/cofrinhos.html', icon: 'cofrinho' },
  { id: 'credit', label: 'Crédito', href: '/pages/credito.html', icon: 'dinheiro' },
]

function Sidebar({ activePage, isOpen, onLogout, onNotify }) {
  return (
    <aside
      id="sidebar"
      className={`sidebar${isOpen ? ' is-open' : ''}`}
      aria-label="Menu lateral"
    >
      <a className="logo" href="/pages/home.html" aria-label="FlashBank, ir para o início">
        <img src={logo} alt="FlashBank" />
      </a>
      <span className="sidebar__label" id="sidebar-label">Sua conta</span>

      <nav className="nav" aria-labelledby="sidebar-label">
        {navigationItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={activePage === item.id ? 'is-active' : undefined}
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            <span className="icon" data-icon={item.icon} aria-hidden="true" />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="sidebar__bottom">
        <div className="chat-card">
          <span className="icon icon--lg" data-icon="mensagem" aria-hidden="true" />
          <strong>Vamos conversar?</strong>
          <span>Conte com a gente para o que precisar.</span>
          <a href="#suporte" onClick={(event) => {
            event.preventDefault()
            onNotify('O atendimento chega em breve.')
          }}>
            Falar com o FlashBank
            <svg className="ico" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="M5.833 14.167 14.167 5.833M6.667 5.833h7.5v7.5" />
            </svg>
          </a>
        </div>
        <button className="logout" type="button" onClick={onLogout}>
          <span className="icon" data-icon="log-out" aria-hidden="true" />
          Sair da conta
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
