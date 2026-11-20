// Tela de login: conta salva (CPF mascarado), "Trocar conta", validação e redirecionamento.
import { getJSON } from "../core/api.js";
import { login, isLogged } from "../core/auth.js";
import { digits, formatCpf, maskCpf, toast } from "../core/format.js";

// Chamada pelo app.js ao abrir a página
export async function init() {
  // Quem já está logado vai direto para a Home
  if (isLogged()) { location.href = "pages/home.html"; return; }

  const user = await getJSON("user");
  const form = document.getElementById("login-form");
  const cpf = document.getElementById("cpf");
  const senha = document.getElementById("senha");
  const error = document.getElementById("login-error");
  let useSaved = true; // true = usa o CPF da conta salva; false = o usuário digita outro

  // Preenche o cumprimento e o CPF mascarado a partir dos dados do usuário
  document.getElementById("greet").textContent = `Olá, ${user.nome}`;
  document.getElementById("cpf-masked").textContent = maskCpf(user.cpf);

  // "Trocar conta": esconde o resumo e mostra o campo de CPF
  document.getElementById("switch-account").addEventListener("click", () => {
    useSaved = false;
    document.getElementById("saved-account").hidden = true;
    document.getElementById("cpf-field").hidden = false;
    document.getElementById("greet").textContent = "Olá!";
    document.getElementById("greet-sub").textContent = "Digite seu CPF para entrar.";
    cpf.focus();
  });

  // Máscara de CPF enquanto digita
  cpf.addEventListener("input", () => (cpf.value = formatCpf(cpf.value)));

  // Mostrar/ocultar senha: troca o tipo do campo, o ícone e o rótulo (leitores de tela)
  const toggle = document.getElementById("toggle-senha");
  toggle.addEventListener("click", () => {
    const show = senha.type === "password";
    senha.type = show ? "text" : "password";
    toggle.setAttribute("aria-pressed", show);
    toggle.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
    toggle.querySelector(".eye-on").hidden = !show;
    toggle.querySelector(".eye-off").hidden = show;
  });

  document.getElementById("faceid").addEventListener("click", () => toast("Face ID disponível em breve."));
  document.querySelectorAll("[data-soon]").forEach((el) =>
    el.addEventListener("click", (e) => { e.preventDefault(); toast("Esta função chega em breve."); }));

  // Ao enviar: valida e compara com data/user.json
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    error.textContent = "";
    const typed = useSaved ? user.cpf : digits(cpf.value);
    if (typed.length !== 11) { error.textContent = "Digite um CPF com 11 números."; cpf.focus(); return; }
    if (!senha.value) { error.textContent = "Digite sua senha."; senha.focus(); return; }
    if (typed !== user.cpf || senha.value !== user.senha) {
      error.textContent = "CPF ou senha incorretos. Confira os dados e tente de novo.";
      return;
    }
    login(user);
    location.href = "pages/home.html";
  });
}
