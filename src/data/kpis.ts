import type { Kpi, Level } from '../types';
import { company } from './regions';
import { round, series } from './common';

type Draft = Omit<Kpi, 'trend'> & {season?: number;drift?: number;};

const M = { fa: 'ماهانه', en: 'Monthly' };
const D = { fa: 'روزانه', en: 'Daily' };
const H = { fa: 'ساعتی', en: 'Hourly' };

const drafts: Draft[] = [
/* ---------- reliability / operations ---------- */
{
  id: 'KPI-01', category: 'executive', name: { fa: 'شاخص SAIDI', en: 'SAIDI' },
  definition: { fa: 'میانگین مدت خاموشی هر مشترک در دوره', en: 'Average interruption duration per customer in the period' },
  formula: 'Σ(customer-minutes interrupted) / total customers', sources: ['SRC-OMS', 'SRC-CIS'],
  period: M, unit: { fa: 'دقیقه/مشترک', en: 'min/customer' }, direction: 'lower',
  target: 90, warn: 110, crit: 140, owner: { fa: 'معاونت بهره‌برداری', en: 'Operations Deputy' },
  value: round(company.saidi, 0), season: 0.8, digits: 0
},
{
  id: 'KPI-02', category: 'operations', name: { fa: 'شاخص SAIFI', en: 'SAIFI' },
  definition: { fa: 'میانگین تعداد دفعات خاموشی هر مشترک', en: 'Average number of interruptions per customer' },
  formula: 'Σ(customers interrupted) / total customers', sources: ['SRC-OMS', 'SRC-CIS'],
  period: M, unit: { fa: 'بار/مشترک', en: 'int./customer' }, direction: 'lower',
  target: 1.4, warn: 1.7, crit: 2.2, owner: { fa: 'معاونت بهره‌برداری', en: 'Operations Deputy' },
  value: round(company.saifi, 2), season: 0.7, digits: 2
},
{
  id: 'KPI-03', category: 'executive', name: { fa: 'تلفات انرژی', en: 'Energy Loss' },
  definition: { fa: 'نسبت انرژی تلف‌شده به انرژی دریافتی', en: 'Share of received energy that is lost' },
  formula: '(E_received − E_billed) / E_received × 100', sources: ['SRC-MDM', 'SRC-BILL'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'lower',
  target: 10, warn: 12, crit: 14, owner: { fa: 'دفتر کاهش تلفات', en: 'Loss Reduction Office' },
  value: round(company.lossPct, 1), season: 0.25, digits: 1
},
{
  id: 'KPI-04', category: 'operations', name: { fa: 'ضریب بهره‌برداری ظرفیت', en: 'Capacity Utilisation' },
  definition: { fa: 'نسبت پیک بار به ظرفیت در دسترس', en: 'Peak load over available capacity' },
  formula: 'Peak MW / Available MW × 100', sources: ['SRC-SCADA', 'SRC-GIS'],
  period: D, unit: { fa: 'درصد', en: '%' }, direction: 'lower',
  target: 80, warn: 88, crit: 95, owner: { fa: 'دیسپاچینگ', en: 'Dispatching' },
  value: round(company.peakMW / company.capacityMW * 100, 1), season: 0.6, digits: 1
},
{
  id: 'KPI-05', category: 'operations', name: { fa: 'متوسط زمان رفع خاموشی', en: 'Avg. Restoration Time' },
  definition: { fa: 'میانگین زمان از اعلام تا وصل مجدد', en: 'Mean time from report to restoration' },
  formula: 'Σ(restore − report) / events', sources: ['SRC-OMS', 'SRC-121'],
  period: D, unit: { fa: 'دقیقه', en: 'min' }, direction: 'lower',
  target: 45, warn: 60, crit: 75, owner: { fa: 'معاونت بهره‌برداری', en: 'Operations Deputy' },
  value: round(company.restoreMin, 0), season: 0.4, digits: 0
},
{
  id: 'KPI-06', category: 'operations', name: { fa: 'تعداد خرابی تجهیزات', en: 'Equipment Faults' },
  definition: { fa: 'تعداد خرابی ثبت‌شده تجهیزات شبکه', en: 'Recorded network equipment failures' },
  formula: 'COUNT(fault events)', sources: ['SRC-OMS', 'SRC-AM'],
  period: M, unit: { fa: 'مورد', en: 'events' }, direction: 'lower',
  target: 800, warn: 950, crit: 1100, owner: { fa: 'دفتر نگهداری', en: 'Maintenance Office' },
  value: company.faults, season: 0.9, digits: 0
},
/* ---------- projects ---------- */
{
  id: 'KPI-07', category: 'projects', name: { fa: 'شاخص پیشرفت فیزیکی (SPI)', en: 'Schedule Performance (SPI)' },
  definition: { fa: 'نسبت پیشرفت واقعی به پیشرفت برنامه‌ای', en: 'Actual progress over planned progress' },
  formula: 'Actual % / Planned % × 100', sources: ['SRC-PMIS'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 95, warn: 85, crit: 75, owner: { fa: 'دفتر برنامه‌ریزی و پروژه‌ها', en: 'Planning & Projects' },
  value: 87.4, drift: 0.06, digits: 1
},
{
  id: 'KPI-08', category: 'projects', name: { fa: 'سهم پروژه‌های دارای تأخیر', en: 'Delayed Projects Share' },
  definition: { fa: 'درصد پروژه‌های مصوب با انحراف زمانی منفی', en: 'Approved projects behind schedule' },
  formula: 'delayed / approved × 100', sources: ['SRC-PMIS'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'lower',
  target: 10, warn: 20, crit: 30, owner: { fa: 'دفتر برنامه‌ریزی و پروژه‌ها', en: 'Planning & Projects' },
  value: round(company.delayedProjects / company.projects * 100, 1), digits: 1
},
{
  id: 'KPI-09', category: 'projects', name: { fa: 'انحراف هزینه پروژه‌ها', en: 'Project Cost Variance' },
  definition: { fa: 'انحراف هزینه واقعی از برآورد مصوب', en: 'Actual cost deviation from approved estimate' },
  formula: '(Actual − Budget) / Budget × 100', sources: ['SRC-PMIS', 'SRC-FIN'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'lower',
  target: 5, warn: 10, crit: 15, owner: { fa: 'دفتر برنامه‌ریزی و پروژه‌ها', en: 'Planning & Projects' },
  value: 8.6, drift: 0.1, digits: 1
},
/* ---------- finance ---------- */
{
  id: 'KPI-10', category: 'finance', name: { fa: 'جذب بودجه', en: 'Budget Absorption' },
  definition: { fa: 'نسبت هزینه‌کرد به بودجه مصوب سال', en: 'Spend over approved annual budget' },
  formula: 'Spent / Approved × 100', sources: ['SRC-FIN'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 75, warn: 65, crit: 55, owner: { fa: 'معاونت مالی', en: 'Finance Deputy' },
  value: round(company.spentBn / company.budgetBn * 100, 1), drift: 0.5, digits: 1
},
{
  id: 'KPI-11', category: 'finance', name: { fa: 'نرخ وصول مطالبات', en: 'Collection Rate' },
  definition: { fa: 'نسبت مبالغ وصول‌شده به صورتحساب‌های صادره', en: 'Collected over billed amounts' },
  formula: 'Collected / Billed × 100', sources: ['SRC-BILL', 'SRC-FIN'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 90, warn: 85, crit: 80, owner: { fa: 'معاونت مالی', en: 'Finance Deputy' },
  value: round(company.collectionPct, 1), digits: 1
},
{
  id: 'KPI-12', category: 'finance', name: { fa: 'دوره وصول مطالبات', en: 'Days Sales Outstanding' },
  definition: { fa: 'میانگین روزهای وصول مطالبات', en: 'Average days to collect receivables' },
  formula: 'Receivables / Daily billing', sources: ['SRC-BILL', 'SRC-FIN'],
  period: M, unit: { fa: 'روز', en: 'days' }, direction: 'lower',
  target: 60, warn: 75, crit: 90, owner: { fa: 'معاونت مالی', en: 'Finance Deputy' },
  value: 82, drift: 0.08, digits: 0
},
{
  id: 'KPI-13', category: 'finance', name: { fa: 'هزینه جاری نسبت به بودجه', en: 'Opex vs Budget' },
  definition: { fa: 'نسبت هزینه‌های جاری به بودجه جاری تا تاریخ', en: 'Operating spend vs year-to-date budget' },
  formula: 'Opex YTD / Opex budget YTD × 100', sources: ['SRC-FIN'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'lower',
  target: 100, warn: 105, crit: 110, owner: { fa: 'معاونت مالی', en: 'Finance Deputy' },
  value: 98.6, digits: 1
},
/* ---------- customers ---------- */
{
  id: 'KPI-14', category: 'customers', name: { fa: 'زمان پاسخگویی به درخواست', en: 'Request Response Time' },
  definition: { fa: 'میانگین زمان پاسخ به درخواست‌های مشترکین', en: 'Mean time to respond to customer requests' },
  formula: 'Σ(response − submit) / requests', sources: ['SRC-CRM', 'SRC-121'],
  period: D, unit: { fa: 'ساعت', en: 'hours' }, direction: 'lower',
  target: 36, warn: 48, crit: 60, owner: { fa: 'معاونت خدمات مشترکین', en: 'Customer Services Deputy' },
  value: round(company.responseHrs, 1), season: 0.3, digits: 1
},
{
  id: 'KPI-15', category: 'customers', name: { fa: 'شکایات به ازای ده‌هزار مشترک', en: 'Complaints per 10k Customers' },
  definition: { fa: 'تعداد شکایات ثبت‌شده به ازای هر ۱۰٬۰۰۰ مشترک', en: 'Registered complaints per 10,000 customers' },
  formula: 'complaints / customers × 10,000', sources: ['SRC-CRM', 'SRC-CIS'],
  period: M, unit: { fa: 'مورد', en: 'cases' }, direction: 'lower',
  target: 30, warn: 40, crit: 50, owner: { fa: 'معاونت خدمات مشترکین', en: 'Customer Services Deputy' },
  value: round(company.complaints / company.customers * 10000, 1), season: 0.6, digits: 1
},
{
  id: 'KPI-16', category: 'customers', name: { fa: 'رضایت مشترکین', en: 'Customer Satisfaction' },
  definition: { fa: 'امتیاز نظرسنجی رضایت پس از خدمت', en: 'Post-service satisfaction survey score' },
  formula: 'AVG(survey score)', sources: ['SRC-CRM'],
  period: M, unit: { fa: 'از ۱۰۰', en: 'of 100' }, direction: 'higher',
  target: 80, warn: 72, crit: 65, owner: { fa: 'معاونت خدمات مشترکین', en: 'Customer Services Deputy' },
  value: round(company.satisfaction, 1), digits: 1
},
{
  id: 'KPI-17', category: 'customers', name: { fa: 'زمان واگذاری انشعاب جدید', en: 'New Connection Lead Time' },
  definition: { fa: 'میانگین روز از پرداخت تا نصب انشعاب', en: 'Mean days from payment to connection' },
  formula: 'AVG(install − payment)', sources: ['SRC-CIS', 'SRC-CRM'],
  period: M, unit: { fa: 'روز', en: 'days' }, direction: 'lower',
  target: 10, warn: 15, crit: 21, owner: { fa: 'معاونت خدمات مشترکین', en: 'Customer Services Deputy' },
  value: 13, digits: 0
},
/* ---------- data quality (project success KPIs, section 19) ---------- */
{
  id: 'KPI-18', category: 'data', name: { fa: 'کامل بودن داده', en: 'Data Completeness' },
  definition: { fa: 'درصد فیلدهای الزامی دارای مقدار', en: 'Share of mandatory fields populated' },
  formula: 'non-null mandatory / total mandatory × 100', sources: ['ALL'],
  period: D, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 98, warn: 95, crit: 90, owner: { fa: 'دفتر فناوری اطلاعات', en: 'IT Office' },
  value: 93.2, drift: -0.05, digits: 1
},
{
  id: 'KPI-19', category: 'data', name: { fa: 'داده‌های معتبر', en: 'Valid Records' },
  definition: { fa: 'درصد رکوردهای عبوری از قواعد اعتبارسنجی', en: 'Records passing validation rules' },
  formula: 'valid / total × 100', sources: ['ALL'],
  period: D, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 98, warn: 95, crit: 90, owner: { fa: 'دفتر فناوری اطلاعات', en: 'IT Office' },
  value: 96.1, drift: -0.03, digits: 1
},
{
  id: 'KPI-20', category: 'data', name: { fa: 'مغایرت‌های اصلاح‌شده', en: 'Discrepancies Resolved' },
  definition: { fa: 'درصد مغایرت‌های شناسایی‌شده که اصلاح شده‌اند', en: 'Identified discrepancies that were fixed' },
  formula: 'resolved / identified × 100', sources: ['ALL'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 90, warn: 75, crit: 60, owner: { fa: 'مالکین داده', en: 'Data Owners' },
  value: 68, drift: -0.3, digits: 0
},
{
  id: 'KPI-21', category: 'data', name: { fa: 'منابع دارای اتصال استاندارد', en: 'Sources with Standard Link' },
  definition: { fa: 'درصد منابع متصل از طریق API/سرویس/پایگاه داده', en: 'Sources linked via API / service / DB' },
  formula: 'standard-linked / total sources × 100', sources: ['ALL'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 80, warn: 60, crit: 40, owner: { fa: 'دفتر فناوری اطلاعات', en: 'IT Office' },
  value: 57, drift: -0.4, digits: 0
},
{
  id: 'KPI-22', category: 'data', name: { fa: 'موفقیت فرآیندهای انتقال', en: 'ETL Success Rate' },
  definition: { fa: 'درصد اجراهای موفق فرآیندهای ETL', en: 'Successful ETL job runs' },
  formula: 'succeeded runs / total runs × 100', sources: ['ALL'],
  period: H, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 99, warn: 97, crit: 95, owner: { fa: 'دفتر فناوری اطلاعات', en: 'IT Office' },
  value: 97.8, digits: 1
},
{
  id: 'KPI-23', category: 'data', name: { fa: 'به‌روز بودن منابع', en: 'Source Freshness On-Time' },
  definition: { fa: 'درصد منابعی که در تناوب تعریف‌شده به‌روز شده‌اند', en: 'Sources refreshed within their defined cadence' },
  formula: 'on-time sources / total × 100', sources: ['ALL'],
  period: H, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 95, warn: 90, crit: 80, owner: { fa: 'دفتر فناوری اطلاعات', en: 'IT Office' },
  value: 85.7, digits: 1
}];


export const kpis: Kpi[] = drafts.map(({ season = 0, drift = 0, ...k }, i) => {
  const trend = series(k.value, 101 + i * 7, { season, drift, noise: 0.04 });
  // keep the latest point equal to the reported value
  trend[trend.length - 1] = k.value;
  return { ...k, trend };
});

export const kpiById = (id: string) => kpis.find((k) => k.id === id)!;

/** Rule-based threshold evaluation (KPI Master: target / warning / critical). */
export function levelOf(k: Pick<Kpi, 'direction' | 'warn' | 'crit'>, value: number): Level {
  if (k.direction === 'lower') {
    if (value > k.crit) return 'CRIT';
    if (value > k.warn) return 'WARN';
    return 'OK';
  }
  if (value < k.crit) return 'CRIT';
  if (value < k.warn) return 'WARN';
  return 'OK';
}

export const kpiLevel = (k: Kpi) => levelOf(k, k.value);

/** Percentage achievement against target (100 = on target). */
export function achievement(k: Kpi): number {
  const r = k.direction === 'higher' ? k.value / k.target : k.target / k.value;
  return Math.round(Math.min(130, r * 100));
}
