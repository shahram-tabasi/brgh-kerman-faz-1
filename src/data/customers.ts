import type { Tx } from '../types';
import { series } from './common';
import { company } from './regions';

/** Tavanir tariff groups. Residential + agricultural ≈ 80% of consumption in South Kerman. */
export const customerTypes: {name: Tx;count: number;color: string;energyPct: number;}[] = [
{ name: { fa: 'خانگی', en: 'Residential' }, count: 566100, color: '#38bdf8', energyPct: 41 },
{ name: { fa: 'کشاورزی', en: 'Agricultural' }, count: 53800, color: '#34d399', energyPct: 39 },
{ name: { fa: 'سایر مصارف (تجاری)', en: 'Other uses (commercial)' }, count: 79900, color: '#f59e0b', energyPct: 7 },
{ name: { fa: 'عمومی', en: 'Public' }, count: 21300, color: '#a78bfa', energyPct: 5 },
{ name: { fa: 'صنعتی', en: 'Industrial' }, count: company.customers - 566100 - 53800 - 79900 - 21300, color: '#f97316', energyPct: 8 }];


/** Customer service requests (monthly), Tavanir standard service types; targets = internal service standard. */
export const requestTypes: {name: Tx;count: number;avgHrs: number;targetHrs: number;}[] = [
{ name: { fa: 'انشعاب جدید', en: 'New connection' }, count: 3420, avgHrs: 74, targetHrs: 72 },
{ name: { fa: 'افزایش / کاهش قدرت', en: 'Capacity change' }, count: 1310, avgHrs: 58, targetHrs: 48 },
{ name: { fa: 'تعویض کنتور معیوب', en: 'Faulty meter replacement' }, count: 2860, avgHrs: 31, targetHrs: 24 },
{ name: { fa: 'اعتراض به صورتحساب', en: 'Bill dispute' }, count: 2410, avgHrs: 36, targetHrs: 48 },
{ name: { fa: 'تغییر نام / تفکیک', en: 'Name change / split' }, count: 990, avgHrs: 40, targetHrs: 48 },
{ name: { fa: 'جابه‌جایی انشعاب / کنتور', en: 'Service relocation' }, count: 920, avgHrs: 96, targetHrs: 96 },
{ name: { fa: 'قطع و وصل مجدد', en: 'Disconnect / reconnect' }, count: 1150, avgHrs: 9, targetHrs: 12 }];


export const complaintTypes: {name: Tx;count: number;}[] = [
{ name: { fa: 'خاموشی مکرر و طولانی', en: 'Repeated / long outages' }, count: 612 },
{ name: { fa: 'افت ولتاژ', en: 'Low voltage' }, count: 384 },
{ name: { fa: 'صورتحساب و تعرفه', en: 'Billing & tariff' }, count: 296 },
{ name: { fa: 'تأخیر در خدمات', en: 'Service delay' }, count: 248 },
{ name: { fa: 'خسارت لوازم برقی', en: 'Appliance damage' }, count: 96 },
{ name: { fa: 'سایر', en: 'Other' }, count: Math.max(0, company.complaints - 612 - 384 - 296 - 248 - 96) }];


export const serviceStatus: {name: Tx;open: number;inProgress: number;done: number;}[] = [
{ name: { fa: 'حضوری (دفاتر خدمات)', en: 'In person (service offices)' }, open: 210, inProgress: 380, done: 2940 },
{ name: { fa: 'تلفنی ۱۲۱', en: '121 phone' }, open: 160, inProgress: 290, done: 5120 },
{ name: { fa: 'برق من (اپلیکیشن و وب)', en: 'Bargh-e Man (app & web)' }, open: 340, inProgress: 520, done: 6180 }];


export const requestTrend = {
  received: series(company.requests, 701, { season: 0.5, noise: 0.06, drift: 0.08 }),
  closed: series(company.requests * 0.94, 702, { season: 0.45, noise: 0.06, drift: 0.08 })
};

export const serviceQuality: {name: Tx;value: number;target: number;}[] = [
{ name: { fa: 'پاسخ در اولین تماس ۱۲۱', en: '121 first-contact resolution' }, value: 71, target: 80 },
{ name: { fa: 'درخواست‌های انجام‌شده در مهلت', en: 'Requests within service standard' }, value: 83, target: 90 },
{ name: { fa: 'پاسخ تلفن ۱۲۱ زیر ۶۰ ثانیه', en: '121 calls answered < 60 s' }, value: 88, target: 85 },
{ name: { fa: 'سهم خدمات غیرحضوری (برق من)', en: 'Digital channel share (Bargh-e Man)' }, value: 62, target: 70 }];
