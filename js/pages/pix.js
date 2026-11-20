// Tela Pix - envia e desconta do saldo.
import { brl, toast } from "../core/format.js";
import { getAccount, addTx } from "../core/bank.js";

export async function init() {
  const { user, saldo } = await getAccount();
  document.getElementById("pix-saldo").textContent = brl(saldo);
  document.getElementById("pix-chaves").innerHTML = user.chavesPix
    .map((c) => `<li class="row"><span>${c.tipo}</span><strong>${c.valor}</strong></li>`).join("");

  const error = document.getElementById("pix-error");
  const ok = document.getElementById("pix-ok");
  // Valida chave, valor e saldo antes de enviar
  document.getElementById("pix-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    error.textContent = ok.textContent = "";
    const chave = document.getElementById("pix-chave").value.trim();
    const valor = Number(document.getElementById("pix-valor").value);
    const atual = (await getAccount()).saldo;
    if (!chave) { error.textContent = "Digite a chave do destinatário."; return; }
    if (!(valor > 0)) { error.textContent = "Digite um valor maior que zero."; return; }
    if (valor > atual) { error.textContent = `Saldo insuficiente. Você tem ${brl(atual)}.`; return; }
    // Registra a saída; aparece nas movimentações da Home
    addTx(`Pix para ${chave}`, "Agora · Pix enviado", -valor);
    document.getElementById("pix-saldo").textContent = brl(atual - valor);
    e.target.reset();
    ok.textContent = `Pix de ${brl(valor)} enviado.`;
    toast("Pix enviado.");
  });
}
