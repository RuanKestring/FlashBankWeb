import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import { isLogged } from '../lib/auth.js'
import { addTx, getAccount } from '../lib/bank.js'
import { getJSON } from '../lib/api.js'
import { brl } from '../lib/format.js'
import { store } from '../lib/store.js'

function SavingsPage() {
  const [goals, setGoals] = useState(null)
  const [goalExtras, setGoalExtras] = useState(() => store.get('cofrinhos', {}))
  const [account, setAccount] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [success, setSuccess] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!isLogged()) {
      window.location.replace('../index.html')
      return undefined
    }

    let active = true
    Promise.all([getJSON('cofrinhos'), getAccount()])
      .then(([baseGoals, currentAccount]) => {
        if (!active) return
        setGoals(baseGoals)
        setAccount(currentAccount)
        setSelectedGoal(baseGoals[0]?.id ?? '')
      })
      .catch(() => { if (active) setLoadError('Não foi possível carregar os Cofrinhos.') })

    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(''), 2500)
    return () => window.clearTimeout(timeout)
  }, [notice])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    const value = Number(amount)
    if (!(value > 0)) {
      setError('Digite um valor maior que zero.')
      return
    }
    const goal = goals.find((item) => item.id === selectedGoal)
    if (!goal) {
      setError('Selecione um Cofrinho.')
      return
    }

    let currentAccount
    try {
      currentAccount = await getAccount()
    } catch {
      setError('Não foi possível confirmar o saldo da conta.')
      return
    }
    if (value > currentAccount.saldo) {
      setAccount(currentAccount)
      setError(`Saldo insuficiente. Você tem ${brl(currentAccount.saldo)}.`)
      return
    }

    const nextExtras = {
      ...goalExtras,
      [selectedGoal]: (goalExtras[selectedGoal] || 0) + value,
    }
    store.set('cofrinhos', nextExtras)
    setGoalExtras(nextExtras)
    addTx(`Cofrinho ${goal.nome}`, 'Agora · Dinheiro guardado', -value)
    setAccount({ ...currentAccount, saldo: currentAccount.saldo - value })
    setAmount('')
    setSuccess(`${brl(value)} guardados.`)
    setNotice('Dinheiro guardado.')
  }

  const userName = account?.user.nome ?? store.get('session')?.nome ?? 'Cliente'
  const goalsWithBalances = goals?.map((goal) => ({
    ...goal,
    guardado: goal.guardado + (goalExtras[goal.id] || 0),
  }))

  return (
    <AppShell activePage="savings" userName={userName} onNotify={setNotice} notice={notice}>
      <main className="content" id="conteudo" tabIndex="-1">
        {loadError ? (
          <p className="form-error" role="alert">{loadError}</p>
        ) : !goalsWithBalances || !account ? (
          <p className="muted" role="status">Carregando seus Cofrinhos…</p>
        ) : (
          <>
            <div className="page-head">
              <div>
                <h1>Cofrinhos</h1>
                <p className="muted">Guarde dinheiro para cada objetivo.</p>
              </div>
              <a className="btn btn--outline" href="investimentos.html">Ver investimentos</a>
            </div>

            <div className="grid grid--2">
              <section className="card" aria-labelledby="savings-list-title">
                <h2 id="savings-list-title">Meus cofrinhos</h2>
                <ul>
                  {goalsWithBalances.map((goal) => {
                    const progress = Math.min(100, (goal.guardado / goal.meta) * 100)
                    return (
                      <li className="row" key={goal.id}>
                        <div className="stack" style={{ flex: 1 }}>
                          <div className="card__head">
                            <strong>{goal.nome}</strong>
                            <small>{brl(goal.guardado)} de {brl(goal.meta)}</small>
                          </div>
                          <div
                            className="progress"
                            role="progressbar"
                            aria-label={`Progresso do Cofrinho ${goal.nome}`}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-valuenow={Math.round(progress)}
                          >
                            <i style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>

              <section className="card" aria-labelledby="savings-add-title">
                <h2 id="savings-add-title">Guardar dinheiro</h2>
                <small>Saldo disponível: <b>{brl(account.saldo)}</b></small>
                <form className="stack" noValidate onSubmit={handleSubmit}>
                  <label className="field" htmlFor="cof-select">Cofrinho
                    <select id="cof-select" value={selectedGoal} onChange={(event) => setSelectedGoal(event.target.value)}>
                      {goalsWithBalances.map((goal) => <option key={goal.id} value={goal.id}>{goal.nome}</option>)}
                    </select>
                  </label>
                  <label className="field" htmlFor="cof-valor">Valor (R$)
                    <input
                      id="cof-valor"
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
                  <button className="btn btn--primary" type="submit">Guardar</button>
                </form>
              </section>
            </div>
          </>
        )}
      </main>
    </AppShell>
  )
}

export default SavingsPage
