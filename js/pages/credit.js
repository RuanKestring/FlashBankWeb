// Tela Crédito: simulador de parcelas .
import { brl } from "../core/format.js";
import { getAccount } from "../core/bank.js";

export async function init() {
  const { user } = await getAccount();
  const { limite, taxa } = user.credito;
  document.getElementById("cr-limite").textContent = brl(limite);
  document.getElementById("cr-taxa").textContent = `${String(taxa).replace(".", ",")}% ao mês`;

  const error = document.getElementById("cr-error");
  const result = document.getElementById("cr-result");
  document.getElementById("cr-form").addEventListener("submit", (e) => {
    e.preventDefault();
    error.textContent = "";
    result.hidden = true;
    const valor = Number(document.getElementById("cr-valor").value);
    const n = Number(document.getElementById("cr-parcelas").value);
    if (!(valor >= 100)) { error.textContent = "O valor mínimo é R$ 100,00."; return; }
    if (valor > limite) { error.textContent = `O valor máximo é ${brl(limite)}.`; return; }
    // Fórmula da parcela fixa -  P·i / (1 − (1+i)^−n)
    const i = taxa / 100;
    const parcela = (valor * i) / (1 - Math.pow(1 + i, -n));
    result.hidden = false;
    result.innerHTML = `<small>Parcela estimada</small><strong>${n}x de ${brl(parcela)}</strong>
      <small>Total a pagar: ${brl(parcela * n)}. Simulação de exemplo, sem valor contratual.</small>`;
  });
}
