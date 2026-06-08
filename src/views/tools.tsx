import { useMemo, useState } from 'preact/hooks';
import { navigate } from '../lib/router';
import { europeanWaterfall, dealByDeal, type Deal } from '../lib/waterfall';
import { BackLink } from './learn';

const TOOLS = [
  { id: 'waterfall', icon: '💧', title: 'Distribution Waterfall', note: 'European & deal-by-deal, catch-up, clawback', ready: true },
  { id: 'pme', icon: '📈', title: 'IRR / MOIC / PME', note: 'Performance metrics calculator', ready: false },
  { id: 'pacing', icon: '🌊', title: 'Takahashi–Alexander Pacing', note: 'Commitment pacing & J-curve simulator', ready: false },
  { id: 'lbo', icon: '🏗️', title: 'Mini-LBO Model', note: 'Sources & uses → returns → value bridge', ready: false },
];

export function Tools() {
  return (
    <section>
      <h1>Interactive tools</h1>
      <p class="muted">Hands-on calculators that mirror the worked examples in the lessons.</p>
      <ul class="list">
        {TOOLS.map((t) => (
          <li
            key={t.id}
            class={t.ready ? '' : 'disabled'}
            onClick={() => t.ready && navigate(`tools/${t.id}`)}
          >
            <span>
              {t.icon} {t.title}
              <br />
              <span class="muted small">{t.note}</span>
            </span>
            {t.ready ? <span class="pill ok">open</span> : <span class="soon">soon</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------- Distribution Waterfall calculator ----------
const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (n: number) => (n * 100).toFixed(1) + '%';

type Mode = 'european' | 'dealbydeal';
const CATCHUPS = [
  { label: 'Full (100%)', value: 1 },
  { label: 'Partial (50%)', value: 0.5 },
  { label: 'None / hard hurdle', value: 0 },
];

export function WaterfallTool() {
  const [mode, setMode] = useState<Mode>('european');
  const [capital, setCapital] = useState('100');
  const [years, setYears] = useState('5');
  const [dist, setDist] = useState('200');
  const [hurdle, setHurdle] = useState('8');
  const [carry, setCarry] = useState('20');
  const [catchup, setCatchup] = useState(1);
  const [deals, setDeals] = useState<Deal[]>([
    { cost: 50, proceeds: 150, years: 3 },
    { cost: 50, proceeds: 20, years: 5 },
  ]);

  const h = (parseFloat(hurdle) || 0) / 100;
  const c = (parseFloat(carry) || 0) / 100;

  const euro = useMemo(
    () =>
      europeanWaterfall({
        capital: parseFloat(capital) || 0,
        years: parseFloat(years) || 0,
        distribution: parseFloat(dist) || 0,
        hurdle: h,
        carry: c,
        catchupShare: catchup,
      }),
    [capital, years, dist, h, c, catchup],
  );

  const dbd = useMemo(
    () => dealByDeal(deals, { hurdle: h, carry: c, catchupShare: catchup }),
    [deals, h, c, catchup],
  );

  return (
    <section>
      <BackLink to="tools" label="Tools" />
      <h1>Distribution Waterfall</h1>
      <p class="muted small">All amounts in $M. Single drawdown at t=0.</p>

      <div class="segmented">
        <button class={mode === 'european' ? 'active' : ''} onClick={() => setMode('european')}>
          European
        </button>
        <button class={mode === 'dealbydeal' ? 'active' : ''} onClick={() => setMode('dealbydeal')}>
          Deal-by-deal
        </button>
      </div>

      <div class="controls">
        <Field label="Hurdle %" value={hurdle} onChange={setHurdle} />
        <Field label="Carry %" value={carry} onChange={setCarry} />
        <label class="field">
          <span>Catch-up</span>
          <select
            value={String(catchup)}
            onChange={(e) => setCatchup(parseFloat((e.target as HTMLSelectElement).value))}
          >
            {CATCHUPS.map((x) => (
              <option key={x.value} value={String(x.value)}>
                {x.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {mode === 'european' ? (
        <>
          <div class="controls">
            <Field label="Capital $M" value={capital} onChange={setCapital} />
            <Field label="Hold yrs" value={years} onChange={setYears} />
            <Field label="Distributions $M" value={dist} onChange={setDist} />
          </div>

          <table class="wtable">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Amount</th>
                <th>LP</th>
                <th>GP</th>
              </tr>
            </thead>
            <tbody>
              {euro.tiers.map((t, i) => (
                <tr key={i}>
                  <td>{t.name}</td>
                  <td>{fmt(t.amount)}</td>
                  <td>{fmt(t.lp)}</td>
                  <td>{fmt(t.gp)}</td>
                </tr>
              ))}
              <tr class="total">
                <td>Total</td>
                <td>{fmt(euro.totalLp + euro.totalGp)}</td>
                <td>{fmt(euro.totalLp)}</td>
                <td>{fmt(euro.totalGp)}</td>
              </tr>
            </tbody>
          </table>
          <div class="kpis">
            <Kpi label="Preferred return" value={`$${fmt(euro.pref)}M`} />
            <Kpi label="GP carry" value={`$${fmt(euro.totalGp)}M`} />
            <Kpi label="GP % of profit" value={euro.profit > 0 ? pct(euro.gpPctOfProfit) : '—'} accent />
          </div>
        </>
      ) : (
        <>
          <div class="deals">
            {deals.map((d, i) => (
              <div class="deal-row" key={i}>
                <span class="deal-tag">Deal {i + 1}</span>
                <MiniField
                  label="cost"
                  value={d.cost}
                  onChange={(v) => setDeals((ds) => ds.map((x, n) => (n === i ? { ...x, cost: v } : x)))}
                />
                <MiniField
                  label="proceeds"
                  value={d.proceeds}
                  onChange={(v) =>
                    setDeals((ds) => ds.map((x, n) => (n === i ? { ...x, proceeds: v } : x)))
                  }
                />
                <MiniField
                  label="yrs"
                  value={d.years}
                  onChange={(v) => setDeals((ds) => ds.map((x, n) => (n === i ? { ...x, years: v } : x)))}
                />
                {deals.length > 1 && (
                  <button
                    class="del"
                    onClick={() => setDeals((ds) => ds.filter((_, n) => n !== i))}
                    aria-label="remove deal"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              class="btn btn-ghost"
              onClick={() => setDeals((ds) => [...ds, { cost: 50, proceeds: 100, years: 4 }])}
            >
              + Add deal
            </button>
          </div>

          <table class="wtable">
            <thead>
              <tr>
                <th>Deal</th>
                <th>Cost</th>
                <th>Proceeds</th>
                <th>GP carry</th>
              </tr>
            </thead>
            <tbody>
              {dbd.perDeal.map((r, i) => (
                <tr key={i}>
                  <td>Deal {i + 1}</td>
                  <td>{fmt(deals[i].cost)}</td>
                  <td>{fmt(deals[i].proceeds)}</td>
                  <td>{fmt(r.totalGp)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div class="kpis">
            <Kpi label="GP carry (pre-clawback)" value={`$${fmt(dbd.gpPaid)}M`} />
            <Kpi label="Clawback owed" value={`$${fmt(dbd.clawback)}M`} accent={dbd.clawback > 0.005} />
            <Kpi label="GP post-clawback" value={`$${fmt(dbd.gpPostClawback)}M`} />
            <Kpi label="LP post-clawback" value={`$${fmt(dbd.lpPostClawback)}M`} />
          </div>
          <p class="muted small">
            True carry = {pct(c)} × ${fmt(dbd.fundProfit)}M fund profit = ${fmt(dbd.trueCarry)}M. With a
            working clawback the deal-by-deal GP ends at the same economics as a European waterfall — the
            difference is <em>timing</em> and clawback (counterparty) risk.
          </p>
        </>
      )}
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label class="field">
      <span>{label}</span>
      <input
        inputMode="decimal"
        value={value}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
      />
    </label>
  );
}

function MiniField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label class="minifield">
      <span class="muted small">{label}</span>
      <input
        inputMode="decimal"
        value={String(value)}
        onInput={(e) => onChange(parseFloat((e.target as HTMLInputElement).value) || 0)}
      />
    </label>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div class={'kpi' + (accent ? ' accent' : '')}>
      <div class="kpi-value">{value}</div>
      <div class="kpi-label">{label}</div>
    </div>
  );
}
