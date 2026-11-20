// Monta o menu lateral e o cabeçalho nas telas internas.
import { root, getText, getJSON } from "../core/api.js";
import { logout } from "../core/auth.js";
import { toast } from "../core/format.js";

// Carrega partials e dados do usuário em paralelo e injeta no HTML
export async function mountShell(page) {
  const [side, top, user] = await Promise.all([getText("partials/sidebar.html"), getText("partials/topbar.html"), getJSON("user")]);
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = side.replaceAll("{{root}}", root);
  document.getElementById("topbar").innerHTML = top.replaceAll("{{root}}", root);
  document.getElementById("user-name").textContent = user.nome;

  // Marca o item do menu da página atual (visual + aria-current)
  const current = document.querySelector(`[data-nav="${page}"]`);
  current?.classList.add("is-active");
  current?.setAttribute("aria-current", "page");

  // Acessibilidade: pular para o conteúdo
  const main = document.querySelector("main");
  main.id = "conteudo";
  main.tabIndex = -1;
  document.body.prepend(Object.assign(document.createElement("a"), { className: "skip-link", href: "#conteudo", textContent: "Ir para o conteúdo" }));

  // Menu em gaveta (celular/tablet)
  const btn = document.getElementById("menu-toggle");
  const backdrop = Object.assign(document.createElement("div"), { className: "backdrop", hidden: true });
  document.body.append(backdrop);
  // Abre/fecha a gaveta do menu e atualiza os atributos de acessibilidade
  const setOpen = (open) => {
    sidebar.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    backdrop.hidden = !open;
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    if (open) sidebar.querySelector("a")?.focus();
  };
  btn.addEventListener("click", () => setOpen(!sidebar.classList.contains("is-open")));
  backdrop.addEventListener("click", () => setOpen(false));
  // Tecla Esc fecha o menu e devolve o foco ao botão
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("is-open")) { setOpen(false); btn.focus(); }
  });
  // Se a tela voltar a ser larga, fecha a gaveta
  matchMedia("(min-width: 901px)").addEventListener("change", (e) => e.matches && setOpen(false));

  // Botão 'Sair da conta'
  document.getElementById("logout").addEventListener("click", logout);
  document.getElementById("search-form").addEventListener("submit", (e) => { e.preventDefault(); toast("A busca chega em breve."); });
  // Itens marcados com data-soon mostram 'chega em breve'
  document.querySelectorAll("[data-soon]").forEach((el) =>
    el.addEventListener("click", (e) => { e.preventDefault(); toast("Esta tela chega em breve."); }));
}
