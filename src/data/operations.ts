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
// The last point (Mehr) is the reported month; peak of the 12-month window is ~1,800 MW (summer 1404/1405).
opsTrend.peakMW[8] = company.peakMW;

/**
 * Outage classification used by Iranian distribution companies:
 * unplanned (fault) on MV / LV, planned (maintenance), load management (supply shortfall / ناترازی),
 * and upstream (sub-transmission / transmission) interruptions.
 */
export const outageClasses: {name: Tx;share: number;color: string;inSaidi: boolean;}[] = [
{ name: { fa: 'بی‌برنامه — فشار متوسط', en: 'Unplanned — MV' }, share: 41, color: '#ef4444', inSaidi: true },
{ name: { fa: 'بی‌برنامه — فشار ضعیف', en: 'Unplanned — LV' }, share: 24, color: '#f97316', inSaidi: true },
{ name: { fa: 'بابرنامه (نگهداری و توسعه)', en: 'Planned (maintenance)' }, share: 13, color: '#38bdf8', inSaidi: true },
{ name: { fa: 'مدیریت بار / محدودیت تأمین', en: 'Load management (supply shortfall)' }, share: 15, color: '#a78bfa', inSaidi: false },
{ name: { fa: 'شبکه بالادست (فوق‌توزیع/انتقال)', en: 'Upstream (sub-transmission)' }, share: 7, color: '#64748b', inSaidi: false }];

export const faultCauses: {name: Tx;count: number;color: string;}[] = [
{ name: { fa: 'اضافه‌بار تابستانی', en: 'Summer overload' }, count: 312, color: '#ef4444' },
{ name: { fa: 'طوفان، گرد و غبار و آلودگی مقره', en: 'Storm, dust & insulator pollution' }, count: 241, color: '#f59e0b' },
{ name: { fa: 'فرسودگی تجهیز', en: 'Ageing equipment' }, count: 206, color: '#f97316' },
{ name: { fa: 'برخورد پرنده / درخت', en: 'Birds / vegetation' }, count: 158, color: '#34d399' },
{ name: { fa: 'عوامل انسانی و برخورد خودرو', en: 'Third party & vehicles' }, count: 127, color: '#a78bfa' },
{ name: { fa: 'سایر / نامعلوم', en: 'Other / unknown' }, count: 208, color: '#64748b' }];


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
{ id: 'INC-58214', time: '07:42', regionId: 'RJN', feeder: 'RJN-F07', type: { fa: 'قطع فیدر — اضافه‌بار چاه‌ها', en: 'Feeder trip — well overload' }, customers: 3120, durationMin: 38, status: 'ACTIVE' },
{ id: 'INC-58211', time: '07:15', regionId: 'ANB', feeder: 'ANB-F03', type: { fa: 'سوختن فیوز کات‌اوت ترانس', en: 'Transformer cut-out fuse blown' }, customers: 410, durationMin: 65, status: 'ACTIVE' },
{ id: 'INC-58207', time: '06:58', regionId: 'JRF', feeder: 'JRF-F12', type: { fa: 'شکست مقره (آلودگی)', en: 'Insulator flashover (pollution)' }, customers: 1860, durationMin: 47, status: 'RESTORED' },
{ id: 'INC-58203', time: '06:21', regionId: 'KHN', feeder: 'KHN-F05', type: { fa: 'برخورد پرنده', en: 'Bird contact' }, customers: 940, durationMin: 22, status: 'RESTORED' },
{ id: 'INC-58198', time: '05:47', regionId: 'QGJ', feeder: 'QGJ-F02', type: { fa: 'قطع جامپر', en: 'Jumper break' }, customers: 1270, durationMin: 84, status: 'RESTORED' },
{ id: 'INC-58193', time: '05:10', regionId: 'SRJ', feeder: 'SRJ-F18', type: { fa: 'برخورد خودرو با پایه', en: 'Vehicle hit pole' }, customers: 2050, durationMin: 71, status: 'RESTORED' },
{ id: 'INC-58190', time: '04:30', regionId: 'MNJ', feeder: 'MNJ-F04', type: { fa: 'خاموشی بابرنامه (تعمیرات)', en: 'Planned outage (maintenance)' }, customers: 680, durationMin: 120, status: 'RESTORED' },
{ id: 'INC-58186', time: '03:12', regionId: 'RGN', feeder: 'RGN-F03', type: { fa: 'اتصال کوتاه کابل خروجی', en: 'Outgoing cable short circuit' }, customers: 2210, durationMin: 96, status: 'RESTORED' },
{ id: 'INC-58181', time: '01:55', regionId: 'BAM', feeder: 'BAM-F06', type: { fa: 'عملکرد ریکلوزر (گذرا)', en: 'Recloser operation (transient)' }, customers: 520, durationMin: 4, status: 'RESTORED' }];


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
{ id: 'T-RJN-0418', kind: { fa: 'ترانسفورماتور ۸۰۰ kVA (چاه‌ها)', en: 'Transformer 800 kVA (wells)' }, regionId: 'RJN', loadingPct: 112, tempC: 94, ageYears: 23, faults12m: 6, level: 'CRIT' },
{ id: 'F-ANB-03', kind: { fa: 'فیدر ۲۰ kV', en: '20 kV feeder' }, regionId: 'ANB', loadingPct: 104, tempC: 0, ageYears: 18, faults12m: 14, level: 'CRIT' },
{ id: 'T-JRF-1207', kind: { fa: 'ترانسفورماتور ۶۳۰ kVA', en: 'Transformer 630 kVA' }, regionId: 'JRF', loadingPct: 97, tempC: 88, ageYears: 19, faults12m: 4, level: 'CRIT' },
{ id: 'F-RGN-03', kind: { fa: 'فیدر ۲۰ kV', en: '20 kV feeder' }, regionId: 'RGN', loadingPct: 95, tempC: 0, ageYears: 16, faults12m: 9, level: 'CRIT' },
{ id: 'F-RJN-07', kind: { fa: 'فیدر ۲۰ kV', en: '20 kV feeder' }, regionId: 'RJN', loadingPct: 93, tempC: 0, ageYears: 21, faults12m: 11, level: 'WARN' },
{ id: 'T-QGJ-0221', kind: { fa: 'ترانسفورماتور ۴۰۰ kVA', en: 'Transformer 400 kVA' }, regionId: 'QGJ', loadingPct: 91, tempC: 81, ageYears: 26, faults12m: 3, level: 'WARN' },
{ id: 'F-MNJ-04', kind: { fa: 'فیدر ۲۰ kV', en: '20 kV feeder' }, regionId: 'MNJ', loadingPct: 90, tempC: 0, ageYears: 12, faults12m: 7, level: 'WARN' },
{ id: 'T-SRJ-2214', kind: { fa: 'ترانسفورماتور ۱۲۵۰ kVA (صنعتی)', en: 'Transformer 1250 kVA (industrial)' }, regionId: 'SRJ', loadingPct: 86, tempC: 74, ageYears: 8, faults12m: 1, level: 'OK' },
{ id: 'T-BAM-0105', kind: { fa: 'ترانسفورماتور ۲۵۰ kVA', en: 'Transformer 250 kVA' }, regionId: 'BAM', loadingPct: 79, tempC: 68, ageYears: 9, faults12m: 1, level: 'OK' }];


export const riskPoints: {name: Tx;regionId: string;reason: Tx;level: Level;}[] = [
{ name: { fa: 'محور جازموریان', en: 'Jazmurian corridor' }, regionId: 'RJN', reason: { fa: 'فیدرهای طولانی + طوفان گرد و غبار', en: 'Long feeders + dust storms' }, level: 'CRIT' },
{ name: { fa: 'چاه‌های کشاورزی دشت عنبرآباد', en: 'Anbarabad plain wells' }, regionId: 'ANB', reason: { fa: 'اضافه‌بار تابستانی ترانس‌ها', en: 'Summer transformer overload' }, level: 'CRIT' },
{ name: { fa: 'نخلستان‌های ریگان', en: 'Rigan date-palm groves' }, regionId: 'RGN', reason: { fa: 'بار پمپاژ + افت ولتاژ انتهای خط', en: 'Pumping load + end-of-line voltage drop' }, level: 'WARN' },
{ name: { fa: 'بافت قدیم جیرفت', en: 'Old Jiroft district' }, regionId: 'JRF', reason: { fa: 'شبکه فرسوده فشار ضعیف و تلفات بالا', en: 'Aged LV network, high losses' }, level: 'WARN' },
{ name: { fa: 'چاه‌دادخدا', en: 'Chah Dadkhoda' }, regionId: 'QGJ', reason: { fa: 'افت ولتاژ انتهای خط', en: 'End-of-line voltage drop' }, level: 'WARN' },
{ name: { fa: 'شهرک صنعتی سیرجان', en: 'Sirjan industrial estate' }, regionId: 'SRJ', reason: { fa: 'رشد سریع تقاضای صنعتی', en: 'Fast industrial demand growth' }, level: 'WARN' }];
