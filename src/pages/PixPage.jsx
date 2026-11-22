import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import { isLogged } from '../lib/auth.js'
import { addTx, getAccount } from '../lib/bank.js'
import { brl } from '../lib/format.js'

function PixPage() {
  const [account, setAccount] = useState(null)
  const [recipientKey, setRecipientKey] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [notice, setNotice] = useState('')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!isLogged()) {
      window.location.replace('../index.html')
      return undefined
    }

    let active = true
    getAccount()
      .then((data) => { if (active) setAccount(data) })
      .catch(() => { if (active) setLoadError('Não foi possível carregar os dados da conta.') })

    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(''), 2500)
    return () => window.clearTimeout(timeout)
  }, [notice])

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    const key = recipientKey.trim()
    const value = Number(amount)
    if (!key) {
      setError('Digite a chave do destinatário.')
      return
    }
    if (!(value > 0)) {
      setError('Digite um valor maior que zero.')
      return
    }
    if (value > account.saldo) {
      setError(`Saldo insuficiente. Você tem ${brl(account.saldo)}.`)
      return
    }

    addTx(`Pix para ${key}`, 'Agora · Pix enviado', -value)
    setAccount((current) => ({ ...current, saldo: current.saldo - value }))
    setRecipientKey('')
    setAmount('')
    setSuccess(`Pix de ${brl(value)} enviado.`)
    setNotice('Pix enviado.')
  }

  const userName = account?.user.nome ?? 'Cliente'

  return (
    <AppShell activePage="pix" userName={userName} onNotify={setNotice} notice={notice}>
      <main className="content" id="conteudo" tabIndex="-1">
        {loadError ? (
          <p className="form-error" role="alert">{loadError}</p>
        ) : !account ? (
          <p className="muted" role="status">Carregando os dados da conta…</p>
        ) : (
          <>
            <div className="page-head">
              <div>
                <h1>Pix</h1>
                <p className="muted">Envie dinheiro na hora, a qualquer momento.</p>
              </div>
              <a className="btn btn--outline" href="home.html">Voltar ao início</a>
            </div>

            <div className="grid grid--2">
              <section className="card" aria-labelledby="pix-send-title">
                <h2 id="pix-send-title">Enviar Pix</h2>
                <small>Saldo disponível: <b>{brl(account.saldo)}</b></small>
                <form className="stack" noValidate onSubmit={handleSubmit}>
                  <label className="field" htmlFor="pix-chave">Chave do destinatário
                    <input
                      id="pix-chave"
                      value={recipientKey}
                      onChange={(event) => setRecipientKey(event.target.value)}
                      placeholder="CPF, e-mail, celular ou chave aleatória"
                      autoComplete="off"
                    />
                  </label>
                  <label className="field" htmlFor="pix-valor">Valor (R$)
                    <input
                      id="pix-valor"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0,00"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                    />
                  </label>
                  <p className="form-error" role="alert">{error}</p>
                  <p className="form-ok" role="status">{success}</p>
                  <button className="btn btn--primary" type="submit">Enviar Pix</button>
                </form>
              </section>

              <section className="card" aria-labelledby="pix-keys-title">
                <h2 id="pix-keys-title">Minhas chaves</h2>
                <ul>
                  {account.user.chavesPix.map((key, index) => (
                    <li className="row" key={`${key.tipo}-${index}`}>
                      <span>{key.tipo}</span>
                      <strong>{key.valor}</strong>
                    </li>
                  ))}
                </ul>
                <a className="link" href="home.html">Ver movimentações na Home</a>
              </section>
            </div>
          </>
        )}
      </main>
    </AppShell>
  )
}

export default PixPage
