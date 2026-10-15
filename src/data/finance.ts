import type { Tx } from '../types';
import { series } from './common';

export interface BudgetLine {
  id: string;
  name: Tx;
  approvedBn: number;
  allocatedBn: number;
  spentBn: number;
  committedBn: number;
}

/** Budget lines (synthetic, billion IRR). */
export const budgetLines: BudgetLine[] = [
{ id: 'B-CAP-NET', name: { fa: 'توسعه و احداث شبکه', en: 'Network development' }, approvedBn: 6200, allocatedBn: 5100, spentBn: 4620, committedBn: 980 },
{ id: 'B-CAP-SUB', name: { fa: 'پست‌های فوق توزیع و کمپکت', en: 'Substations' }, approvedBn: 2600, allocatedBn: 2050, spentBn: 1980, committedBn: 520 },
{ id: 'B-OPX-MNT', name: { fa: 'نگهداری و تعمیرات', en: 'Maintenance & repair' }, approvedBn: 2400, allocatedBn: 2200, spentBn: 1840, committedBn: 210 },
{ id: 'B-OPX-LOS', name: { fa: 'کاهش تلفات', en: 'Loss reduction' }, approvedBn: 1300, allocatedBn: 980, spentBn: 760, committedBn: 300 },
{ id: 'B-SVC', name: { fa: 'خدمات مشترکین و کنتور', en: 'Customer services & metering' }, approvedBn: 1100, allocatedBn: 900, spentBn: 820, committedBn: 150 },
{ id: 'B-IT', name: { fa: 'فناوری اطلاعات و تحول دیجیتال', en: 'IT & digital' }, approvedBn: 640, allocatedBn: 420, spentBn: 310, committedBn: 160 },
{ id: 'B-HR', name: { fa: 'منابع انسانی و پرسنلی', en: 'Personnel' }, approvedBn: 1620, allocatedBn: 1400, spentBn: 1540, committedBn: 0 }];


export const costCategories: {name: Tx;value: number;}[] = [
{ name: { fa: 'پرسنلی', en: 'Personnel' }, value: 1540 },
{ name: { fa: 'تجهیزات و کالا', en: 'Equipment & materials' }, value: 4180 },
{ name: { fa: 'پیمانکاران', en: 'Contractors' }, value: 3960 },
{ name: { fa: 'خرید انرژی و انتقال', en: 'Energy & transmission' }, value: 1260 },
{ name: { fa: 'اداری و پشتیبانی', en: 'Admin & support' }, value: 930 }];


/** Monthly cost (bn IRR), planned vs actual, rolling 12 months. */
export const monthlyCost = {
  planned: series(1010, 501, { season: 0.35, noise: 0.02 }),
  actual: series(1060, 502, { season: 0.45, noise: 0.07, drift: 0.05 })
};

export const credits = {
  approvedBn: budgetLines.reduce((a, b) => a + b.approvedBn, 0),
  allocatedBn: budgetLines.reduce((a, b) => a + b.allocatedBn, 0),
  spentBn: budgetLines.reduce((a, b) => a + b.spentBn, 0),
  committedBn: budgetLines.reduce((a, b) => a + b.committedBn, 0)
};

export const receivables = {
  totalBn: 3840,
  govBn: 1460,
  agriBn: 1120,
  residentialBn: 780,
  commercialBn: 480,
  collectedMonthBn: 940,
  billedMonthBn: 1120
};
