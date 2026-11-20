import { requireAuth } from "./core/auth.js";
import { mountShell } from "./components/shell.js";
const page = document.body.dataset.page;
// Telas internas: exige login e monta menu e cabeçalho
if (page !== "login") {
  requireAuth();
  await mountShell(page);
}
const mod = await import(`./pages/${page}.js`);
mod.init();
