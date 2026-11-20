// Tela Cartões: dados do cartão, fatura e bloqueio.
import { brl } from "../core/format.js";
import { getAccount } from "../core/bank.js";
import { store } from "../core/store.js";

export async function init() {
  const { user } = await getAccount();
  const c = user.cartao;
  const visual = document.getElementById("card-visual");
  const toggle = document.getElementById("card-toggle");
  // Estado de bloqueio salvo no navegador
  let blocked = store.get("cartaoBloqueado", false);

  document.getElementById("card-num").textContent = `•••• •••• •••• ${c.final}`;
  document.getElementById("card-fatura").textContent = brl(c.fatura);
  document.getElementById("card-venc").textContent = `Vence em ${c.vencimento}`;
  document.getElementById("card-bar").style.width = `${Math.min(100, (c.fatura / c.limite) * 100)}%`;
  document.getElementById("card-limite").textContent = `Limite total: ${brl(c.limite)}`;

  const paint = () => {
    visual.classList.toggle("is-blocked", blocked);
    document.getElementById("card-status").textContent = blocked ? "Cartão bloqueado" : c.status;
    toggle.textContent = blocked ? "Desbloquear cartão" : "Bloquear cartão";
  };
  // Alterna bloquear/desbloquear
  toggle.addEventListener("click", () => { blocked = !blocked; store.set("cartaoBloqueado", blocked); paint(); });
  paint();
}
