import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import { isLogged } from '../lib/auth.js'
import { getAccount, getAccountValue, setAccountValue } from '../lib/bank.js'
import { brl } from '../lib/format.js'
import { store } from '../lib/store.js'

function CardsPage() {
  const [user, setUser] = useState(null)
  const [blocked, setBlocked] = useState(() => getAccountValue('cardBlocked', false))
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!isLogged()) {
      window.location.replace('../index.html')
      return undefined
    }

    let active = true
    getAccount()
      .then(({ user: accountUser }) => { if (active) setUser(accountUser) })
      .catch(() => { if (active) setError('Não foi possível carregar os dados do cartão.') })

    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(''), 2500)
    return () => window.clearTimeout(timeout)
  }, [notice])

  function toggleBlocked() {
    const next = !blocked
    setBlocked(next)
    setAccountValue('cardBlocked', next)
  }

  const userName = user?.nome ?? store.get('session')?.nome ?? 'Cliente'

  return (
    <AppShell activePage="cards" userName={userName} onNotify={setNotice} notice={notice}>
      <main className="content" id="conteudo" tabIndex="-1">
        {error ? (
          <p className="form-error" role="alert">{error}</p>
        ) : !user ? (
          <p className="muted" role="status">Carregando os dados do cartão…</p>
        ) : (
          <>
            <div className="page-head">
              <div>
                <h1>Cartões</h1>
                <p className="muted">Veja seu cartão, a fatura e bloqueie quando precisar.</p>
              </div>
              <a className="btn btn--outline" href="home.html">Voltar ao início</a>
            </div>

            <div className="grid grid--2">
              <section className={`card card--olive bank-card${blocked ? ' is-blocked' : ''}`} aria-label="Cartão FlashBank">
                <small>FlashBank</small>
                <strong>•••• •••• •••• {user.cartao.final}</strong>
                <small>{blocked ? 'Cartão bloqueado' : user.cartao.status}</small>
              </section>
              <section className="card" aria-labelledby="card-controls-title">
                <h2 id="card-controls-title">Controles</h2>
                <p className="muted">Bloqueie o cartão se perdê-lo. Você pode desbloquear quando quiser.</p>
                <button
                  className="btn btn--primary"
                  type="button"
                  aria-pressed={blocked}
                  onClick={toggleBlocked}
                >
                  {blocked ? 'Desbloquear cartão' : 'Bloquear cartão'}
                </button>
              </section>
            </div>

            <div className="grid grid--2">
              <section className="card" aria-labelledby="card-invoice-title">
                <h2 id="card-invoice-title">Fatura atual</h2>
                <strong>{brl(user.cartao.fatura)}</strong>
                <small>Vence em {user.cartao.vencimento}</small>
                <div
                  className="progress"
                  role="progressbar"
                  aria-label="Uso do limite do cartão"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={Math.min(100, Math.round((user.cartao.fatura / user.cartao.limite) * 100))}
                >
                  <i style={{ width: `${Math.min(100, (user.cartao.fatura / user.cartao.limite) * 100)}%` }} />
                </div>
                <small>Limite total: {brl(user.cartao.limite)}</small>
              </section>
              <section className="card card--soft" aria-labelledby="card-credit-title">
                <h2 id="card-credit-title">Precisa de mais limite?</h2>
                <p className="muted">Simule um crédito pessoal sem compromisso.</p>
                <a className="link" href="credito.html">Ir para Crédito</a>
              </section>
            </div>
          </>
        )}
      </main>
    </AppShell>
  )
}

export default CardsPage
