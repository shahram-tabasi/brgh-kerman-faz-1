import type { Kpi, Level } from '../types';
import { company } from './regions';
import { sources } from './sources';

const STANDARD_LINKS = ['API', 'WebService', 'Database', 'Scheduled'];
const pctOf = (n: number, d: number) => Math.round(n / d * 1000) / 10;
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
  target: 90, warn: 100, crit: 130, owner: { fa: 'معاونت بهره‌برداری', en: 'Operations Deputy' },
  value: round(company.saidi, 0), season: 0.8, digits: 0
},
{
  id: 'KPI-02', category: 'operations', name: { fa: 'شاخص SAIFI', en: 'SAIFI' },
  definition: { fa: 'میانگین تعداد دفعات خاموشی هر مشترک', en: 'Average number of interruptions per customer' },
  formula: 'Σ(customers interrupted) / total customers', sources: ['SRC-OMS', 'SRC-CIS'],
  period: M, unit: { fa: 'بار/مشترک', en: 'int./customer' }, direction: 'lower',
  target: 1.4, warn: 1.5, crit: 2.0, owner: { fa: 'معاونت بهره‌برداری', en: 'Operations Deputy' },
  value: round(company.saifi, 2), season: 0.7, digits: 2
},
{
  id: 'KPI-03', category: 'executive', name: { fa: 'تلفات انرژی', en: 'Energy Loss' },
  definition: { fa: 'نسبت انرژی تلف‌شده به انرژی دریافتی', en: 'Share of received energy that is lost' },
  formula: '(E_received − E_billed) / E_received × 100', sources: ['SRC-MDM', 'SRC-CIS'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'lower',
  target: 11, warn: 12, crit: 14, owner: { fa: 'دفتر کاهش تلفات (معاونت فروش)', en: 'Loss Reduction Office' },
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
  formula: 'Σ(restore − report) / events', sources: ['SRC-OMS'],
  period: D, unit: { fa: 'دقیقه', en: 'min' }, direction: 'lower',
  target: 45, warn: 55, crit: 70, owner: { fa: 'معاونت بهره‌برداری', en: 'Operations Deputy' },
  value: round(company.restoreMin, 0), season: 0.4, digits: 0
},
{
  id: 'KPI-06', category: 'operations', name: { fa: 'تعداد خرابی تجهیزات', en: 'Equipment Faults' },
  definition: { fa: 'تعداد خرابی ثبت‌شده تجهیزات شبکه', en: 'Recorded network equipment failures' },
  formula: 'COUNT(fault events)', sources: ['SRC-OMS', 'SRC-AM'],
  period: M, unit: { fa: 'مورد', en: 'events' }, direction: 'lower',
  target: 1100, warn: 1300, crit: 1500, owner: { fa: 'دفتر نگهداری و تعمیرات', en: 'Maintenance Office' },
  value: company.faults, season: 0.9, digits: 0
},
/* ---------- projects ---------- */
{
  id: 'KPI-07', category: 'projects', name: { fa: 'شاخص پیشرفت فیزیکی (SPI)', en: 'Schedule Performance (SPI)' },
  definition: { fa: 'نسبت پیشرفت واقعی به پیشرفت برنامه‌ای', en: 'Actual progress over planned progress' },
  formula: 'Actual % / Planned % × 100', sources: ['SRC-PMIS'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 95, warn: 90, crit: 80, owner: { fa: 'معاونت برنامه‌ریزی و مهندسی', en: 'Planning & Engineering Deputy' },
  value: 87.4, drift: 0.06, digits: 1
},
{
  id: 'KPI-08', category: 'projects', name: { fa: 'سهم پروژه‌های دارای تأخیر', en: 'Delayed Projects Share' },
  definition: { fa: 'درصد پروژه‌های مصوب با انحراف زمانی منفی', en: 'Approved projects behind schedule' },
  formula: 'delayed / approved × 100', sources: ['SRC-PMIS'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'lower',
  target: 10, warn: 20, crit: 30, owner: { fa: 'معاونت برنامه‌ریزی و مهندسی', en: 'Planning & Engineering Deputy' },
  value: round(company.delayedProjects / company.projects * 100, 1), digits: 1
},
{
  id: 'KPI-09', category: 'projects', name: { fa: 'انحراف هزینه پروژه‌ها', en: 'Project Cost Variance' },
  definition: { fa: 'انحراف هزینه واقعی از برآورد مصوب', en: 'Actual cost deviation from approved estimate' },
  formula: '(Actual − Budget) / Budget × 100', sources: ['SRC-PMIS', 'SRC-FIN'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'lower',
  target: 5, warn: 10, crit: 15, owner: { fa: 'معاونت برنامه‌ریزی و مهندسی', en: 'Planning & Engineering Deputy' },
  value: 8.6, drift: 0.1, digits: 1
},
/* ---------- finance ---------- */
{
  id: 'KPI-10', category: 'finance', name: { fa: 'جذب بودجه', en: 'Budget Absorption' },
  definition: { fa: 'نسبت هزینه‌کرد به بودجه مصوب سال (هدف تا پایان مهر: ۷/۱۲ سال)', en: 'Spend over approved annual budget (YTD target to end of Mehr = 7/12)' },
  formula: 'Spent / Approved × 100', sources: ['SRC-FIN'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 58, warn: 50, crit: 42, owner: { fa: 'معاونت مالی و پشتیبانی', en: 'Finance & Support Deputy' },
  value: round(company.spentBn / company.budgetBn * 100, 1), drift: 0.5, digits: 1
},
{
  id: 'KPI-11', category: 'finance', name: { fa: 'نرخ وصول مطالبات', en: 'Collection Rate' },
  definition: { fa: 'نسبت مبالغ وصول‌شده به صورتحساب‌های صادره', en: 'Collected over billed amounts' },
  formula: 'Collected / Billed × 100', sources: ['SRC-CIS', 'SRC-FIN'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 90, warn: 85, crit: 80, owner: { fa: 'معاونت مالی و پشتیبانی', en: 'Finance & Support Deputy' },
  value: round(company.collectionPct, 1), digits: 1
},
{
  id: 'KPI-12', category: 'finance', name: { fa: 'دوره وصول مطالبات', en: 'Days Sales Outstanding' },
  definition: { fa: 'میانگین روزهای وصول مطالبات', en: 'Average days to collect receivables' },
  formula: 'Receivables / Daily billing', sources: ['SRC-CIS', 'SRC-FIN'],
  period: M, unit: { fa: 'روز', en: 'days' }, direction: 'lower',
  target: 60, warn: 75, crit: 90, owner: { fa: 'معاونت مالی و پشتیبانی', en: 'Finance & Support Deputy' },
  value: 82, drift: 0.08, digits: 0
},
{
  id: 'KPI-13', category: 'finance', name: { fa: 'هزینه جاری نسبت به بودجه', en: 'Opex vs Budget' },
  definition: { fa: 'نسبت هزینه‌های جاری به بودجه جاری تا تاریخ', en: 'Operating spend vs year-to-date budget' },
  formula: 'Opex YTD / Opex budget YTD × 100', sources: ['SRC-FIN'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'lower',
  target: 100, warn: 105, crit: 110, owner: { fa: 'معاونت مالی و پشتیبانی', en: 'Finance & Support Deputy' },
  value: 98.6, digits: 1
},
/* ---------- customers ---------- */
{
  id: 'KPI-14', category: 'customers', name: { fa: 'زمان پاسخگویی به درخواست', en: 'Request Response Time' },
  definition: { fa: 'میانگین زمان پاسخ به درخواست‌های مشترکین', en: 'Mean time to respond to customer requests' },
  formula: 'Σ(response − submit) / requests', sources: ['SRC-APP', 'SRC-OMS'],
  period: D, unit: { fa: 'ساعت', en: 'hours' }, direction: 'lower',
  target: 36, warn: 40, crit: 48, owner: { fa: 'معاونت فروش و خدمات مشترکین', en: 'Sales & Customer Services Deputy' },
  value: round(company.responseHrs, 1), season: 0.3, digits: 1
},
{
  id: 'KPI-15', category: 'customers', name: { fa: 'شکایات به ازای ده‌هزار مشترک', en: 'Complaints per 10k Customers' },
  definition: { fa: 'تعداد شکایات ثبت‌شده به ازای هر ۱۰٬۰۰۰ مشترک', en: 'Registered complaints per 10,000 customers' },
  formula: 'complaints / customers × 10,000', sources: ['SRC-APP', 'SRC-CIS'],
  period: M, unit: { fa: 'مورد', en: 'cases' }, direction: 'lower',
  target: 20, warn: 28, crit: 35, owner: { fa: 'معاونت فروش و خدمات مشترکین', en: 'Sales & Customer Services Deputy' },
  value: round(company.complaints / company.customers * 10000, 1), season: 0.6, digits: 1
},
{
  id: 'KPI-16', category: 'customers', name: { fa: 'رضایت مشترکین', en: 'Customer Satisfaction' },
  definition: { fa: 'امتیاز نظرسنجی رضایت پس از خدمت', en: 'Post-service satisfaction survey score' },
  formula: 'AVG(survey score)', sources: ['SRC-APP'],
  period: M, unit: { fa: 'از ۱۰۰', en: 'of 100' }, direction: 'higher',
  target: 80, warn: 75, crit: 68, owner: { fa: 'معاونت فروش و خدمات مشترکین', en: 'Sales & Customer Services Deputy' },
  value: round(company.satisfaction, 1), digits: 1
},
{
  id: 'KPI-17', category: 'customers', name: { fa: 'زمان واگذاری انشعاب جدید', en: 'New Connection Lead Time' },
  definition: { fa: 'میانگین روز از پرداخت تا نصب انشعاب', en: 'Mean days from payment to connection' },
  formula: 'AVG(install − payment)', sources: ['SRC-CIS', 'SRC-APP'],
  period: M, unit: { fa: 'روز', en: 'days' }, direction: 'lower',
  target: 10, warn: 12, crit: 18, owner: { fa: 'معاونت فروش و خدمات مشترکین', en: 'Sales & Customer Services Deputy' },
  value: 13, digits: 0
},
/* ---------- data quality (project success KPIs, section 19) ---------- */
{
  id: 'KPI-18', category: 'data', name: { fa: 'کامل بودن داده', en: 'Data Completeness' },
  definition: { fa: 'درصد فیلدهای الزامی دارای مقدار', en: 'Share of mandatory fields populated' },
  formula: 'non-null mandatory / total mandatory × 100', sources: ['ALL'],
  period: D, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 98, warn: 95, crit: 90, owner: { fa: 'دفتر فناوری اطلاعات و ارتباطات', en: 'ICT Office' },
  value: 93.2, drift: -0.05, digits: 1
},
{
  id: 'KPI-19', category: 'data', name: { fa: 'داده‌های معتبر', en: 'Valid Records' },
  definition: { fa: 'درصد رکوردهای عبوری از قواعد اعتبارسنجی', en: 'Records passing validation rules' },
  formula: 'valid / total × 100', sources: ['ALL'],
  period: D, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 98, warn: 95, crit: 90, owner: { fa: 'دفتر فناوری اطلاعات و ارتباطات', en: 'ICT Office' },
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
  target: 80, warn: 60, crit: 40, owner: { fa: 'دفتر فناوری اطلاعات و ارتباطات', en: 'ICT Office' },
  value: pctOf(sources.filter((x) => STANDARD_LINKS.includes(x.connection)).length, sources.length), drift: -0.4, digits: 0
},
{
  id: 'KPI-22', category: 'data', name: { fa: 'موفقیت فرآیندهای انتقال', en: 'ETL Success Rate' },
  definition: { fa: 'درصد اجراهای موفق فرآیندهای ETL', en: 'Successful ETL job runs' },
  formula: 'succeeded runs / total runs × 100', sources: ['ALL'],
  period: H, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 99, warn: 97, crit: 95, owner: { fa: 'دفتر فناوری اطلاعات و ارتباطات', en: 'ICT Office' },
  value: 97.8, digits: 1
},
{
  id: 'KPI-23', category: 'data', name: { fa: 'به‌روز بودن منابع', en: 'Source Freshness On-Time' },
  definition: { fa: 'درصد منابعی که در تناوب تعریف‌شده به‌روز شده‌اند', en: 'Sources refreshed within their defined cadence' },
  formula: 'on-time sources / total × 100', sources: ['ALL'],
  period: H, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 95, warn: 90, crit: 80, owner: { fa: 'دفتر فناوری اطلاعات و ارتباطات', en: 'ICT Office' },
  value: pctOf(sources.filter((x) => x.pipeline !== 'CRIT').length, sources.length), digits: 1
},
/* ---------- additional operations / sales ---------- */
{
  id: 'KPI-24', category: 'executive', name: { fa: 'انرژی توزیع‌شده', en: 'Energy Distributed' },
  definition: { fa: 'انرژی تحویلی از پست‌های فوق‌توزیع به شبکه شرکت در ماه', en: 'Energy received from sub-transmission in the month' },
  formula: 'Σ(kWh at 20 kV incomers) / 10^6', sources: ['SRC-SCADA', 'SRC-MDM'],
  period: M, unit: { fa: 'گیگاوات‌ساعت', en: 'GWh' }, direction: 'higher',
  target: 560, warn: 480, crit: 400, owner: { fa: 'دیسپاچینگ', en: 'Dispatching' },
  value: 571, season: 1.2, digits: 0
},
{
  id: 'KPI-25', category: 'customers', name: { fa: 'پوشش کنتور هوشمند چاه‌های کشاورزی', en: 'Smart-Meter Coverage (Agri Wells)' },
  definition: { fa: 'نسبت چاه‌های کشاورزی دارای کنتور هوشمند به کل چاه‌های برقی', en: 'Electrified agricultural wells with a smart meter' },
  formula: 'smart-metered wells / all electrified wells × 100', sources: ['SRC-MDM', 'SRC-CIS'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 40, warn: 25, crit: 15, owner: { fa: 'معاونت فروش و خدمات مشترکین', en: 'Sales & Customer Services Deputy' },
  value: 23.8, drift: -0.35, digits: 1
},
/* ---------- data quality (section 19) ---------- */
{
  id: 'KPI-26', category: 'data', name: { fa: 'مغایرت‌های شناسایی‌شده', en: 'Discrepancies Identified' },
  definition: { fa: 'درصد رکوردهای کنترل‌شده که مغایرت در آن‌ها شناسایی شده', en: 'Checked records flagged with a discrepancy' },
  formula: 'flagged / checked records × 100', sources: ['ALL'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'lower',
  target: 2, warn: 4, crit: 6, owner: { fa: 'دفتر فناوری اطلاعات و ارتباطات', en: 'ICT Office' },
  value: 3.4, drift: 0.3, digits: 1
},
{
  id: 'KPI-27', category: 'data', name: { fa: 'داده‌های تکراری', en: 'Duplicate Records' },
  definition: { fa: 'درصد رکوردهای تکراری در موجودیت‌های اصلی (مشترک، تجهیز، پروژه)', en: 'Duplicate rows in master entities' },
  formula: 'duplicates / total master records × 100', sources: ['SRC-CIS', 'SRC-GIS', 'SRC-INV'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'lower',
  target: 0.5, warn: 1, crit: 2, owner: { fa: 'مالکین داده', en: 'Data Owners' },
  value: 1.3, drift: 0.4, digits: 1
},
/* ---------- platform performance (section 19) ---------- */
{
  id: 'KPI-28', category: 'platform', name: { fa: 'زمان تولید گزارش', en: 'Report Generation Time' },
  definition: { fa: 'میانگین زمان تولید گزارش‌های استاندارد مدیریتی', en: 'Mean time to produce a standard management report' },
  formula: 'AVG(report_end − report_start)', sources: ['ALL'],
  period: D, unit: { fa: 'ثانیه', en: 'seconds' }, direction: 'lower',
  target: 10, warn: 20, crit: 40, owner: { fa: 'مجری پروژه', en: 'Contractor' },
  value: 7.5, drift: 0.6, digits: 1
},
{
  id: 'KPI-29', category: 'platform', name: { fa: 'زمان به‌روزرسانی اطلاعات', en: 'Data Refresh Latency' },
  definition: { fa: 'فاصله زمانی تغییر در سامانه مبدأ تا نمایش در لایه یکپارچه (منابع روزانه)', en: 'Source change to unified-layer availability (daily sources)' },
  formula: 'AVG(unified_load_time − source_change_time)', sources: ['ALL'],
  period: D, unit: { fa: 'ساعت', en: 'hours' }, direction: 'lower',
  target: 6, warn: 12, crit: 24, owner: { fa: 'دفتر فناوری اطلاعات و ارتباطات', en: 'ICT Office' },
  value: 9.5, drift: 0.2, digits: 1
},
{
  id: 'KPI-30', category: 'platform', name: { fa: 'زمان پاسخ داشبورد', en: 'Dashboard Response Time' },
  definition: { fa: 'زمان بارگذاری صفحات داشبورد (صدک ۹۵)', en: 'Dashboard page load time (p95)' },
  formula: 'P95(page_load_ms) / 1000', sources: ['ALL'],
  period: D, unit: { fa: 'ثانیه', en: 'seconds' }, direction: 'lower',
  target: 3, warn: 5, crit: 8, owner: { fa: 'مجری پروژه', en: 'Contractor' },
  value: 2.4, digits: 1
},
{
  id: 'KPI-31', category: 'platform', name: { fa: 'تعداد خطاهای انتقال', en: 'Transfer Errors' },
  definition: { fa: 'تعداد خطاهای ثبت‌شده فرآیندهای انتقال داده در ماه', en: 'Logged data-transfer errors per month' },
  formula: 'COUNT(etl_errors)', sources: ['ALL'],
  period: M, unit: { fa: 'مورد', en: 'errors' }, direction: 'lower',
  target: 2000, warn: 4000, crit: 8000, owner: { fa: 'دفتر فناوری اطلاعات و ارتباطات', en: 'ICT Office' },
  value: sources.reduce((a, x) => a + x.errors, 0), drift: -0.3, digits: 0
},
/* ---------- management benefits (section 19) ---------- */
{
  id: 'KPI-32', category: 'management', name: { fa: 'کاهش زمان تهیه گزارش', en: 'Report Preparation Time Saved' },
  definition: { fa: 'کاهش زمان تهیه گزارش‌های مدیریتی نسبت به خط مبنای پیش از پروژه', en: 'Reduction vs pre-project baseline' },
  formula: '(baseline_hours − current_hours) / baseline_hours × 100', sources: ['SRC-RPT'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 60, warn: 40, crit: 20, owner: { fa: 'دفتر برنامه‌ریزی و بودجه', en: 'Planning & Budget Office' },
  value: 46, drift: -0.6, digits: 0
},
{
  id: 'KPI-33', category: 'management', name: { fa: 'کاهش گزارش‌های دستی', en: 'Manual Reports Reduced' },
  definition: { fa: 'درصد گزارش‌های دوره‌ای که از حالت دستی به خودکار منتقل شده‌اند', en: 'Periodic reports moved from manual to automatic' },
  formula: 'automated reports / baseline manual reports × 100', sources: ['SRC-RPT', 'SRC-XLS'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 70, warn: 45, crit: 25, owner: { fa: 'دفتر برنامه‌ریزی و بودجه', en: 'Planning & Budget Office' },
  value: 38, drift: -0.7, digits: 0
},
{
  id: 'KPI-34', category: 'management', name: { fa: 'دسترسی مدیران به اطلاعات', en: 'Manager Access to Information' },
  definition: { fa: 'درصد مدیران هدف که هفته‌ای حداقل یک بار از داشبورد استفاده کرده‌اند', en: 'Target managers using dashboards weekly' },
  formula: 'active managers / target managers × 100', sources: ['ALL'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 85, warn: 65, crit: 45, owner: { fa: 'دفتر فناوری اطلاعات و ارتباطات', en: 'ICT Office' },
  value: 72, drift: -0.5, digits: 0
},
{
  id: 'KPI-35', category: 'management', name: { fa: 'اختلاف اعداد بین گزارش‌ها', en: 'Cross-report Number Mismatch' },
  definition: { fa: 'درصد شاخص‌هایی که در دو گزارش رسمی با مقدار متفاوت اعلام شده‌اند', en: 'KPIs reported with different values in two official reports' },
  formula: 'mismatched KPIs / reported KPIs × 100', sources: ['SRC-RPT'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'lower',
  target: 2, warn: 5, crit: 10, owner: { fa: 'دفتر برنامه‌ریزی و بودجه', en: 'Planning & Budget Office' },
  value: 6.5, drift: 0.8, digits: 1
},
{
  id: 'KPI-36', category: 'management', name: { fa: 'قابلیت ردیابی اطلاعات', en: 'Information Traceability' },
  definition: { fa: 'درصد اعداد داشبورد که منبع و زمان دریافت آن‌ها ثبت شده است', en: 'Dashboard figures with recorded origin and load time' },
  formula: 'figures with lineage / all figures × 100', sources: ['ALL'],
  period: M, unit: { fa: 'درصد', en: '%' }, direction: 'higher',
  target: 100, warn: 90, crit: 75, owner: { fa: 'مجری پروژه', en: 'Contractor' },
  value: 94, digits: 0
},
{
  id: 'KPI-37', category: 'management', name: { fa: 'سرعت تصمیم‌گیری', en: 'Decision Turnaround' },
  definition: { fa: 'میانگین روز از ثبت هشدار بحرانی تا ثبت اقدام مدیریتی', en: 'Mean days from critical alert to management action' },
  formula: 'AVG(action_date − alert_date)', sources: ['ALL'],
  period: M, unit: { fa: 'روز', en: 'days' }, direction: 'lower',
  target: 3, warn: 7, crit: 14, owner: { fa: 'دفتر مدیرعامل', en: 'CEO Office' },
  value: 5.2, drift: 0.4, digits: 1
}];


/** Required data elements per KPI (Data Dictionary ids) — spec §9 «داده‌های موردنیاز». */
const DATA: Record<string, string[]> = {
  'KPI-01': ['DE-OUTAGE', 'DE-CUSTOMER', 'DE-FEEDER'], 'KPI-02': ['DE-OUTAGE', 'DE-CUSTOMER'],
  'KPI-03': ['DE-ENERGY', 'DE-READ', 'DE-BILL'], 'KPI-04': ['DE-LOADING', 'DE-ASSET'], 'KPI-05': ['DE-OUTAGE'],
  'KPI-06': ['DE-OUTAGE', 'DE-ASSET'], 'KPI-07': ['DE-PROJECT'], 'KPI-08': ['DE-PROJECT'], 'KPI-09': ['DE-PROJECT', 'DE-BUDGET'],
  'KPI-10': ['DE-BUDGET'], 'KPI-11': ['DE-BILL'], 'KPI-12': ['DE-BILL'], 'KPI-13': ['DE-BUDGET'],
  'KPI-14': ['DE-REQUEST'], 'KPI-15': ['DE-COMPLAINT', 'DE-CUSTOMER'], 'KPI-16': ['DE-REQUEST'], 'KPI-17': ['DE-REQUEST', 'DE-CUSTOMER'],
  'KPI-24': ['DE-ENERGY'], 'KPI-25': ['DE-CUSTOMER', 'DE-TARIFF', 'DE-READ']
};

export const kpis: Kpi[] = drafts.map(({ season = 0, drift = 0, ...k }, i) => {
  const trend = series(k.value, 101 + i * 7, { season, drift, noise: 0.04 });
  // keep the latest point equal to the reported value
  trend[trend.length - 1] = k.value;
  return { ...k, data: k.data ?? DATA[k.id], trend };
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
