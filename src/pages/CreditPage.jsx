import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import { isLogged } from '../lib/auth.js'
import { getAccount } from '../lib/bank.js'
import { brl } from '../lib/format.js'
import { store } from '../lib/store.js'

const terms = [6, 12, 18, 24]

function CreditPage() {
  const [credit, setCredit] = useState(null)
  const [amount, setAmount] = useState('')
  const [term, setTerm] = useState(6)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!isLogged()) {
      window.location.replace('../index.html')
      return undefined
    }

    let active = true
    getAccount()
      .then(({ user }) => { if (active) setCredit(user.credito) })
      .catch(() => { if (active) setLoadError('Não foi possível carregar as opções de crédito.') })

    return () => { active = false }
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setResult(null)

    const value = Number(amount)
    if (!(value >= 100)) {
      setError('O valor mínimo é R$ 100,00.')
      return
    }
    if (value > credit.limite) {
      setError(`O valor máximo é ${brl(credit.limite)}.`)
      return
    }

    const monthlyRate = credit.taxa / 100
    const installment = (value * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term))
    setResult({ installment, total: installment * term, term })
  }

  const userName = store.get('session')?.nome ?? 'Cliente'

  return (
    <AppShell activePage="credit" userName={userName}>
      <main className="content" id="conteudo" tabIndex="-1">
        {loadError ? (
          <p className="form-error" role="alert">{loadError}</p>
        ) : !credit ? (
          <p className="muted" role="status">Carregando as opções de crédito…</p>
        ) : (
          <>
            <div className="page-head">
              <div><h1>Crédito</h1><p className="muted">Simule antes de decidir. Valores de exemplo.</p></div>
              <a className="btn btn--outline" href="cartoes.html">Ver cartões</a>
            </div>

            <div className="grid grid--3">
              <section className="card card--olive stat" aria-label="Limite pré-aprovado">
                <small>Limite pré-aprovado</small><strong>{brl(credit.limite)}</strong>
              </section>
              <section className="card stat" aria-label="Taxa de exemplo">
                <small>Taxa de exemplo</small><strong>{String(credit.taxa).replace('.', ',')}% ao mês</strong>
              </section>
              <section className="card stat" aria-label="Prazo máximo">
                <small>Prazo máximo</small><strong>24 meses</strong>
              </section>
            </div>

            <section className="card" aria-labelledby="credit-simulator-title">
              <h2 id="credit-simulator-title">Simular empréstimo</h2>
              <form className="grid grid--3" noValidate onSubmit={handleSubmit}>
                <label className="field" htmlFor="credit-amount">Valor (R$)
                  <input
                    id="credit-amount"
                    type="number"
                    min="100"
                    max={credit.limite}
                    step="50"
                    placeholder="1000"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                </label>
                <label className="field" htmlFor="credit-term">Parcelas
                  <select id="credit-term" value={term} onChange={(event) => setTerm(Number(event.target.value))}>
                    {terms.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <button className="btn btn--primary" type="submit" style={{ alignSelf: 'end' }}>Simular</button>
              </form>
              <p className="form-error" role="alert">{error}</p>
              {result && (
                <div className="result" aria-live="polite">
                  <small>Parcela estimada</small>
                  <strong>{result.term}x de {brl(result.installment)}</strong>
                  <small>Total a pagar: {brl(result.total)}. Simulação de exemplo, sem valor contratual.</small>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </AppShell>
  )
}

export default CreditPage
