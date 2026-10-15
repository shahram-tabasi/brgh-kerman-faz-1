import type { Level, Tx } from '../types';
import { series } from './common';
import { company } from './regions';

export const opsTrend = {
  peakMW: series(company.peakMW * 0.8, 301, { season: 1.1, noise: 0.03 }),
  capacityMW: series(company.capacityMW, 302, { noise: 0.004, drift: 0.04 }),
  outages: series(company.outages * 0.85, 303, { season: 0.9, noise: 0.08 }),
  faults: series(company.faults * 0.85, 304, { season: 0.9, noise: 0.08 }),
  restoreMin: series(company.restoreMin, 305, { season: 0.35, noise: 0.06 })
};

export const faultCauses: {name: Tx;count: number;color: string;}[] = [
{ name: { fa: 'اضافه‌بار', en: 'Overload' }, count: 241, color: '#ef4444' },
{ name: { fa: 'گرد و غبار و آلودگی', en: 'Dust & pollution' }, count: 176, color: '#f59e0b' },
{ name: { fa: 'فرسودگی تجهیز', en: 'Ageing equipment' }, count: 158, color: '#f97316' },
{ name: { fa: 'برخورد پرنده / درخت', en: 'Birds / vegetation' }, count: 117, color: '#34d399' },
{ name: { fa: 'عوامل جوی', en: 'Weather' }, count: 104, color: '#38bdf8' },
{ name: { fa: 'عوامل انسانی', en: 'Third party' }, count: 91, color: '#a78bfa' }];


export interface Incident {
  id: string;
  time: string;
  regionId: string;
  feeder: string;
  type: Tx;
  customers: number;
  durationMin: number;
  status: 'ACTIVE' | 'RESTORED';
}

export const incidents: Incident[] = [
{ id: 'INC-58214', time: '07:42', regionId: 'RJN', feeder: 'RJN-F07', type: { fa: 'قطع فیدر — اضافه‌بار', en: 'Feeder trip — overload' }, customers: 3120, durationMin: 38, status: 'ACTIVE' },
{ id: 'INC-58211', time: '07:15', regionId: 'ANB', feeder: 'ANB-F03', type: { fa: 'سوختن فیوز ترانس', en: 'Transformer fuse blown' }, customers: 410, durationMin: 65, status: 'ACTIVE' },
{ id: 'INC-58207', time: '06:58', regionId: 'JRF', feeder: 'JRF-F12', type: { fa: 'خرابی مقره', en: 'Insulator failure' }, customers: 1860, durationMin: 47, status: 'RESTORED' },
{ id: 'INC-58203', time: '06:21', regionId: 'KHN', feeder: 'KHN-F05', type: { fa: 'برخورد پرنده', en: 'Bird contact' }, customers: 940, durationMin: 22, status: 'RESTORED' },
{ id: 'INC-58198', time: '05:47', regionId: 'QGJ', feeder: 'QGJ-F02', type: { fa: 'قطع جامپر', en: 'Jumper break' }, customers: 1270, durationMin: 84, status: 'RESTORED' },
{ id: 'INC-58190', time: '04:30', regionId: 'MNJ', feeder: 'MNJ-F04', type: { fa: 'خاموشی بابرنامه', en: 'Planned outage' }, customers: 680, durationMin: 120, status: 'RESTORED' },
{ id: 'INC-58186', time: '03:12', regionId: 'RJN', feeder: 'RJN-F02', type: { fa: 'اتصال کوتاه کابل', en: 'Cable short circuit' }, customers: 2210, durationMin: 96, status: 'RESTORED' },
{ id: 'INC-58181', time: '01:55', regionId: 'ARZ', feeder: 'ARZ-F01', type: { fa: 'عملکرد ریکلوزر', en: 'Recloser operation' }, customers: 520, durationMin: 6, status: 'RESTORED' }];


export interface SensitiveAsset {
  id: string;
  kind: Tx;
  regionId: string;
  loadingPct: number;
  tempC: number;
  ageYears: number;
  faults12m: number;
  level: Level;
}

export const sensitiveAssets: SensitiveAsset[] = [
{ id: 'T-RJN-0418', kind: { fa: 'ترانسفورماتور ۸۰۰ kVA', en: 'Transformer 800 kVA' }, regionId: 'RJN', loadingPct: 112, tempC: 94, ageYears: 23, faults12m: 6, level: 'CRIT' },
{ id: 'F-ANB-03', kind: { fa: 'فیدر ۲۰ kV', en: '20 kV feeder' }, regionId: 'ANB', loadingPct: 104, tempC: 0, ageYears: 18, faults12m: 14, level: 'CRIT' },
{ id: 'T-JRF-1207', kind: { fa: 'ترانسفورماتور ۶۳۰ kVA', en: 'Transformer 630 kVA' }, regionId: 'JRF', loadingPct: 97, tempC: 88, ageYears: 19, faults12m: 4, level: 'CRIT' },
{ id: 'F-RJN-07', kind: { fa: 'فیدر ۲۰ kV', en: '20 kV feeder' }, regionId: 'RJN', loadingPct: 93, tempC: 0, ageYears: 21, faults12m: 11, level: 'WARN' },
{ id: 'T-QGJ-0221', kind: { fa: 'ترانسفورماتور ۴۰۰ kVA', en: 'Transformer 400 kVA' }, regionId: 'QGJ', loadingPct: 91, tempC: 81, ageYears: 26, faults12m: 3, level: 'WARN' },
{ id: 'PT-KHN-2', kind: { fa: 'ترانس قدرت ۳۰ MVA', en: 'Power transformer 30 MVA' }, regionId: 'KHN', loadingPct: 89, tempC: 76, ageYears: 15, faults12m: 1, level: 'WARN' },
{ id: 'F-MNJ-04', kind: { fa: 'فیدر ۲۰ kV', en: '20 kV feeder' }, regionId: 'MNJ', loadingPct: 87, tempC: 0, ageYears: 12, faults12m: 7, level: 'WARN' },
{ id: 'T-ARZ-0105', kind: { fa: 'ترانسفورماتور ۲۵۰ kVA', en: 'Transformer 250 kVA' }, regionId: 'ARZ', loadingPct: 79, tempC: 68, ageYears: 9, faults12m: 1, level: 'OK' }];


export const riskPoints: {name: Tx;regionId: string;reason: Tx;level: Level;}[] = [
{ name: { fa: 'محور جازموریان', en: 'Jazmurian corridor' }, regionId: 'RJN', reason: { fa: 'فیدر طولانی + طوفان گرد و غبار', en: 'Long feeder + dust storms' }, level: 'CRIT' },
{ name: { fa: 'چاه‌های کشاورزی دشت عنبرآباد', en: 'Anbarabad plain wells' }, regionId: 'ANB', reason: { fa: 'اضافه‌بار تابستانی', en: 'Summer overload' }, level: 'CRIT' },
{ name: { fa: 'بافت قدیم جیرفت', en: 'Old Jiroft district' }, regionId: 'JRF', reason: { fa: 'شبکه فرسوده فشار ضعیف', en: 'Aged LV network' }, level: 'WARN' },
{ name: { fa: 'کمربندی کهنوج', en: 'Kahnuj ring road' }, regionId: 'KHN', reason: { fa: 'عملیات عمرانی در حریم', en: 'Civil works in right-of-way' }, level: 'WARN' },
{ name: { fa: 'چاه‌دادخدا', en: 'Chah Dadkhoda' }, regionId: 'QGJ', reason: { fa: 'افت ولتاژ انتهای خط', en: 'End-of-line voltage drop' }, level: 'WARN' }];
