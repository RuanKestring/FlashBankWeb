// Acesso aos dados. Hoje lê JSONs locais; para usar uma API real, troque só este arquivo.
// Prefixo dos caminhos: '' no index e '../' nas páginas dentro de /pages
export const root = document.body.dataset.root || "";
// Lê data/<nome>.json
export const getJSON = async (name) => (await fetch(`${root}data/${name}.json`)).json();
// Lê um arquivo de texto (usado nos partials HTML)
export const getText = async (path) => (await fetch(`${root}${path}`)).text();
