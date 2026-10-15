import type { Level, Tx } from '../types';

export interface Deputy {
  id: string;
  name: Tx;
}

export const deputies: Deputy[] = [
{ id: 'DEP-OPS', name: { fa: 'معاونت بهره‌برداری', en: 'Operations Deputy' } },
{ id: 'DEP-PLN', name: { fa: 'معاونت برنامه‌ریزی و مهندسی', en: 'Planning & Engineering Deputy' } },
{ id: 'DEP-SVC', name: { fa: 'معاونت خدمات مشترکین', en: 'Customer Services Deputy' } },
{ id: 'DEP-IT', name: { fa: 'دفتر فناوری اطلاعات', en: 'IT Office' } }];


export type ContractStatus = 'SIGNED' | 'TENDER' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';

export interface Activity {
  name: Tx;
  planned: number;
  actual: number;
}

export interface Project {
  id: string;
  name: Tx;
  deputyId: string;
  regionId: string;
  budgetBn: number;
  spentBn: number;
  planned: number;
  physical: number;
  financial: number;
  delayDays: number;
  costVarPct: number;
  contract: ContractStatus;
  contractor: Tx;
  goalsMet: number;
  goalsTotal: number;
  critical: boolean;
  risk: Level;
  activities: Activity[];
}

const acts = (p: number, a: number, names: [string, string][]): Activity[] =>
names.map(([fa, en], i) => {
  const w = (i + 1) / names.length;
  return { name: { fa, en }, planned: Math.min(100, Math.round(p * (1.25 - w * 0.5))), actual: Math.min(100, Math.round(a * (1.25 - w * 0.5))) };
});

const NET: [string, string][] = [['طراحی و نقشه', 'Design & drawings'], ['تأمین تجهیزات', 'Equipment supply'], ['اجرای عملیات', 'Construction'], ['تست و تحویل', 'Test & handover']];
const SUB: [string, string][] = [['مطالعات', 'Studies'], ['ساختمان و فونداسیون', 'Civil works'], ['نصب تجهیزات', 'Installation'], ['راه‌اندازی', 'Commissioning']];
const IT: [string, string][] = [['نیازسنجی', 'Requirements'], ['پیاده‌سازی', 'Implementation'], ['آزمون', 'Testing'], ['استقرار و آموزش', 'Rollout & training']];

export const projects: Project[] = [
{ id: 'PRJ-101', name: { fa: 'احداث فیدر ۲۰ کیلوولت جیرفت شمالی', en: '20 kV feeder — North Jiroft' }, deputyId: 'DEP-PLN', regionId: 'JRF', budgetBn: 640, spentBn: 512, planned: 85, physical: 78, financial: 80, delayDays: 21, costVarPct: 6.2, contract: 'ACTIVE', contractor: { fa: 'نیروگستر جنوب', en: 'Niroogostar Jonub' }, goalsMet: 3, goalsTotal: 5, critical: false, risk: 'WARN', activities: acts(85, 78, NET) },
{ id: 'PRJ-102', name: { fa: 'پست ۶۳/۲۰ کیلوولت عنبرآباد ۲', en: '63/20 kV substation — Anbarabad 2' }, deputyId: 'DEP-PLN', regionId: 'ANB', budgetBn: 1180, spentBn: 1020, planned: 70, physical: 52, financial: 86, delayDays: 96, costVarPct: 14.8, contract: 'ACTIVE', contractor: { fa: 'توان‌سازه کرمان', en: 'Tavan Sazeh Kerman' }, goalsMet: 1, goalsTotal: 4, critical: true, risk: 'CRIT', activities: acts(70, 52, SUB) },
{ id: 'PRJ-103', name: { fa: 'برق‌رسانی چاه‌های کشاورزی رودبار', en: 'Agricultural wells electrification — Rudbar' }, deputyId: 'DEP-OPS', regionId: 'RJN', budgetBn: 420, spentBn: 388, planned: 90, physical: 71, financial: 92, delayDays: 64, costVarPct: 11.3, contract: 'ACTIVE', contractor: { fa: 'برق‌آوران هلیل', en: 'Barghavaran Halil' }, goalsMet: 2, goalsTotal: 5, critical: true, risk: 'CRIT', activities: acts(90, 71, NET) },
{ id: 'PRJ-104', name: { fa: 'تبدیل شبکه فشار ضعیف به کابل خودنگهدار کهنوج', en: 'LV aerial bundled cable — Kahnuj' }, deputyId: 'DEP-OPS', regionId: 'KHN', budgetBn: 310, spentBn: 214, planned: 65, physical: 66, financial: 69, delayDays: 0, costVarPct: 1.4, contract: 'ACTIVE', contractor: { fa: 'شبکه‌سازان کویر', en: 'Shabakesazan Kavir' }, goalsMet: 3, goalsTotal: 4, critical: false, risk: 'OK', activities: acts(65, 66, NET) },
{ id: 'PRJ-105', name: { fa: 'نصب ریکلوزر و سکسیونر هوشمند', en: 'Recloser & sectionaliser rollout' }, deputyId: 'DEP-OPS', regionId: 'JRF', budgetBn: 280, spentBn: 160, planned: 60, physical: 55, financial: 57, delayDays: 14, costVarPct: 3.1, contract: 'ACTIVE', contractor: { fa: 'پارس کلید', en: 'Pars Kelid' }, goalsMet: 2, goalsTotal: 4, critical: false, risk: 'WARN', activities: acts(60, 55, NET) },
{ id: 'PRJ-106', name: { fa: 'تعویض کنتورهای فرسوده با کنتور هوشمند', en: 'Smart meter replacement' }, deputyId: 'DEP-SVC', regionId: 'KHN', budgetBn: 520, spentBn: 290, planned: 55, physical: 58, financial: 56, delayDays: 0, costVarPct: -2.0, contract: 'ACTIVE', contractor: { fa: 'کنتورسازی ایران', en: 'Iran Meter Co.' }, goalsMet: 3, goalsTotal: 4, critical: false, risk: 'OK', activities: acts(55, 58, NET) },
{ id: 'PRJ-107', name: { fa: 'احداث فیدر اختصاصی منوجان', en: 'Dedicated feeder — Manujan' }, deputyId: 'DEP-PLN', regionId: 'MNJ', budgetBn: 360, spentBn: 120, planned: 40, physical: 38, financial: 33, delayDays: 9, costVarPct: 2.4, contract: 'SIGNED', contractor: { fa: 'نیروگستر جنوب', en: 'Niroogostar Jonub' }, goalsMet: 1, goalsTotal: 4, critical: false, risk: 'OK', activities: acts(40, 38, NET) },
{ id: 'PRJ-108', name: { fa: 'بهینه‌سازی شبکه قلعه‌گنج و کاهش تلفات', en: 'Qaleh Ganj network optimisation & loss cut' }, deputyId: 'DEP-OPS', regionId: 'QGJ', budgetBn: 290, spentBn: 230, planned: 80, physical: 61, financial: 79, delayDays: 47, costVarPct: 9.5, contract: 'ACTIVE', contractor: { fa: 'برق‌آوران هلیل', en: 'Barghavaran Halil' }, goalsMet: 2, goalsTotal: 5, critical: false, risk: 'WARN', activities: acts(80, 61, NET) },
{ id: 'PRJ-109', name: { fa: 'پست کمپکت فاریاب', en: 'Compact substation — Faryab' }, deputyId: 'DEP-PLN', regionId: 'FRB', budgetBn: 190, spentBn: 0, planned: 10, physical: 0, financial: 0, delayDays: 30, costVarPct: 0, contract: 'TENDER', contractor: { fa: 'در حال مناقصه', en: 'In tender' }, goalsMet: 0, goalsTotal: 3, critical: false, risk: 'WARN', activities: acts(10, 0, SUB) },
{ id: 'PRJ-110', name: { fa: 'توسعه شبکه ارزوئیه', en: 'Network expansion — Arzuiyeh' }, deputyId: 'DEP-PLN', regionId: 'ARZ', budgetBn: 230, spentBn: 205, planned: 95, physical: 96, financial: 89, delayDays: 0, costVarPct: -1.1, contract: 'ACTIVE', contractor: { fa: 'شبکه‌سازان کویر', en: 'Shabakesazan Kavir' }, goalsMet: 4, goalsTotal: 4, critical: false, risk: 'OK', activities: acts(95, 96, NET) },
{ id: 'PRJ-111', name: { fa: 'پلتفرم یکپارچه اطلاعات (فاز Pilot)', en: 'Integrated information platform (Pilot)' }, deputyId: 'DEP-IT', regionId: 'JRF', budgetBn: 85, spentBn: 31, planned: 35, physical: 38, financial: 36, delayDays: 0, costVarPct: 0.5, contract: 'ACTIVE', contractor: { fa: 'مجری پروژه', en: 'Project contractor' }, goalsMet: 2, goalsTotal: 6, critical: false, risk: 'OK', activities: acts(35, 38, IT) },
{ id: 'PRJ-112', name: { fa: 'استقرار سامانه مدیریت دارایی', en: 'Asset management system rollout' }, deputyId: 'DEP-IT', regionId: 'JRF', budgetBn: 140, spentBn: 98, planned: 75, physical: 49, financial: 70, delayDays: 58, costVarPct: 12.6, contract: 'SUSPENDED', contractor: { fa: 'داده‌پردازان سپهر', en: 'Sepehr Data' }, goalsMet: 1, goalsTotal: 5, critical: true, risk: 'CRIT', activities: acts(75, 49, IT) },
{ id: 'PRJ-113', name: { fa: 'خودکارسازی مرکز تماس ۱۲۱', en: '121 call-centre automation' }, deputyId: 'DEP-SVC', regionId: 'JRF', budgetBn: 75, spentBn: 75, planned: 100, physical: 100, financial: 100, delayDays: 0, costVarPct: 0, contract: 'CLOSED', contractor: { fa: 'ارتباط‌گستر', en: 'Ertebat Gostar' }, goalsMet: 4, goalsTotal: 4, critical: false, risk: 'OK', activities: acts(100, 100, IT) },
{ id: 'PRJ-114', name: { fa: 'جابه‌جایی شبکه مسیر کمربندی کهنوج', en: 'Kahnuj ring-road line relocation' }, deputyId: 'DEP-OPS', regionId: 'KHN', budgetBn: 160, spentBn: 112, planned: 70, physical: 64, financial: 70, delayDays: 18, costVarPct: 4.8, contract: 'ACTIVE', contractor: { fa: 'پارس کلید', en: 'Pars Kelid' }, goalsMet: 2, goalsTotal: 3, critical: false, risk: 'WARN', activities: acts(70, 64, NET) }];


export const contractLabel: Record<ContractStatus, Tx> = {
  SIGNED: { fa: 'منعقد شده', en: 'Signed' },
  TENDER: { fa: 'در مناقصه', en: 'In tender' },
  ACTIVE: { fa: 'در حال اجرا', en: 'Active' },
  SUSPENDED: { fa: 'متوقف', en: 'Suspended' },
  CLOSED: { fa: 'خاتمه یافته', en: 'Closed' }
};

export const projectTotals = {
  count: projects.length,
  budgetBn: projects.reduce((a, p) => a + p.budgetBn, 0),
  spentBn: projects.reduce((a, p) => a + p.spentBn, 0),
  avgPhysical: Math.round(projects.reduce((a, p) => a + p.physical, 0) / projects.length),
  avgPlanned: Math.round(projects.reduce((a, p) => a + p.planned, 0) / projects.length),
  avgFinancial: Math.round(projects.reduce((a, p) => a + p.financial, 0) / projects.length),
  delayed: projects.filter((p) => p.delayDays > 0).length,
  critical: projects.filter((p) => p.critical).length,
  atRisk: projects.filter((p) => p.risk !== 'OK').length,
  goalsMet: projects.reduce((a, p) => a + p.goalsMet, 0),
  goalsTotal: projects.reduce((a, p) => a + p.goalsTotal, 0)
};
