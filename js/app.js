// Ponto de entrada de TODAS as páginas: decide o que carregar conforme data-page do <body>.
import { requireAuth } from "./core/auth.js";
import { mountShell } from "./components/shell.js";

// Nome da página atual (ex.: 'home')
const page = document.body.dataset.page;

// Telas internas: exige login e monta menu e cabeçalho
if (page !== "login") {
  requireAuth();
  await mountShell(page);
}
// Carrega só o módulo da página (js/pages/<nome>.js) e roda o init()
const mod = await import(`./pages/${page}.js`);
mod.init();
