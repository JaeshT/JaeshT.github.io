// Fund performance metrics (pure). Powers the IRR / MOIC / TVPI / PME calculator.
// Verified against Q04 worked examples (e.g. KS-PME mini-example = 1.44; TVPI = DPI + RVPI).

export interface CashflowRow {
  year: number;
  call: number; // capital called (LP outflow), entered positive
  dist: number; // distribution to LP (inflow), positive
  index: number; // public index level at that date (for PME)
}

export interface MetricsResult {
  pic: number; // paid-in capital
  distributions: number;
  tvpi: number;
  dpi: number;
  rvpi: number;
  irr: number | null; // annualized, fraction (null if no sign change / no root)
  ksPme: number | null;
}

/** NPV of a per-period cash-flow series at annual rate r (period 0-based in years). */
function npv(rate: number, flows: { t: number; cf: number }[]): number {
  return flows.reduce((s, f) => s + f.cf / Math.pow(1 + rate, f.t), 0);
}

/** IRR via bisection on a bracket; returns annualized fraction or null. Assumes annual periods. */
export function irr(flows: { t: number; cf: number }[]): number | null {
  const hasPos = flows.some((f) => f.cf > 0);
  const hasNeg = flows.some((f) => f.cf < 0);
  if (!hasPos || !hasNeg) return null;
  let lo = -0.9999;
  let hi = 10;
  let flo = npv(lo, flows);
  let fhi = npv(hi, flows);
  if (flo * fhi > 0) return null; // no sign change in bracket
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = npv(mid, flows);
    if (Math.abs(fm) < 1e-7) return mid;
    if (flo * fm < 0) {
      hi = mid;
      fhi = fm;
    } else {
      lo = mid;
      flo = fm;
    }
  }
  return (lo + hi) / 2;
}

export function computeMetrics(rows: CashflowRow[], nav: number): MetricsResult {
  const pic = rows.reduce((s, r) => s + (r.call || 0), 0);
  const distributions = rows.reduce((s, r) => s + (r.dist || 0), 0);
  const dpi = pic ? distributions / pic : 0;
  const rvpi = pic ? nav / pic : 0;
  const tvpi = dpi + rvpi;

  // IRR: net cash flow per year, with terminal NAV added to the final year as a synthetic inflow.
  const lastYear = rows.length ? Math.max(...rows.map((r) => r.year)) : 0;
  const flows = rows.map((r) => ({ t: r.year, cf: (r.dist || 0) - (r.call || 0) }));
  if (nav) {
    const terminal = flows.find((f) => f.t === lastYear);
    if (terminal) terminal.cf += nav;
    else flows.push({ t: lastYear, cf: nav });
  }
  const irrVal = irr(flows);

  // KS-PME: future-value every flow at the index, valuation date = last row's index.
  const idxNow = rows.length ? rows[rows.length - 1].index : 0;
  let fvDist = 0;
  let fvCall = 0;
  let pmeOk = idxNow > 0;
  for (const r of rows) {
    if (!r.index || r.index <= 0) pmeOk = false;
    const factor = r.index > 0 ? idxNow / r.index : 0;
    fvDist += (r.dist || 0) * factor;
    fvCall += (r.call || 0) * factor;
  }
  const ksPme = pmeOk && fvCall > 0 ? (fvDist + nav) / fvCall : null;

  return { pic, distributions, tvpi, dpi, rvpi, irr: irrVal, ksPme };
}
