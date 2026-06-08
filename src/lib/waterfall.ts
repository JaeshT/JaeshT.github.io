// Distribution-waterfall engine (pure). Mirrors the "Calculator data model" in
// research/Q03-fund-economics-waterfalls.md and reproduces its verified test cases:
//   European $100M->$200M, 5yr, 8% pref, 100% catch-up, 20% carry: GP $20,000,000 / LP $180,000,000
//   European hard hurdle (catchupShare 0):                          GP $10,613,438.46 / LP $189,386,561.54
//   Deal-by-deal two-deal:  GP $20,000,000 pre-clawback, clawback $6,000,000, post GP $14,000,000

export type Compounding = 'annual' | 'simple';

export interface WaterfallInputs {
  capital: number; // contributed capital (single drawdown at t=0)
  years: number; // hold period
  distribution: number; // total distributions at exit
  hurdle: number; // annual preferred return, e.g. 0.08
  carry: number; // e.g. 0.20
  catchupShare: number; // 1 = full 100% catch-up; 0 = hard hurdle (no catch-up); 0.8 = partial
  compounding?: Compounding;
}

export interface Tier {
  name: string;
  amount: number;
  lp: number;
  gp: number;
  cumLp: number;
  cumGp: number;
}

export interface WaterfallResult {
  pref: number;
  tiers: Tier[];
  totalLp: number;
  totalGp: number;
  profit: number;
  gpPctOfProfit: number;
}

/** Preferred return accrued on contributed capital over `years`. */
export function prefAmount(
  capital: number,
  hurdle: number,
  years: number,
  compounding: Compounding = 'annual',
): number {
  return compounding === 'simple'
    ? capital * hurdle * years
    : capital * (Math.pow(1 + hurdle, years) - 1);
}

/** Whole-fund (European) waterfall, single drawdown. Also the per-deal engine for deal-by-deal. */
export function europeanWaterfall(i: WaterfallInputs): WaterfallResult {
  const comp = i.compounding ?? 'annual';
  const pref = prefAmount(i.capital, i.hurdle, i.years, comp);
  let rem = i.distribution;
  const tiers: Tier[] = [];
  let cumLp = 0;
  let cumGp = 0;
  const push = (name: string, lp: number, gp: number) => {
    cumLp += lp;
    cumGp += gp;
    tiers.push({ name, amount: lp + gp, lp, gp, cumLp, cumGp });
  };

  // Tier 1 — return of capital
  const roc = Math.min(rem, i.capital);
  rem -= roc;
  push('Return of capital', roc, 0);

  // Tier 2 — preferred return
  const prefPaid = Math.min(rem, pref);
  rem -= prefPaid;
  push(`Preferred return (${(i.hurdle * 100).toFixed(0)}%)`, prefPaid, 0);

  // Tier 3 — GP catch-up (only meaningful once pref fully paid and catch-up can restore the split)
  if (i.catchupShare > i.carry && prefPaid >= pref - 1e-6 && rem > 0) {
    const gpFull = (i.carry / (i.catchupShare - i.carry)) * prefPaid; // GP $ at full catch-up
    const tierFull = gpFull / i.catchupShare;
    const tierTotal = Math.min(rem, tierFull);
    const gp = tierTotal * i.catchupShare;
    rem -= tierTotal;
    push('GP catch-up', tierTotal - gp, gp);
  }

  // Tier 4 — residual carried-interest split
  if (rem > 1e-9) {
    const gp = rem * i.carry;
    push(
      `${((1 - i.carry) * 100).toFixed(0)}/${(i.carry * 100).toFixed(0)} split`,
      rem - gp,
      gp,
    );
  }

  const profit = Math.max(0, i.distribution - i.capital);
  return {
    pref,
    tiers,
    totalLp: cumLp,
    totalGp: cumGp,
    profit,
    gpPctOfProfit: profit > 0 ? cumGp / profit : 0,
  };
}

export interface Deal {
  cost: number;
  proceeds: number;
  years: number;
}

export interface DealByDealResult {
  perDeal: WaterfallResult[];
  gpPaid: number;
  lpPaid: number;
  totalCost: number;
  totalDistribution: number;
  fundProfit: number;
  trueCarry: number;
  clawback: number;
  gpPostClawback: number;
  lpPostClawback: number;
}

/** Pure deal-by-deal (American) waterfall + end-of-fund clawback true-up. */
export function dealByDeal(
  deals: Deal[],
  p: { hurdle: number; carry: number; catchupShare: number; compounding?: Compounding },
): DealByDealResult {
  const perDeal = deals.map((d) =>
    europeanWaterfall({
      capital: d.cost,
      years: d.years,
      distribution: d.proceeds,
      hurdle: p.hurdle,
      carry: p.carry,
      catchupShare: p.catchupShare,
      compounding: p.compounding,
    }),
  );
  const gpPaid = perDeal.reduce((s, x) => s + x.totalGp, 0);
  const lpPaid = perDeal.reduce((s, x) => s + x.totalLp, 0);
  const totalCost = deals.reduce((s, d) => s + d.cost, 0);
  const totalDistribution = deals.reduce((s, d) => s + d.proceeds, 0);
  const fundProfit = Math.max(0, totalDistribution - totalCost);
  const trueCarry = p.carry * fundProfit;
  const clawback = Math.max(0, gpPaid - trueCarry);
  return {
    perDeal,
    gpPaid,
    lpPaid,
    totalCost,
    totalDistribution,
    fundProfit,
    trueCarry,
    clawback,
    gpPostClawback: gpPaid - clawback,
    lpPostClawback: lpPaid + clawback,
  };
}
