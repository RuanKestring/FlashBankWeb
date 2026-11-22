// Autenticação simulada compartilhada pelas telas React.
import { store } from './store.js'

export const isLogged = () => Boolean(store.get('session'))
export const login = (user) => store.set('session', { cpf: user.cpf, nome: user.nome })
export const logout = () => {
  store.remove('session')
  window.location.href = '../index.html'
}
