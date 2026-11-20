// Tela de login: máscara de CPF, validação e redirecionamento.
import { getJSON } from "../core/api.js";
import { login, isLogged } from "../core/auth.js";
import { digits, formatCpf, toast } from "../core/format.js";

export async function init() {
  // Quem já está logado vai direto para a Home
  if (isLogged()) { location.href = "pages/home.html"; return; }
  const form = document.getElementById("login-form");
  const cpf = document.getElementById("cpf");
  const senha = document.getElementById("senha");
  const error = document.getElementById("login-error");

  // Aplica a máscara enquanto digita
  cpf.addEventListener("input", () => (cpf.value = formatCpf(cpf.value)));
  // Mostrar/ocultar senha e atualizar o rótulo para leitores de tela
  document.getElementById("toggle-senha").addEventListener("click", () => {
    const show = senha.type === "password";
    senha.type = show ? "text" : "password";
    const t = document.getElementById("toggle-senha");
    t.setAttribute("aria-pressed", show);
    t.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
  });
  document.getElementById("faceid").addEventListener("click", () => toast("Face ID disponível em breve."));

  // Ao enviar valida, compara com data/user.json e entra
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    error.textContent = "";
    if (digits(cpf.value).length !== 11) { error.textContent = "Digite um CPF com 11 números."; return; }
    if (!senha.value) { error.textContent = "Digite sua senha."; return; }
    const user = await getJSON("user");
    if (digits(cpf.value) !== user.cpf || senha.value !== user.senha) {
      error.textContent = "CPF ou senha incorretos. Confira os dados e tente de novo.";
      return;
    }
    login(user);
    location.href = "pages/home.html";
  });
}
