// Sessão do usuário (simulada, sem servidor).
import { root } from "./api.js";
import { store } from "./store.js";

// Existe sessão salva?
export const isLogged = () => Boolean(store.get("session"));
// Grava a sessão após validar CPF e senha
export const login = (user) => store.set("session", { cpf: user.cpf, nome: user.nome });
// Apaga a sessão e volta para o login
export const logout = () => { store.remove("session"); location.href = `${root}index.html`; };
// Barra quem não está logado: redireciona ao login
export const requireAuth = () => { if (!isLogged()) location.href = `${root}index.html`; };
