// Tela Investimentos: resumo, gráfico de linha em SVG (sem biblioteca), rosca em CSS e tabela.
import { getJSON } from "../core/api.js";
import { brl } from "../core/format.js";

const pct = (v) => `${v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
const mil = (v) => `${(v / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;

// Monta o SVG: linhas de grade com valores, área sob a linha, linha e ponto final
function lineChart({ labels, valores }) {
  const W = 640, H = 230, L = 52, R = 16, T = 14, B = 30;
  const min = Math.min(...valores), max = Math.max(...valores);
  const step = Math.max(100, Math.ceil((max - min) / 4 / 100) * 100);
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;
  const x = (i) => L + (i * (W - L - R)) / (valores.length - 1);
  const y = (v) => T + (1 - (v - lo) / (hi - lo || 1)) * (H - T - B);

  let grid = "";
  for (let v = lo; v <= hi; v += step) {
    grid += `<line class="grid-line" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/>
             <text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${mil(v)}</text>`;
  }
  const last = valores.length - 1;
  // Poucos pontos: mostra todos os rótulos; muitos: pula de 2 em 2 sem colar o último
  const labelsHtml = labels.map((t, i) =>
    (labels.length <= 6 || (i % 2 === 0 && i !== last - 1) || i === last)
      ? `<text x="${x(i)}" y="${H - 8}" text-anchor="middle">${t}</text>` : "").join("");
  const pts = valores.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
  const area = `M${x(0)},${y(lo)} L${pts.join(" L")} L${x(last)},${y(lo)} Z`;
  const desc = `Gráfico de linha: patrimônio de ${brl(valores[0])} em ${labels[0]} a ${brl(valores[last])} em ${labels[last]}`;

  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${desc}">
    ${grid}${labelsHtml}
    <path class="area" d="${area}"/>
    <polyline class="line" points="${pts.join(" ")}"/>
    <circle class="dot" cx="${x(last)}" cy="${y(valores[last])}" r="4.5"/></svg>`;
}

export async function init() {
  const d = await getJSON("investments");
  document.getElementById("inv-total").textContent = brl(d.total);
  document.getElementById("inv-rend").textContent = `+${brl(d.rendimento)}`;
  document.getElementById("inv-disp").textContent = brl(d.disponivel);

  // Gráfico + abas de período (aria-pressed informa a aba ativa)
  const chart = document.getElementById("chart");
  const tabs = document.querySelectorAll("#tabs button");
  const show = (range) => {
    const r = d.evolucao[range];
    chart.innerHTML = lineChart(r);
    document.getElementById("chart-sub").textContent = `Evolução ilustrativa · ${r.legenda}`;
    tabs.forEach((b) => b.setAttribute("aria-pressed", b.dataset.range === range));
  };
  tabs.forEach((b) => b.addEventListener("click", () => show(b.dataset.range)));
  show("1a");

  // Participação de cada produto (calculada a partir do saldo)
  const itens = d.itens.map((i) => ({ ...i, parte: (i.saldo / d.total) * 100 }));

  // Rosca: soma os percentuais para montar o conic-gradient
  let acc = 0;
  const stops = itens.map((i) => { const s = `${i.cor} ${acc}% ${acc + i.parte}%`; acc += i.parte; return s; });
  const donut = document.getElementById("donut");
  donut.style.background = `conic-gradient(${stops.join(", ")})`;
  donut.setAttribute("aria-label", "Distribuição da carteira: " + itens.map((i) => `${i.produto} ${pct(i.parte)}`).join(", "));
  document.getElementById("donut-n").textContent = itens.length;
  document.getElementById("legend").innerHTML = itens
    .map((i) => `<li><i style="background:${i.cor}" aria-hidden="true"></i>${i.produto}<b>${pct(i.parte)}</b></li>`).join("");
  const pendente = itens.find((i) => i.pendente);
  document.getElementById("dist-note").textContent = pendente ? `${brl(pendente.saldo)} do total ainda a classificar.` : "";

  // Tabela com o ponto colorido igual ao da legenda
  document.getElementById("inv-table").innerHTML = itens
    .map((i) => `<tr><td><span class="dot-cell"><i style="background:${i.cor}" aria-hidden="true"></i>${i.produto}</span></td><td>${brl(i.saldo)}</td><td>${pct(i.parte)}</td></tr>`).join("");
}
