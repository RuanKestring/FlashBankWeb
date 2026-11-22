// Autenticação simulada compartilhada pelas páginas React e legadas.
import { root } from './api.js'
import { store } from './store.js'

export const isLogged = () => Boolean(store.get('session'))
export const login = (user) => store.set('session', { cpf: user.cpf, nome: user.nome })
export const logout = () => {
  store.remove('session')
  window.location.href = `${root}index.html`
}
export const requireAuth = () => {
  if (!isLogged()) window.location.href = `${root}index.html`
}
