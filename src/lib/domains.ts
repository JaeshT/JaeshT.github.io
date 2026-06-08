import type { Domain } from './schema';

export const DOMAIN_LABEL: Record<Domain, string> = {
  technicals: 'Technicals',
  'pe-fundamentals': 'PE Fundamentals',
  'fund-economics': 'Fund Economics',
  performance: 'Performance & Metrics',
  primaries: 'Primaries / Due Diligence',
  'portfolio-pacing': 'Portfolio & Pacing',
  'co-investments': 'Co-investments',
  excel: 'Excel',
  market: 'Market & Secondaries',
  firm: 'Neuberger Berman',
};

export const DOMAIN_ORDER: Domain[] = [
  'technicals',
  'pe-fundamentals',
  'fund-economics',
  'performance',
  'primaries',
  'portfolio-pacing',
  'co-investments',
  'excel',
  'market',
  'firm',
];
