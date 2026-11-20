// Tela Início: saldo, cartão e movimentações.
import { brl } from "../core/format.js";
import { getAccount } from "../core/bank.js";
import { store } from "../core/store.js";

export async function init() {
  const { user, saldo: total, tx } = await getAccount();
  const saldo = document.getElementById("saldo");
  const btn = document.getElementById("toggle-saldo");
  // Lembra se o usuário ocultou o saldo
  let hidden = store.get("saldoHidden", false);

  // Redesenha o saldo (valor ou '••••') e o rótulo do botão
  const paint = () => {
    saldo.textContent = hidden ? "R$ ••••••" : brl(total);
    btn.setAttribute("aria-pressed", hidden);
    btn.setAttribute("aria-label", hidden ? "Mostrar saldo" : "Ocultar saldo");
  };
  btn.addEventListener("click", () => { hidden = !hidden; store.set("saldoHidden", hidden); paint(); });
  paint();

  document.getElementById("nome").textContent = user.nome;
  document.getElementById("cartao-final").textContent = `FlashBank •••• ${user.cartao.final}`;
  document.getElementById("cartao-status").textContent = store.get("cartaoBloqueado", false) ? "Cartão bloqueado" : user.cartao.status;
  // Monta a lista das 5 últimas movimentações
  document.getElementById("movs").innerHTML = tx.slice(0, 5).map((t) => `
    <li class="tx"><div><strong>${t.titulo}</strong><small>${t.detalhe}</small></div>
    <span class="${t.valor < 0 ? "neg" : "pos"}">${t.valor > 0 ? "+" : ""}${brl(t.valor)}</span></li>`).join("");
  document.getElementById("steps").innerHTML = Array.from({ length: 8 }, (_, i) => `<span class="${i < 3 ? "is-on" : ""}"></span>`).join("");
}
