// Tela Investimentos: resumo, gráfico de linha em SVG, rosca em CSS e tabela.
import { getJSON } from "../core/api.js";
import { brl } from "../core/format.js";

// Converte os valores em pontos
function lineChart(values) {
  const w = 600, h = 180, pad = 10;
  const min = Math.min(...values), max = Math.max(...values);
  const pts = values.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / (values.length - 1);
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Evolução do patrimônio">
    <polyline points="${pts.join(" ")}" fill="none" stroke="#5b5f2a" stroke-width="3" stroke-linejoin="round"/></svg>`;
}

export async function init() {
  const d = await getJSON("investments");
  document.getElementById("inv-total").textContent = brl(d.total);
  document.getElementById("inv-rend").textContent = `+${brl(d.rendimento)}`;
  document.getElementById("inv-disp").textContent = brl(d.disponivel);

  const chart = document.getElementById("chart");
  const tabs = document.querySelectorAll("#tabs button");
  // Troca o período do gráfico e marca a aba ativa
  const show = (range) => {
    chart.innerHTML = lineChart(d.evolucao[range]);
    tabs.forEach((b) => b.classList.toggle("is-active", b.dataset.range === range));
  };
  tabs.forEach((b) => b.addEventListener("click", () => show(b.dataset.range)));
  show("1a");

  // Monta o conic-gradient da rosca somando os percentuais
  let acc = 0;
  const stops = d.distribuicao.map((i) => { const s = `${i.cor} ${acc}% ${acc + i.pct}%`; acc += i.pct; return s; });
  document.getElementById("donut").style.background = `conic-gradient(${stops.join(", ")})`;
  document.getElementById("legend").innerHTML = d.distribuicao
    .map((i) => `<li><i style="background:${i.cor}"></i>${i.nome}<b>${i.pct}%</b></li>`).join("");
  document.getElementById("inv-table").innerHTML = d.itens
    .map((i) => `<tr><td>${i.produto}</td><td>${brl(i.aplicado)}</td><td>${i.participacao}</td></tr>`).join("");
}
