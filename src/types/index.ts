export type Lang = 'fa' | 'en';

/** Traffic-light level produced by the rule-based threshold engine. */
export type Level = 'OK' | 'WARN' | 'CRIT';

/** A bilingual label. */
export interface Tx {
  fa: string;
  en: string;
}

export type Direction = 'higher' | 'lower';

export type KpiCategory = 'executive' | 'operations' | 'projects' | 'finance' | 'customers' | 'data' | 'platform' | 'management';

export interface Kpi {
  id: string;
  name: Tx;
  definition: Tx;
  formula: string;
  category: KpiCategory;
  sources: string[];
  /** required data elements (Data Dictionary ids) */
  data?: string[];
  period: Tx;
  unit: Tx;
  direction: Direction;
  target: number;
  warn: number;
  crit: number;
  owner: Tx;
  value: number;
  trend: number[];
  digits?: number;
}

export interface Region {
  id: string;
  name: Tx;
  customers: number;
  peakMW: number;
  capacityMW: number;
  lossPct: number;
  saidi: number;
  saifi: number;
  outages: number;
  outageMinutes: number;
  faults: number;
  restoreMin: number;
  requests: number;
  responseHrs: number;
  complaints: number;
  satisfaction: number;
  budgetBn: number;
  spentBn: number;
  collectionPct: number;
  projects: number;
  delayedProjects: number;
}
