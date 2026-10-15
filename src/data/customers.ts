import type { Tx } from '../types';
import { series } from './common';
import { company } from './regions';

export const customerTypes: {name: Tx;count: number;color: string;}[] = [
{ name: { fa: 'خانگی', en: 'Residential' }, count: 318400, color: '#38bdf8' },
{ name: { fa: 'کشاورزی', en: 'Agricultural' }, count: 46200, color: '#34d399' },
{ name: { fa: 'تجاری', en: 'Commercial' }, count: 38600, color: '#f59e0b' },
{ name: { fa: 'عمومی', en: 'Public' }, count: 12700, color: '#a78bfa' },
{ name: { fa: 'صنعتی', en: 'Industrial' }, count: company.customers - 318400 - 46200 - 38600 - 12700, color: '#f97316' }];


export const requestTypes: {name: Tx;count: number;avgHrs: number;targetHrs: number;}[] = [
{ name: { fa: 'انشعاب جدید', en: 'New connection' }, count: 3120, avgHrs: 74, targetHrs: 72 },
{ name: { fa: 'تغییر قدرت', en: 'Capacity change' }, count: 1480, avgHrs: 58, targetHrs: 48 },
{ name: { fa: 'رفع عیب کنتور', en: 'Meter fault' }, count: 2860, avgHrs: 31, targetHrs: 24 },
{ name: { fa: 'اعتراض به قبض', en: 'Bill dispute' }, count: 2410, avgHrs: 36, targetHrs: 48 },
{ name: { fa: 'جابه‌جایی انشعاب', en: 'Service relocation' }, count: 920, avgHrs: 96, targetHrs: 96 },
{ name: { fa: 'قطع و وصل', en: 'Disconnect / reconnect' }, count: 2210, avgHrs: 9, targetHrs: 12 }];


export const complaintTypes: {name: Tx;count: number;}[] = [
{ name: { fa: 'خاموشی مکرر', en: 'Repeated outages' }, count: 612 },
{ name: { fa: 'افت ولتاژ', en: 'Low voltage' }, count: 384 },
{ name: { fa: 'صورتحساب', en: 'Billing' }, count: 296 },
{ name: { fa: 'تأخیر در خدمات', en: 'Service delay' }, count: 248 },
{ name: { fa: 'رفتار کارکنان', en: 'Staff conduct' }, count: 71 },
{ name: { fa: 'سایر', en: 'Other' }, count: company.complaints - 612 - 384 - 296 - 248 - 71 }];


export const serviceStatus: {name: Tx;open: number;inProgress: number;done: number;}[] = [
{ name: { fa: 'حضوری', en: 'In person' }, open: 210, inProgress: 380, done: 2940 },
{ name: { fa: 'تلفنی ۱۲۱', en: '121 phone' }, open: 160, inProgress: 290, done: 5120 },
{ name: { fa: 'برق من (اپلیکیشن)', en: 'Bargh-e Man app' }, open: 340, inProgress: 520, done: 6180 }];


export const requestTrend = {
  received: series(1080, 701, { season: 0.5, noise: 0.06, drift: 0.08 }),
  closed: series(1010, 702, { season: 0.45, noise: 0.06, drift: 0.08 })
};

export const serviceQuality: {name: Tx;value: number;target: number;}[] = [
{ name: { fa: 'پاسخ در اولین تماس', en: 'First-contact resolution' }, value: 71, target: 80 },
{ name: { fa: 'درخواست‌های در مهلت', en: 'Requests within SLA' }, value: 83, target: 90 },
{ name: { fa: 'پاسخ تلفن زیر ۶۰ ثانیه', en: 'Calls answered < 60 s' }, value: 88, target: 85 },
{ name: { fa: 'خدمات غیرحضوری', en: 'Digital channel share' }, value: 62, target: 70 }];
