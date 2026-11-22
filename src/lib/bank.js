// Camada de dados da conta: combina JSONs de demonstração e alterações locais.
import { store } from './store.js'
import baseUser from '../data/user.json'
import baseTransactions from '../data/transactions.json'

export async function getAccount() {
  const extra = store.get('tx', [])
  const balance = baseUser.saldo + extra.reduce((sum, transaction) => sum + transaction.valor, 0)

  return {
    user: { ...baseUser, ...store.get('profile', {}) },
    saldo: balance,
    tx: [...extra, ...baseTransactions],
    txBase: baseTransactions,
  }
}

export function addTx(title, detail, value) {
  const transactions = store.get('tx', [])
  transactions.unshift({ titulo: title, detalhe: detail, valor: value })
  store.set('tx', transactions)
}
