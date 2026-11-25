import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import { isLogged } from '../lib/auth.js'
import { brl } from '../lib/format.js'
import { getInvestmentsForAccount } from '../lib/bank.js'
import { store } from '../lib/store.js'

const ranges = [
  { id: '1m', label: '1M' },
  { id: '6m', label: '6M' },
  { id: '1a', label: '1A' },
  { id: 'tudo', label: 'Tudo' },
]

const percent = (value) => `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
const thousands = (value) => `${(value / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mil`

function LineChart({ series }) {
  const width = 640
  const height = 230
  const left = 52
  const right = 16
  const top = 14
  const bottom = 30
  const values = series.valores
  const labels = series.labels
  const min = Math.min(...values)
  const max = Math.max(...values)
  const step = Math.max(100, Math.ceil((max - min) / 4 / 100) * 100)
  const low = Math.floor(min / step) * step
  const high = Math.ceil(max / step) * step
  const x = (index) => left + (index * (width - left - right)) / Math.max(1, values.length - 1)
  const y = (value) => top + (1 - (value - low) / (high - low || 1)) * (height - top - bottom)
  const lastIndex = values.length - 1
  const points = values.map((value, index) => `${x(index).toFixed(1)},${y(value).toFixed(1)}`)
  const areaPath = `M${x(0)},${y(low)} L${points.join(' L')} L${x(lastIndex)},${y(low)} Z`
  const description = `Gráfico de linha: patrimônio de ${brl(values[0])} em ${labels[0]} a ${brl(values[lastIndex])} em ${labels[lastIndex]}`
  const gridValues = []
  for (let value = low; value <= high; value += step) gridValues.push(value)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={description}>
      {gridValues.map((value) => (
        <g key={value}>
          <line className="grid-line" x1={left} x2={width - right} y1={y(value)} y2={y(value)} />
          <text x={left - 8} y={y(value) + 4} textAnchor="end">{thousands(value)}</text>
        </g>
      ))}
      {labels.map((label, index) => {
        const shouldShow = labels.length <= 6 || (index % 2 === 0 && index !== lastIndex - 1) || index === lastIndex
        return shouldShow ? (
          <text key={`${label}-${index}`} x={x(index)} y={height - 8} textAnchor="middle">{label}</text>
        ) : null
      })}
      <path className="area" d={areaPath} />
      <polyline className="line" points={points.join(' ')} />
      <circle className="dot" cx={x(lastIndex)} cy={y(values[lastIndex])} r="4.5" />
    </svg>
  )
}

function InvestmentsPage() {
  const data = getInvestmentsForAccount()
  const [range, setRange] = useState('1a')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!isLogged()) {
      window.location.replace('../index.html')
      return undefined
    }

  }, [])

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(''), 2500)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const notifyComingSoon = (event) => {
    event.preventDefault()
    setNotice('Esta opção chega em breve.')
  }
  const userName = store.get('session')?.nome ?? 'Cliente'

  return (
    <AppShell activePage="investments" userName={userName} onNotify={setNotice} notice={notice}>
      <main className="content" id="conteudo" tabIndex="-1">
        <>
            <div className="page-head">
              <div>
                <h1>Investimentos</h1>
                <p className="muted">Acompanhe sua carteira e planeje seus próximos passos.</p>
              </div>
              <div className="page-head__actions">
                <button className="btn btn--outline" type="button" onClick={() => setNotice('Resgates chegam em breve.')}>Resgatar</button>
                <button className="btn btn--primary" type="button" onClick={() => setNotice('Novos investimentos chegam em breve.')}>Investir mais</button>
              </div>
            </div>

            <div className="grid grid--3">
              <section className="card card--olive stat" aria-label="Total investido">
                <small>Total investido</small><strong>{brl(data.total)}</strong>
              </section>
              <section className="card stat stat--accent" aria-label="Rendimento nos últimos 12 meses">
                <small>Rendimento nos últimos 12 meses</small><strong>+{brl(data.rendimento)}</strong>
              </section>
              <section className="card stat" aria-label="Disponível na conta investimento">
                <small>Disponível na conta investimento</small><strong>{brl(data.disponivel)}</strong>
              </section>
            </div>

            <div className="grid grid--2">
              <section className="card chart" aria-labelledby="t-evolucao">
                <div className="card__head">
                  <div><h2 id="t-evolucao">Evolução do patrimônio</h2><small>Evolução ilustrativa · {data.evolucao[range].legenda}</small></div>
                  <div className="tabs" role="group" aria-label="Período do gráfico">
                    {ranges.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={range === item.id}
                        onClick={() => setRange(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <LineChart series={data.evolucao[range]} />
              </section>

              <section className="card" aria-labelledby="t-dist">
                <div><h2 id="t-dist">Distribuição da carteira</h2><small>Participação no total investido</small></div>
                <div className="donut-wrap">
                  <div
                    className="donut"
                    role="img"
                    aria-label={`Distribuição da carteira: ${data.itens.map((item) => `${item.produto} ${percent(data.total ? (item.saldo / data.total) * 100 : 0)}`).join(', ')}`}
                    style={{ background: data.total ? `conic-gradient(${data.itens.reduce((stops, item) => {
                      const portion = (item.saldo / data.total) * 100
                      const start = stops.position
                      stops.parts.push(`${item.cor} ${start}% ${start + portion}%`)
                      stops.position += portion
                      return stops
                    }, { parts: [], position: 0 }).parts.join(', ')})` : 'var(--olive-100)' }}
                  >
                    <div className="donut__center"><strong>{data.itens.length}</strong><small>categorias</small></div>
                  </div>
                  <ul className="legend">
                    {data.itens.map((item) => (
                      <li key={item.produto}>
                        <i style={{ backgroundColor: item.cor }} aria-hidden="true" />
                        {item.produto}
                        <b>{percent(data.total ? (item.saldo / data.total) * 100 : 0)}</b>
                      </li>
                    ))}
                  </ul>
                </div>
                <small>
                  {(() => {
                    const pendingItem = data.itens.find((item) => item.pendente)
                    return pendingItem ? `${brl(pendingItem.saldo)} do total ainda a classificar.` : ''
                  })()}
                </small>
              </section>
            </div>

            <div className="grid grid--2">
              <section className="card" aria-labelledby="t-meus">
                <div className="card__head">
                  <h2 id="t-meus">Meus investimentos</h2>
                  <a className="link" href="#detalhes" onClick={notifyComingSoon}>Ver detalhes <span aria-hidden="true">↗</span></a>
                </div>
                <table className="table">
                  <thead><tr><th scope="col">Produto</th><th scope="col">Saldo atual</th><th scope="col">Participação</th></tr></thead>
                  <tbody>
                    {data.itens.map((item) => (
                      <tr key={item.produto}>
                        <td><span className="dot-cell"><i style={{ backgroundColor: item.cor }} aria-hidden="true" />{item.produto}</span></td>
                        <td>{brl(item.saldo)}</td>
                        <td>{percent(data.total ? (item.saldo / data.total) * 100 : 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
              <section className="card card--muted next-step" aria-labelledby="t-next">
                <h2 className="title-icon" id="t-next">
                  <span className="icon icon--lg" data-icon="crescimento" aria-hidden="true" />
                  O próximo passo é seu.
                </h2>
                <p className="muted">Encontre opções que combinam com seus objetivos e seu momento de vida.</p>
                <a className="link card-link" href="#explorar" onClick={notifyComingSoon}>Explorar investimentos</a>
              </section>
            </div>
        </>
      </main>
    </AppShell>
  )
}

export default InvestmentsPage
