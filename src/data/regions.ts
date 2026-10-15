import type { Region } from '../types';

/**
 * مدیریت‌های برق شهرستان — شرکت توزیع نیروی برق جنوب استان کرمان
 *
 * Calibrated to public figures (see README › «منابع داده‌های واقعی»):
 *  - 16 county power-management units (Sirjan, Bam, Jiroft, Baft, Bardsir, Kahnuj, Manujan, Anbarabad,
 *    Rudbar-e Jonub, Rigan, Qaleh Ganj, Rabor, Arzuiyeh, Narmashir, Fahraj, Faryab)
 *  - > 720,000 customers, ~1,800 MW summer peak (1404)
 *  - residential + agricultural ≈ 80% of consumption; national distribution loss ≈ 10.6%
 * Customer counts are split by county population share; peak by load mix (agri wells / industry).
 * Per-unit reliability, service and financial values are realistic estimates, not official statistics.
 */
type Row = [
  id: string, fa: string, en: string,
  customers: number, peakMW: number, capacityMW: number, lossPct: number,
  saidi: number, saifi: number, restoreMin: number,
  responseHrs: number, satisfaction: number, collectionPct: number,
  budgetBn: number, spentBn: number, projects: number, delayed: number];

const ROWS: Row[] = [
['SRJ', 'سیرجان', 'Sirjan', 141200, 320, 372, 9.8, 74, 1.12, 44, 29, 81, 91, 1180, 712, 38, 4],
['JRF', 'جیرفت', 'Jiroft', 130600, 300, 322, 15.6, 128, 1.86, 63, 41, 68, 79, 1210, 698, 41, 9],
['BAM', 'بم', 'Bam', 55800, 130, 151, 11.2, 86, 1.31, 49, 33, 77, 88, 520, 308, 19, 2],
['ANB', 'عنبرآباد', 'Anbarabad', 48900, 150, 158, 14.9, 141, 2.04, 66, 45, 66, 77, 540, 331, 22, 6],
['RJN', 'رودبار جنوب', 'Rudbar-e Jonub', 47300, 120, 124, 16.8, 163, 2.31, 76, 52, 62, 72, 500, 319, 21, 7],
['KHN', 'کهنوج', 'Kahnuj', 43600, 115, 128, 14.1, 118, 1.74, 61, 39, 71, 81, 450, 262, 18, 3],
['BRD', 'بردسیر', 'Bardsir', 35100, 70, 84, 9.4, 69, 1.05, 42, 27, 82, 92, 300, 181, 12, 1],
['RGN', 'ریگان', 'Rigan', 33400, 110, 116, 15.1, 136, 1.98, 70, 47, 65, 74, 360, 214, 16, 4],
['BFT', 'بافت', 'Baft', 31800, 45, 58, 9.1, 72, 1.09, 47, 30, 80, 90, 270, 159, 11, 1],
['MNJ', 'منوجان', 'Manujan', 30600, 95, 104, 14.4, 124, 1.83, 64, 43, 69, 76, 330, 196, 14, 3],
['QGJ', 'قلعه‌گنج', 'Qaleh Ganj', 30100, 85, 90, 15.9, 149, 2.12, 72, 49, 64, 73, 320, 197, 15, 4],
['FHJ', 'فهرج', 'Fahraj', 26500, 70, 79, 12.6, 98, 1.46, 55, 36, 74, 84, 240, 141, 10, 1],
['NRM', 'نرماشیر', 'Narmashir', 24100, 70, 77, 12.9, 102, 1.52, 57, 37, 73, 83, 230, 133, 9, 2],
['ARZ', 'ارزوئیه', 'Arzuiyeh', 17300, 55, 63, 11.7, 93, 1.38, 52, 34, 76, 86, 190, 112, 8, 1],
['FRB', 'فاریاب', 'Faryab', 15400, 45, 50, 13.2, 109, 1.61, 59, 40, 72, 82, 170, 99, 8, 2],
['RBR', 'رابر', 'Rabor', 13700, 20, 27, 8.7, 66, 0.98, 46, 28, 83, 93, 130, 74, 6, 0]];


export const regions: Region[] = ROWS.map(
  ([id, fa, en, customers, peakMW, capacityMW, lossPct, saidi, saifi, restoreMin, responseHrs, satisfaction, collectionPct, budgetBn, spentBn, projects, delayedProjects]) => {
    // unplanned MV/LV interruptions per month scale with customers and SAIFI
    const outages = Math.round(customers * saifi / 1000 * 1.6);
    return {
      id,
      name: { fa, en },
      customers,
      peakMW,
      capacityMW,
      lossPct,
      saidi,
      saifi,
      outages,
      outageMinutes: outages * restoreMin,
      faults: Math.round(outages * 0.72),
      restoreMin,
      requests: Math.round(customers * 0.018),
      responseHrs,
      complaints: Math.round(customers * (0.0018 + (80 - satisfaction) * 0.00008)),
      satisfaction,
      budgetBn,
      spentBn,
      collectionPct,
      projects,
      delayedProjects
    };
  }
);

export const regionById = (id: string) => regions.find((r) => r.id === id)!;

const sum = (f: (r: Region) => number) => regions.reduce((a, r) => a + f(r), 0);
const wavg = (f: (r: Region) => number) => sum((r) => f(r) * r.customers) / sum((r) => r.customers);

export const company = {
  customers: sum((r) => r.customers),
  peakMW: sum((r) => r.peakMW),
  capacityMW: sum((r) => r.capacityMW),
  lossPct: wavg((r) => r.lossPct),
  saidi: wavg((r) => r.saidi),
  saifi: wavg((r) => r.saifi),
  outages: sum((r) => r.outages),
  faults: sum((r) => r.faults),
  restoreMin: wavg((r) => r.restoreMin),
  requests: sum((r) => r.requests),
  responseHrs: wavg((r) => r.responseHrs),
  complaints: sum((r) => r.complaints),
  satisfaction: wavg((r) => r.satisfaction),
  budgetBn: sum((r) => r.budgetBn),
  spentBn: sum((r) => r.spentBn),
  collectionPct: wavg((r) => r.collectionPct),
  projects: sum((r) => r.projects),
  delayedProjects: sum((r) => r.delayedProjects)
};

/** Composite regional performance score (0-100), transparent weighted formula — no ML. */
export function regionScore(r: Region): number {
  const rel = Math.max(0, 100 - r.saidi / 2);
  const loss = Math.max(0, 100 - (r.lossPct - 8) * 9);
  const svc = r.satisfaction;
  const fin = r.collectionPct;
  const prj = 100 - r.delayedProjects / Math.max(1, r.projects) * 100;
  return Math.round(rel * 0.3 + loss * 0.2 + svc * 0.2 + fin * 0.15 + prj * 0.15);
}
