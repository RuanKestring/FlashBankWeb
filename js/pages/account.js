// Tela Minha conta: mostra dados mascarados e permite editar.
import { getJSON } from "../core/api.js";
import { maskCpf, maskEmail, maskPhone, toast } from "../core/format.js";
import { store } from "../core/store.js";

export async function init() {
  const base = await getJSON("user");
  const user = { ...base, ...store.get("profile", {}) };
  const ids = { nome: "f-nome", email: "f-email", telefone: "f-tel" };
  // Funções de máscara por campo
  const masks = { email: maskEmail, telefone: maskPhone };
  const inputs = Object.values(ids).map((id) => document.getElementById(id));
  const actions = document.getElementById("edit-actions");

  // Fora da edição, e-mail e celular aparecem mascarados (como no Figma)
  // Fora da edição mostra mascarado; ao editar, mostra o valor real
  const paintFields = (editing) => {
    for (const [key, id] of Object.entries(ids))
      document.getElementById(id).value = !editing && masks[key] ? masks[key](user[key]) : user[key];
  };
  const fill = () => {
    document.getElementById("acc-nome").textContent = user.nome;
    document.getElementById("acc-cpf").textContent = `CPF ${maskCpf(user.cpf)}`;
    document.getElementById("f-cpf").value = maskCpf(user.cpf);
    document.getElementById("acc-ag").textContent = user.agencia;
    document.getElementById("acc-conta").textContent = `••••${user.conta}`;
    paintFields(false);
  };
  // Liga/desliga o modo de edição
  const setEditing = (on) => {
    inputs.forEach((i) => (i.readOnly = !on));
    actions.hidden = !on;
    paintFields(on);
    if (on) inputs[0].focus();
  };

  document.getElementById("edit").addEventListener("click", () => setEditing(true));
  document.getElementById("cancel").addEventListener("click", () => setEditing(false));
  // Salva no localStorage e atualiza a tela
  document.getElementById("save").addEventListener("click", () => {
    for (const [key, id] of Object.entries(ids)) user[key] = document.getElementById(id).value.trim();
    store.set("profile", { nome: user.nome, email: user.email, telefone: user.telefone });
    fill();
    setEditing(false);
    toast("Alterações salvas.");
  });
  // Copia agência e conta para a área de transferência
  document.getElementById("share").addEventListener("click", async () => {
    const text = `FlashBank · Agência ${user.agencia} · Conta ${user.conta}`;
    try { await navigator.clipboard.writeText(text); toast("Dados copiados."); } catch { toast(text); }
  });
  fill();
}
