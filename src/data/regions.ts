import type { Region } from '../types';

/**
 * Service regions (مدیریت‌های برق شهرستان) of South Kerman Electricity Distribution Co.
 * Geography is real; every numeric attribute is synthetic demo data.
 */
export const regions: Region[] = [
{
  id: 'JRF', name: { fa: 'جیرفت', en: 'Jiroft' },
  customers: 128400, peakMW: 512, capacityMW: 590, lossPct: 11.8, saidi: 96, saifi: 1.42,
  outages: 214, outageMinutes: 9120, faults: 168, restoreMin: 52, requests: 3910, responseHrs: 31,
  complaints: 412, satisfaction: 78, budgetBn: 4280, spentBn: 3120, collectionPct: 88, projects: 14, delayedProjects: 3
},
{
  id: 'ANB', name: { fa: 'عنبرآباد', en: 'Anbarabad' },
  customers: 54200, peakMW: 298, capacityMW: 318, lossPct: 13.9, saidi: 138, saifi: 2.05,
  outages: 176, outageMinutes: 9840, faults: 141, restoreMin: 66, requests: 1720, responseHrs: 44,
  complaints: 265, satisfaction: 69, budgetBn: 2140, spentBn: 1810, collectionPct: 81, projects: 9, delayedProjects: 3
},
{
  id: 'KHN', name: { fa: 'کهنوج', en: 'Kahnuj' },
  customers: 61800, peakMW: 276, capacityMW: 322, lossPct: 12.6, saidi: 112, saifi: 1.71,
  outages: 158, outageMinutes: 7410, faults: 122, restoreMin: 58, requests: 1980, responseHrs: 36,
  complaints: 238, satisfaction: 74, budgetBn: 2360, spentBn: 1640, collectionPct: 84, projects: 10, delayedProjects: 2
},
{
  id: 'RJN', name: { fa: 'رودبار جنوب', en: 'Rudbar-e Jonub' },
  customers: 49600, peakMW: 241, capacityMW: 252, lossPct: 15.2, saidi: 164, saifi: 2.38,
  outages: 192, outageMinutes: 11260, faults: 149, restoreMin: 74, requests: 1530, responseHrs: 52,
  complaints: 301, satisfaction: 63, budgetBn: 1980, spentBn: 1750, collectionPct: 76, projects: 8, delayedProjects: 4
},
{
  id: 'QGJ', name: { fa: 'قلعه‌گنج', en: 'Qaleh Ganj' },
  customers: 38900, peakMW: 186, capacityMW: 214, lossPct: 14.1, saidi: 129, saifi: 1.96,
  outages: 131, outageMinutes: 6980, faults: 104, restoreMin: 69, requests: 1170, responseHrs: 47,
  complaints: 187, satisfaction: 67, budgetBn: 1520, spentBn: 1090, collectionPct: 79, projects: 7, delayedProjects: 2
},
{
  id: 'MNJ', name: { fa: 'منوجان', en: 'Manujan' },
  customers: 41200, peakMW: 204, capacityMW: 238, lossPct: 13.4, saidi: 121, saifi: 1.84,
  outages: 124, outageMinutes: 6150, faults: 97, restoreMin: 61, requests: 1240, responseHrs: 41,
  complaints: 176, satisfaction: 71, budgetBn: 1610, spentBn: 1130, collectionPct: 82, projects: 7, delayedProjects: 1
},
{
  id: 'FRB', name: { fa: 'فاریاب', en: 'Faryab' },
  customers: 22700, peakMW: 118, capacityMW: 146, lossPct: 12.2, saidi: 104, saifi: 1.58,
  outages: 72, outageMinutes: 3260, faults: 55, restoreMin: 55, requests: 690, responseHrs: 38,
  complaints: 88, satisfaction: 75, budgetBn: 930, spentBn: 610, collectionPct: 86, projects: 5, delayedProjects: 1
},
{
  id: 'ARZ', name: { fa: 'ارزوئیه', en: 'Arzuiyeh' },
  customers: 26300, peakMW: 132, capacityMW: 168, lossPct: 10.9, saidi: 88, saifi: 1.29,
  outages: 69, outageMinutes: 2870, faults: 51, restoreMin: 48, requests: 760, responseHrs: 29,
  complaints: 79, satisfaction: 80, budgetBn: 1040, spentBn: 720, collectionPct: 90, projects: 5, delayedProjects: 0
}];


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
