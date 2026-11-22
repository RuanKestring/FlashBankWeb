// Camada de dados da conta: combina JSONs de demonstração e alterações locais.
import baseUser from '../data/user.json'
import baseTransactions from '../data/transactions.json'
import {
  findUserByCpf,
  getAccountValue,
  getActiveCpf,
  getInvestmentsForAccount,
  getSavingsGoalsForAccount,
  setAccountValue,
} from './accounts.js'

export async function getAccount() {
  const cpf = getActiveCpf()
  const user = findUserByCpf(cpf) ?? baseUser
  const extra = getAccountValue('tx', [], cpf)
  const historical = cpf === baseUser.cpf ? baseTransactions : []
  const balance = user.saldo + extra.reduce((sum, transaction) => sum + transaction.valor, 0)

  return {
    user,
    saldo: balance,
    tx: [...extra, ...historical],
    txBase: historical,
  }
}

export function addTx(title, detail, value) {
  const cpf = getActiveCpf()
  const transactions = getAccountValue('tx', [], cpf)
  transactions.unshift({ titulo: title, detalhe: detail, valor: value })
  setAccountValue('tx', transactions, cpf)
}

export { getAccountValue, getInvestmentsForAccount, getSavingsGoalsForAccount, setAccountValue }
