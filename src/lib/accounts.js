import baseSavings from '../data/cofrinhos.json'
import baseInvestments from '../data/investments.json'
import demoUser from '../data/user.json'
import { digits, maskCpf } from './format.js'
import { store } from './store.js'

const demoCpf = digits(demoUser.cpf)
const accountKey = (cpf, key) => `account:${digits(cpf)}:${key}`

const legacyKeys = [
  ['tx', 'tx'],
  ['profile', 'profile'],
  ['cartaoBloqueado', 'cardBlocked'],
  ['cofrinhos', 'savings'],
  ['saldoHidden', 'balanceHidden'],
]

function migrateDemoData() {
  if (store.get('demoDataScopedV1', false)) return

  for (const [oldKey, newKey] of legacyKeys) {
    const scopedKey = accountKey(demoCpf, newKey)
    if (store.has(oldKey) && !store.has(scopedKey)) {
      store.set(scopedKey, store.get(oldKey))
    }
    store.remove(oldKey)
  }

  store.set('demoDataScopedV1', true)
}

export function getActiveCpf() {
  return digits(store.get('session')?.cpf ?? demoCpf)
}

export function getAccountValue(key, fallback = null, cpf = getActiveCpf()) {
  if (digits(cpf) === demoCpf) migrateDemoData()
  return store.get(accountKey(cpf, key), fallback)
}

export function setAccountValue(key, value, cpf = getActiveCpf()) {
  if (digits(cpf) === demoCpf) migrateDemoData()
  return store.set(accountKey(cpf, key), value)
}

export function migrateAccountData(cpf) {
  if (digits(cpf) === demoCpf) migrateDemoData()
}

export function findUserByCpf(value) {
  const cpf = digits(value)
  if (cpf === demoCpf) {
    return { ...demoUser, ...getAccountValue('profile', {}, cpf) }
  }

  const users = store.get('accounts', {})
  const user = users[cpf]
  if (!user) return null
  return { ...user, ...getAccountValue('profile', {}, cpf) }
}

export function getDefaultLoginUser() {
  return findUserByCpf(store.get('lastAccountCpf', demoCpf)) ?? demoUser
}

export function isValidCpf(value) {
  const cpf = digits(value)
  if (cpf.length !== 11 || /^([0-9])\1{10}$/.test(cpf)) return false

  const calculateDigit = (numbers, weight) => {
    const sum = numbers.split('').reduce((total, number, index) => total + Number(number) * (weight - index), 0)
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  return calculateDigit(cpf.slice(0, 9), 10) === Number(cpf[9])
    && calculateDigit(cpf.slice(0, 10), 11) === Number(cpf[10])
}

function emptyInvestments() {
  return {
    total: 0,
    rendimento: 0,
    disponivel: 0,
    evolucao: Object.fromEntries(Object.entries(baseInvestments.evolucao).map(([range, series]) => [
      range,
      { ...series, valores: series.valores.map(() => 0) },
    ])),
    itens: baseInvestments.itens.map((item) => ({ ...item, saldo: 0 })),
  }
}

export function registerAccount({ nome, cpf: cpfValue, email, telefone, senha }) {
  const cpf = digits(cpfValue)
  if (!isValidCpf(cpf)) throw new Error('Informe um CPF válido.')
  if (findUserByCpf(cpf)) throw new Error('Já existe uma conta com esse CPF.')

  const users = store.get('accounts', {})
  const accountNumber = String(Object.keys(users).length + 1).padStart(4, '0')
  const user = {
    nome: nome.trim(),
    cpf,
    senha,
    email: email.trim(),
    telefone: telefone.trim(),
    agencia: '0001',
    conta: `${accountNumber}-0`,
    saldo: 0,
    variacaoMes: 0,
    cartao: {
      final: cpf.slice(-4),
      status: 'Ativo · pronto para usar',
      limite: 3000,
      fatura: 0,
      vencimento: '10/12',
    },
    credito: { limite: 1000, taxa: 2.5 },
    chavesPix: [
      { tipo: 'CPF', valor: maskCpf(cpf) },
      { tipo: 'E-mail', valor: email.trim() },
      { tipo: 'Celular', valor: telefone.trim() },
    ],
  }

  users[cpf] = user
  if (!store.set('accounts', users)) throw new Error('Não foi possível salvar a conta neste navegador.')

  setAccountValue('profile', { nome: user.nome, email: user.email, telefone: user.telefone }, cpf)
  setAccountValue('tx', [], cpf)
  setAccountValue('cardBlocked', false, cpf)
  setAccountValue('balanceHidden', false, cpf)
  setAccountValue('savings', {}, cpf)
  setAccountValue('investments', emptyInvestments(), cpf)
  setAccountValue('savingsGoals', baseSavings.map((goal) => ({ ...goal, guardado: 0 })), cpf)

  return user
}

export function getInvestmentsForAccount(cpf = getActiveCpf()) {
  const fallback = digits(cpf) === demoCpf ? baseInvestments : emptyInvestments()
  return getAccountValue('investments', fallback, cpf)
}

export function getSavingsGoalsForAccount(cpf = getActiveCpf()) {
  const fallback = digits(cpf) === demoCpf
    ? baseSavings
    : baseSavings.map((goal) => ({ ...goal, guardado: 0 }))
  return getAccountValue('savingsGoals', fallback, cpf)
}
