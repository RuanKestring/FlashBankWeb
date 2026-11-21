// Camada de dados da conta: junta os JSONs (base) com o que o usuário fez (localStorage).
import { getJSON } from "./api.js";
import { store } from "./store.js";

// Junta os dados base (JSON) com o que o usuário fez (localStorage)
// Retorna usuário, saldo atual e movimentações já com as ações feitas (txBase = só as do JSON, sem as feitas pelo usuário)
export async function getAccount() {
  const [base, tx] = await Promise.all([getJSON("user"), getJSON("transactions")]);
  const extra = store.get("tx", []);
  // Saldo = saldo inicial + soma das movimentações novas (negativas são saídas)
  const saldo = base.saldo + extra.reduce((sum, t) => sum + t.valor, 0);
  return { user: { ...base, ...store.get("profile", {}) }, saldo, tx: [...extra, ...tx], txBase: tx };
}

// Registra uma movimentação nova (Pix, cofrinho) no topo da lista
export function addTx(titulo, detalhe, valor) {
  const list = store.get("tx", []);
  list.unshift({ titulo, detalhe, valor });
  store.set("tx", list);
}
