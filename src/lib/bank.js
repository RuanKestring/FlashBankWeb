// Camada de dados da conta: combina JSONs de demonstração e alterações locais.
import { getJSON } from './api.js'
import { store } from './store.js'

export async function getAccount() {
  const [base, transactions] = await Promise.all([
    getJSON('user'),
    getJSON('transactions'),
  ])
  const extra = store.get('tx', [])
  const balance = base.saldo + extra.reduce((sum, transaction) => sum + transaction.valor, 0)

  return {
    user: { ...base, ...store.get('profile', {}) },
    saldo: balance,
    tx: [...extra, ...transactions],
    txBase: transactions,
  }
}

export function addTx(title, detail, value) {
  const transactions = store.get('tx', [])
  transactions.unshift({ titulo: title, detalhe: detail, valor: value })
  store.set('tx', transactions)
}
