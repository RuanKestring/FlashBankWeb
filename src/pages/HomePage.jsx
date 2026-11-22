import { useEffect, useState } from 'react'
import iconCart from '../assets/icons/icon-carrinho-compra.svg'
import iconCar from '../assets/icons/icon-carro.svg'
import AppShell from '../components/AppShell.jsx'
import { isLogged } from '../lib/auth.js'
import { getAccount } from '../lib/bank.js'
import { brl } from '../lib/format.js'
import { store } from '../lib/store.js'

const transactionImages = {
  carrinho: iconCart,
  carro: iconCar,
}

function getTransactionIcon(transaction) {
  if (transaction.icone) return transaction.icone
  const title = transaction.titulo.toLowerCase()
  if (title.startsWith('pix')) return 'pix'
  if (title.startsWith('cofrinho')) return 'cofrinho'
  return transaction.valor > 0 ? 'dinheiro' : 'cartao'
}

function HomePage() {
  const [account, setAccount] = useState(null)
  const [error, setError] = useState('')
  const [balanceHidden, setBalanceHidden] = useState(() => store.get('saldoHidden', false))
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!isLogged()) {
      window.location.replace('../index.html')
      return undefined
    }

    let active = true
    getAccount()
      .then((data) => { if (active) setAccount(data) })
      .catch(() => { if (active) setError('Não foi possível carregar os dados da conta.') })

    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(''), 2500)
    return () => window.clearTimeout(timeout)
  }, [notice])

  function toggleBalance() {
    const next = !balanceHidden
    setBalanceHidden(next)
    store.set('saldoHidden', next)
  }

  const notify = (message) => setNotice(message)
  const session = store.get('session')
  const userName = account?.user.nome ?? session?.nome ?? 'Cliente'

  return (
    <AppShell activePage="home" userName={userName} onNotify={notify} notice={notice}>
      <main className="content" id="conteudo" tabIndex="-1">
        {error ? (
          <p className="form-error" role="alert">{error}</p>
        ) : !account ? (
          <p className="muted" role="status">Carregando sua conta…</p>
        ) : (
          <>
            <div className="page-head">
              <div>
                <h1>Olá, <span>{account.user.nome.split(' ')[0]}</span>!</h1>
                <p className="muted">Tudo o que você precisa, em um só lugar.</p>
              </div>
              <span className="secure-note">
                <span className="icon" data-icon="seguro" aria-hidden="true" />
                Ambiente seguro
              </span>
            </div>

            <div className="grid grid--2 home-grid">
              <section className="card card--olive balance" aria-labelledby="balance-title">
                <div className="balance__head">
                  <span id="balance-title">Saldo disponível</span>
                  <button
                    className="balance__eye"
                    type="button"
                    aria-label={balanceHidden ? 'Mostrar saldo' : 'Ocultar saldo'}
                    aria-pressed={balanceHidden}
                    onClick={toggleBalance}
                  >
                    {balanceHidden ? (
                      <svg className="ico" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                        <path d="M8.233 4.3A8.2 8.2 0 0 1 10 4.167C15.278 4.167 18.333 10 18.333 10a13.6 13.6 0 0 1-1.63 2.327M11.767 15.7A8.2 8.2 0 0 1 10 15.833C4.722 15.833 1.667 10 1.667 10a13.6 13.6 0 0 1 3.63-4.327M2.5 2.5l15 15M8.233 8.233a2.5 2.5 0 0 0 3.534 3.534" />
                      </svg>
                    ) : (
                      <svg className="ico" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                        <path d="M1.667 10s3.055-5.833 8.333-5.833S18.333 10 18.333 10s-3.055 5.833-8.333 5.833S1.667 10 1.667 10Z" />
                        <circle cx="10" cy="10" r="2.5" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="balance__row">
                  <p className="balance__value">{balanceHidden ? 'R$ ••••••' : brl(account.saldo)}</p>
                  {typeof account.user.variacaoMes === 'number' && (
                    <span className="balance__trend">
                      <svg className="ico" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                        <path d="m18.333 5.833-6.25 6.25-3.75-3.75-6.666 6.667M13.333 5.833h5v5" />
                      </svg>
                      {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, signDisplay: 'exceptZero' }).format(account.user.variacaoMes)}% este mês
                    </span>
                  )}
                </div>
                <a className="balance__extract" href="#extrato" onClick={(event) => {
                  event.preventDefault()
                  notify('O extrato chega em breve.')
                }}>
                  Extrato
                  <svg className="ico" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                    <path d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833" />
                  </svg>
                </a>
              </section>

              <section className="card flash" aria-labelledby="card-title">
                <div className="card__head">
                  <h2 id="card-title">Seu cartão Flash</h2>
                  <span className="icon icon--lg flash__icon" data-icon="cartao" aria-hidden="true" />
                </div>
                <div className="flash__body">
                  <img className="flash__card" src="/images/cartao-fisico.png" alt="Cartão físico FlashBank" width="94" height="58" fetchPriority="high" />
                  <div>
                    <p>FlashBank •••• {account.user.cartao.final}</p>
                    <small>{store.get('cartaoBloqueado', false) ? 'Cartão bloqueado' : account.user.cartao.status}</small>
                  </div>
                </div>
                <a className="link link--arrow" href="cartoes.html">
                  Gerenciar cartões
                  <svg className="ico" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                    <path d="M5.833 14.167 14.167 5.833M6.667 5.833h7.5v7.5" />
                  </svg>
                </a>
              </section>
            </div>

            <section className="quick-actions" aria-labelledby="quick-actions-title">
              <h2 id="quick-actions-title">Ações rápidas</h2>
              <div className="grid grid--6">
                <a className="card quick" href="pix.html"><span className="icon" data-icon="pix" aria-hidden="true" /><strong>Pix</strong><small>Enviar ou receber</small></a>
                <a className="card quick" href="#pagar" onClick={(event) => { event.preventDefault(); notify('Esta tela chega em breve.') }}><span className="icon" data-icon="scan-line" aria-hidden="true" /><strong>Pagar</strong><small>Contas e boletos</small></a>
                <a className="card quick" href="investimentos.html"><span className="icon" data-icon="investimentos" aria-hidden="true" /><strong>Investir</strong><small>Seu dinheiro rende</small></a>
                <a className="card quick" href="cartoes.html"><span className="icon" data-icon="cartao" aria-hidden="true" /><strong>Cartões</strong><small>Físico e virtual</small></a>
                <a className="card quick" href="cofrinhos.html"><span className="icon" data-icon="cofrinho" aria-hidden="true" /><strong>Cofrinhos</strong><small>Guarde para seus planos</small></a>
                <a className="card quick" href="credito.html"><span className="icon" data-icon="dinheiro" aria-hidden="true" /><strong>Crédito</strong><small>Conheça suas opções</small></a>
              </div>
            </section>

            <div className="grid grid--2 home-grid">
              <section className="card" aria-labelledby="transactions-title">
                <div className="card__head">
                  <h2 id="transactions-title">Últimas movimentações</h2>
                  <a className="link" href="#movimentacoes" onClick={(event) => {
                    event.preventDefault()
                    notify('A lista completa chega em breve.')
                  }}>Ver todas</a>
                </div>
                <ul id="movs">
                  {account.tx.slice(0, 3).map((transaction, index) => {
                    const [when, category = ''] = transaction.detalhe.split(' · ')
                    const icon = getTransactionIcon(transaction)
                    return (
                      <li className="tx" key={`${transaction.titulo}-${index}`}>
                        {transactionImages[icon] ? (
                          <img className="tx__icon" src={transactionImages[icon]} alt="" width="40" height="40" />
                        ) : (
                          <span className="tx__icon tx__icon--tile" aria-hidden="true">
                            <span className="icon" data-icon={icon} />
                          </span>
                        )}
                        <div className="tx__info"><strong>{transaction.titulo}</strong><small>{when}</small></div>
                        <span className="tx__cat">{category}</span>
                        <span className={`tx__valor ${transaction.valor < 0 ? 'neg' : 'pos'}`}>
                          {transaction.valor > 0 ? '+' : ''}{brl(transaction.valor)}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </section>

              <section className="card card--journey" aria-labelledby="journey-title">
                <div className="card__head card__head--top">
                  <h2 className="journey__title" id="journey-title">
                    <span>Pequenos passos,</span>
                    <span className="journey__accent">grandes conquistas.</span>
                  </h2>
                  <span className="icon icon--lg" data-icon="cofrinho" aria-hidden="true" />
                </div>
                <p className="muted">Separe dinheiro nos Cofrinhos e dê o próximo passo nos seus planos.</p>
                <div className="steps" role="img" aria-label="5 de 8 passos concluídos">
                  {Array.from({ length: 8 }, (_, index) => (
                    <span className={index < 5 ? 'is-on' : undefined} key={index} />
                  ))}
                </div>
                <a className="link link--arrow" href="cofrinhos.html">
                  Conhecer os Cofrinhos
                  <svg className="ico" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                    <path d="M5.833 14.167 14.167 5.833M6.667 5.833h7.5v7.5" />
                  </svg>
                </a>
              </section>
            </div>
          </>
        )}
      </main>
    </AppShell>
  )
}

export default HomePage
