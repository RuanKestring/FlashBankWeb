// Tela Início: saldo, cartão e movimentações.
import { brl } from "../core/format.js";
import { getAccount } from "../core/bank.js";
import { store } from "../core/store.js";
import { root } from "../core/api.js";

// 'Pequenos passos': quantas barrinhas estão preenchidas (de 8)
const STEPS_TOTAL = 8;
const STEPS_DONE = 5;

// Carrinho e carro vêm prontos do Figma (já com o quadradinho); os demais usam o ícone do menu (data-icon) dentro do quadradinho
const TX_IMAGES = { carrinho: "icon-carrinho-compra.svg", carro: "icon-carro.svg" };
// Usa o 'icone' do JSON; nas movimentações criadas pelo usuário (Pix, cofrinho) deduz pelo título
const txIcon = (t) => {
  if (t.icone) return t.icone;
  const nome = t.titulo.toLowerCase();
  if (nome.startsWith("pix")) return "pix";
  if (nome.startsWith("cofrinho")) return "cofrinho";
  return t.valor > 0 ? "dinheiro" : "cartao";
};
// Ícone da movimentação: imagem pronta (carrinho/carro) ou quadradinho com o ícone do menu
const txIconHtml = (t) => {
  const tipo = txIcon(t);
  return TX_IMAGES[tipo]
    ? `<img class="tx__icon" src="${root}assets/icons/${TX_IMAGES[tipo]}" alt="" width="40" height="40">`
    : `<span class="tx__icon tx__icon--tile" aria-hidden="true"><span class="icon" data-icon="${tipo}"></span></span>`;
};
// Evita que texto digitado pelo usuário (ex.: chave Pix) vire HTML
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export async function init() {
  const { user, saldo: total, txBase } = await getAccount();
  const saldo = document.getElementById("saldo");
  const btn = document.getElementById("toggle-saldo");
  const olhoAberto = document.getElementById("saldo-olho");
  const olhoFechado = document.getElementById("saldo-olho-fechado");
  // Lembra se o usuário ocultou o saldo
  let hidden = store.get("saldoHidden", false);

  // Redesenha o saldo (valor ou '••••'), o ícone do olho e o rótulo do botão
  const paint = () => {
    saldo.textContent = hidden ? "R$ ••••••" : brl(total);
    // SVG não tem a propriedade .hidden, então usa o atributo
    olhoAberto.toggleAttribute("hidden", hidden);
    olhoFechado.toggleAttribute("hidden", !hidden);
    btn.setAttribute("aria-pressed", hidden);
    btn.setAttribute("aria-label", hidden ? "Mostrar saldo" : "Ocultar saldo");
  };
  btn.addEventListener("click", () => { hidden = !hidden; store.set("saldoHidden", hidden); paint(); });
  paint();

  // Variação do mês (ex.: +4,8% este mês); some se o dado não existir
  const variacao = document.getElementById("saldo-variacao");
  if (typeof user.variacaoMes === "number") {
    const pct = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, signDisplay: "exceptZero" }).format(user.variacaoMes);
    document.getElementById("saldo-variacao-texto").textContent = `${pct}% este mês`;
  } else variacao.hidden = true;

  // Saudação só com o primeiro nome
  document.getElementById("nome").textContent = user.nome.split(" ")[0];
  document.getElementById("cartao-final").textContent = `FlashBank •••• ${user.cartao.final}`;
  document.getElementById("cartao-status").textContent = store.get("cartaoBloqueado", false) ? "Cartão bloqueado" : user.cartao.status;

  // Monta a lista das 3 últimas movimentações do Figma: ícone, título + quando, categoria e valor
  document.getElementById("movs").innerHTML = txBase.slice(0, 3).map((t) => {
    const [quando, categoria = ""] = t.detalhe.split(" · ");
    return `
    <li class="tx">
      ${txIconHtml(t)}
      <div class="tx__info"><strong>${esc(t.titulo)}</strong><small>${esc(quando)}</small></div>
      <span class="tx__cat">${esc(categoria)}</span>
      <span class="tx__valor ${t.valor < 0 ? "neg" : "pos"}">${t.valor > 0 ? "+" : ""}${brl(t.valor)}</span>
    </li>`;
  }).join("");

  const steps = document.getElementById("steps");
  steps.setAttribute("role", "img");
  steps.setAttribute("aria-label", `${STEPS_DONE} de ${STEPS_TOTAL} passos concluídos`);
  steps.innerHTML = Array.from({ length: STEPS_TOTAL }, (_, i) => `<span class="${i < STEPS_DONE ? "is-on" : ""}"></span>`).join("");
}
