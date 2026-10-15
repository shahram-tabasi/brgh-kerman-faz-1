import type { Tx } from '../types';
import { series } from './common';

/** Amounts in billion toman. Annual programme sized to the 16 county units (see regions.ts). */
export interface BudgetLine {
  id: string;
  name: Tx;
  approvedBn: number;
  allocatedBn: number;
  spentBn: number;
  committedBn: number;
}

export const budgetLines: BudgetLine[] = [
{ id: 'B-CAP-NET', name: { fa: 'توسعه و احداث شبکه (پیک ۱۴۰۵)', en: 'Network development (peak 1405)' }, approvedBn: 1900, allocatedBn: 1420, spentBn: 1235, committedBn: 310 },
{ id: 'B-CAP-SUB', name: { fa: 'پست‌های توزیع و فیدرهای خروجی', en: 'Distribution substations & feeders' }, approvedBn: 620, allocatedBn: 410, spentBn: 342, committedBn: 140 },
{ id: 'B-OPX-MNT', name: { fa: 'نگهداری و تعمیرات و رفع حوادث', en: 'Maintenance & incident repair' }, approvedBn: 1050, allocatedBn: 700, spentBn: 668, committedBn: 60 },
{ id: 'B-OPX-LOS', name: { fa: 'کاهش تلفات و کنتور هوشمند', en: 'Loss reduction & smart metering' }, approvedBn: 540, allocatedBn: 320, spentBn: 236, committedBn: 120 },
{ id: 'B-SVC', name: { fa: 'خدمات مشترکین و انشعابات', en: 'Customer services & connections' }, approvedBn: 380, allocatedBn: 240, spentBn: 219, committedBn: 25 },
{ id: 'B-IT', name: { fa: 'فناوری اطلاعات و تحول دیجیتال', en: 'ICT & digital' }, approvedBn: 160, allocatedBn: 80, spentBn: 54, committedBn: 22 },
{ id: 'B-HR', name: { fa: 'هزینه‌های پرسنلی', en: 'Personnel' }, approvedBn: 2290, allocatedBn: 1340, spentBn: 1382, committedBn: 0 }];


export const costCategories: {name: Tx;value: number;}[] = [
{ name: { fa: 'پرسنلی', en: 'Personnel' }, value: 1382 },
{ name: { fa: 'تجهیزات و کالا', en: 'Equipment & materials' }, value: 1180 },
{ name: { fa: 'پیمانکاران', en: 'Contractors' }, value: 1010 },
{ name: { fa: 'نگهداری و حوادث', en: 'Maintenance & incidents' }, value: 410 },
{ name: { fa: 'اداری و پشتیبانی', en: 'Admin & support' }, value: 154 }];


/** Monthly cost (bn toman), planned vs actual, rolling 12 months — summer peak drives maintenance spend. */
export const monthlyCost = {
  planned: series(578, 501, { season: 0.35, noise: 0.02 }),
  actual: series(600, 502, { season: 0.45, noise: 0.07, drift: 0.05 })
};

export const credits = {
  approvedBn: budgetLines.reduce((a, b) => a + b.approvedBn, 0),
  allocatedBn: budgetLines.reduce((a, b) => a + b.allocatedBn, 0),
  spentBn: budgetLines.reduce((a, b) => a + b.spentBn, 0),
  committedBn: budgetLines.reduce((a, b) => a + b.committedBn, 0)
};

/** Receivables from customers (bn toman). */
export const receivables = {
  totalBn: 1150,
  govBn: 420,
  agriBn: 380,
  residentialBn: 210,
  commercialBn: 140,
  collectedMonthBn: 128,
  billedMonthBn: 160
};
