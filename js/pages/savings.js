// Tela Cofrinhos progresso e depósito.
import { getJSON } from "../core/api.js";
import { brl, toast } from "../core/format.js";
import { getAccount, addTx } from "../core/bank.js";
import { store } from "../core/store.js";

export async function init() {
  const base = await getJSON("cofrinhos");
  const list = document.getElementById("cofrinhos");
  const select = document.getElementById("cof-select");
  const saldoEl = document.getElementById("cof-saldo");
  const error = document.getElementById("cof-error");
  const ok = document.getElementById("cof-ok");

  // Soma o valor base do JSON com o que já foi guardado
  const items = () => { const extra = store.get("cofrinhos", {}); return base.map((c) => ({ ...c, guardado: c.guardado + (extra[c.id] || 0) })); };
  const paint = async () => {
    list.innerHTML = items().map((c) => `
      <li class="row"><div class="stack" style="flex:1"><div class="card__head"><strong>${c.nome}</strong><small>${brl(c.guardado)} de ${brl(c.meta)}</small></div>
      <div class="progress"><i style="width:${Math.min(100, (c.guardado / c.meta) * 100)}%"></i></div></div></li>`).join("");
    saldoEl.textContent = brl((await getAccount()).saldo);
  };
  // Preenche o seletor com os cofrinhos
  select.innerHTML = base.map((c) => `<option value="${c.id}">${c.nome}</option>`).join("");

  // Valida o valor, atualiza o cofrinho e desconta do saldo
  document.getElementById("cof-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    error.textContent = ok.textContent = "";
    const valor = Number(document.getElementById("cof-valor").value);
    const saldo = (await getAccount()).saldo;
    if (!(valor > 0)) { error.textContent = "Digite um valor maior que zero."; return; }
    if (valor > saldo) { error.textContent = `Saldo insuficiente. Você tem ${brl(saldo)}.`; return; }
    const extra = store.get("cofrinhos", {});
    extra[select.value] = (extra[select.value] || 0) + valor;
    store.set("cofrinhos", extra);
    addTx(`Cofrinho ${select.selectedOptions[0].text}`, "Agora · Dinheiro guardado", -valor);
    e.target.reset();
    ok.textContent = `${brl(valor)} guardados.`;
    toast("Dinheiro guardado.");
    paint();
  });
  paint();
}
