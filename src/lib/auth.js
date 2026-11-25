// Autenticação simulada compartilhada pelas telas React.
import { store } from './store.js'
import { findUserByCpf, migrateAccountData } from './accounts.js'

export const isLogged = () => Boolean(store.get('session'))
export const login = (user) => {
  migrateAccountData(user.cpf)
  store.set('lastAccountCpf', user.cpf)
  store.set('session', { cpf: user.cpf, nome: user.nome })
}
export const authenticate = (cpf, password) => {
  const user = findUserByCpf(cpf)
  if (!user || user.senha !== password) return null
  login(user)
  return user
}
export const logout = () => {
  store.remove('session')
  window.location.href = '../index.html'
}
