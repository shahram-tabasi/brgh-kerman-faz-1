import type { Level, Tx } from '../types';

export interface Deputy {
  id: string;
  name: Tx;
}

/** The five deputies of a Tavanir distribution company (HQ: 5 deputies, per public company profile) + ICT office. */
export const deputies: Deputy[] = [
{ id: 'DEP-PLN', name: { fa: 'معاونت برنامه‌ریزی و مهندسی', en: 'Planning & Engineering Deputy' } },
{ id: 'DEP-OPS', name: { fa: 'معاونت بهره‌برداری', en: 'Operations Deputy' } },
{ id: 'DEP-SVC', name: { fa: 'معاونت فروش و خدمات مشترکین', en: 'Sales & Customer Services Deputy' } },
{ id: 'DEP-FIN', name: { fa: 'معاونت مالی و پشتیبانی', en: 'Finance & Support Deputy' } },
{ id: 'DEP-IT', name: { fa: 'دفتر فناوری اطلاعات و ارتباطات', en: 'ICT Office' } }];


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

/**
 * Flagship projects of the 1405 programme (amounts in billion toman).
 * Anchored to public items: Mianchil 132/20 kV substation (Jiroft) outgoing feeders, first-time electrification of 36 villages,
 * agricultural smart meters (~11k wells already smart), summer-peak 1405 reinforcement programme (~425 bn toman).
 */
export const projects: Project[] = [
{ id: 'PRJ-101', name: { fa: 'احداث فیدرهای ۲۰ کیلوولت خروجی پست میانچیل', en: '20 kV outgoing feeders — Mianchil substation' }, deputyId: 'DEP-PLN', regionId: 'JRF', budgetBn: 68, spentBn: 49, planned: 80, physical: 71, financial: 72, delayDays: 26, costVarPct: 4.1, contract: 'ACTIVE', contractor: { fa: 'پیمانکار شبکه (نمونه)', en: 'Network contractor (sample)' }, goalsMet: 2, goalsTotal: 4, critical: false, risk: 'WARN', activities: acts(80, 71, NET) },
{ id: 'PRJ-102', name: { fa: 'برق‌رسانی به ۳۶ روستای فاقد برق', en: 'First-time electrification of 36 villages' }, deputyId: 'DEP-PLN', regionId: 'RJN', budgetBn: 54, spentBn: 51, planned: 100, physical: 94, financial: 95, delayDays: 18, costVarPct: 3.2, contract: 'ACTIVE', contractor: { fa: 'پیمانکاران منطقه‌ای', en: 'Regional contractors' }, goalsMet: 3, goalsTotal: 4, critical: false, risk: 'WARN', activities: acts(100, 94, NET) },
{ id: 'PRJ-103', name: { fa: 'افزایش ظرفیت ترانسفورماتورهای پربار برای پیک ۱۴۰۵', en: 'Up-rating overloaded transformers for peak 1405' }, deputyId: 'DEP-OPS', regionId: 'ANB', budgetBn: 85, spentBn: 79, planned: 100, physical: 78, financial: 93, delayDays: 74, costVarPct: 12.6, contract: 'ACTIVE', contractor: { fa: 'پیمانکار تجهیزات (نمونه)', en: 'Equipment contractor (sample)' }, goalsMet: 1, goalsTotal: 4, critical: true, risk: 'CRIT', activities: acts(100, 78, NET) },
{ id: 'PRJ-104', name: { fa: 'نصب کنتور هوشمند چاه‌های کشاورزی', en: 'Smart meters for agricultural wells' }, deputyId: 'DEP-SVC', regionId: 'JRF', budgetBn: 72, spentBn: 31, planned: 50, physical: 41, financial: 43, delayDays: 35, costVarPct: 2.0, contract: 'ACTIVE', contractor: { fa: 'تأمین‌کننده کنتور (نمونه)', en: 'Meter supplier (sample)' }, goalsMet: 1, goalsTotal: 4, critical: false, risk: 'WARN', activities: acts(50, 41, NET) },
{ id: 'PRJ-105', name: { fa: 'اصلاح شبکه فرسوده فشار ضعیف بم', en: 'Aged LV network renewal — Bam' }, deputyId: 'DEP-OPS', regionId: 'BAM', budgetBn: 38, spentBn: 24, planned: 65, physical: 66, financial: 63, delayDays: 0, costVarPct: 1.1, contract: 'ACTIVE', contractor: { fa: 'پیمانکار شبکه (نمونه)', en: 'Network contractor (sample)' }, goalsMet: 3, goalsTotal: 4, critical: false, risk: 'OK', activities: acts(65, 66, NET) },
{ id: 'PRJ-106', name: { fa: 'تبدیل شبکه فشار ضعیف به کابل خودنگهدار (کاهش تلفات)', en: 'LV aerial bundled cable (loss reduction)' }, deputyId: 'DEP-SVC', regionId: 'QGJ', budgetBn: 41, spentBn: 33, planned: 85, physical: 62, financial: 80, delayDays: 63, costVarPct: 10.8, contract: 'ACTIVE', contractor: { fa: 'پیمانکار شبکه (نمونه)', en: 'Network contractor (sample)' }, goalsMet: 1, goalsTotal: 4, critical: true, risk: 'CRIT', activities: acts(85, 62, NET) },
{ id: 'PRJ-107', name: { fa: 'نصب ریکلوزر و سکسیونر قابل کنترل از راه دور', en: 'Remote-controlled reclosers & sectionalisers' }, deputyId: 'DEP-OPS', regionId: 'SRJ', budgetBn: 33, spentBn: 19, planned: 60, physical: 56, financial: 58, delayDays: 12, costVarPct: 2.6, contract: 'ACTIVE', contractor: { fa: 'تأمین‌کننده تجهیزات (نمونه)', en: 'Equipment supplier (sample)' }, goalsMet: 2, goalsTotal: 4, critical: false, risk: 'OK', activities: acts(60, 56, NET) },
{ id: 'PRJ-108', name: { fa: 'احداث پست‌های کمپکت شهرک صنعتی سیرجان', en: 'Compact substations — Sirjan industrial estate' }, deputyId: 'DEP-PLN', regionId: 'SRJ', budgetBn: 46, spentBn: 12, planned: 30, physical: 24, financial: 26, delayDays: 21, costVarPct: 0.8, contract: 'SIGNED', contractor: { fa: 'پیمانکار پست (نمونه)', en: 'Substation contractor (sample)' }, goalsMet: 0, goalsTotal: 3, critical: false, risk: 'WARN', activities: acts(30, 24, SUB) },
{ id: 'PRJ-109', name: { fa: 'برق‌رسانی به چاه‌های کشاورزی متقاضی', en: 'Connecting pending agricultural wells' }, deputyId: 'DEP-PLN', regionId: 'RJN', budgetBn: 39, spentBn: 0, planned: 10, physical: 0, financial: 0, delayDays: 30, costVarPct: 0, contract: 'TENDER', contractor: { fa: 'در حال مناقصه', en: 'In tender' }, goalsMet: 0, goalsTotal: 3, critical: false, risk: 'WARN', activities: acts(10, 0, NET) },
{ id: 'PRJ-110', name: { fa: 'نیروگاه‌های خورشیدی مقیاس کوچک (ادارات و چاه‌ها)', en: 'Small-scale solar (offices & wells)' }, deputyId: 'DEP-PLN', regionId: 'KHN', budgetBn: 52, spentBn: 38, planned: 70, physical: 72, financial: 73, delayDays: 0, costVarPct: -1.4, contract: 'ACTIVE', contractor: { fa: 'سرمایه‌گذار / پیمانکار خورشیدی', en: 'Solar investor / contractor' }, goalsMet: 3, goalsTotal: 4, critical: false, risk: 'OK', activities: acts(70, 72, SUB) },
{ id: 'PRJ-111', name: { fa: 'جابه‌جایی شبکه در مسیر طرح‌های عمرانی', en: 'Line relocation for civil works' }, deputyId: 'DEP-OPS', regionId: 'KHN', budgetBn: 18, spentBn: 13, planned: 75, physical: 70, financial: 72, delayDays: 9, costVarPct: 3.5, contract: 'ACTIVE', contractor: { fa: 'پیمانکار شبکه (نمونه)', en: 'Network contractor (sample)' }, goalsMet: 2, goalsTotal: 3, critical: false, risk: 'OK', activities: acts(75, 70, NET) },
{ id: 'PRJ-112', name: { fa: 'پلتفرم یکپارچه اطلاعات مدیریتی — فاز Pilot', en: 'Integrated information platform — Pilot' }, deputyId: 'DEP-IT', regionId: 'JRF', budgetBn: 9, spentBn: 2.5, planned: 25, physical: 27, financial: 28, delayDays: 0, costVarPct: 0, contract: 'ACTIVE', contractor: { fa: 'مجری پروژه', en: 'Project contractor' }, goalsMet: 1, goalsTotal: 6, critical: false, risk: 'OK', activities: acts(25, 27, IT) },
{ id: 'PRJ-113', name: { fa: 'استقرار سامانه مکانیزه نگهداری و تعمیرات', en: 'Maintenance management system (CMMS)' }, deputyId: 'DEP-IT', regionId: 'SRJ', budgetBn: 14, spentBn: 10, planned: 75, physical: 46, financial: 71, delayDays: 88, costVarPct: 13.9, contract: 'SUSPENDED', contractor: { fa: 'شرکت نرم‌افزاری (نمونه)', en: 'Software vendor (sample)' }, goalsMet: 1, goalsTotal: 5, critical: true, risk: 'CRIT', activities: acts(75, 46, IT) },
{ id: 'PRJ-114', name: { fa: 'مرکز پایش مصرف برق ادارات استان', en: 'Government buildings consumption monitoring centre' }, deputyId: 'DEP-SVC', regionId: 'SRJ', budgetBn: 6, spentBn: 6, planned: 100, physical: 100, financial: 100, delayDays: 0, costVarPct: 0, contract: 'CLOSED', contractor: { fa: 'تحویل شده', en: 'Delivered' }, goalsMet: 4, goalsTotal: 4, critical: false, risk: 'OK', activities: acts(100, 100, IT) }];


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
