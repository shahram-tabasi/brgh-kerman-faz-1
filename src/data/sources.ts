import type { Level, Tx } from '../types';

export type Connection = 'API' | 'WebService' | 'Database' | 'File' | 'Manual';
export type QualityGrade = 'GOOD' | 'MEDIUM' | 'POOR';

/** Seven data-quality dimensions from section 8 of the specification. */
export const DIMENSIONS = ['completeness', 'accuracy', 'consistency', 'uniqueness', 'timeliness', 'validity', 'traceability'] as const;
export type Dimension = typeof DIMENSIONS[number];

export const dimensionLabel: Record<Dimension, Tx & {q: Tx;}> = {
  completeness: { fa: 'کامل بودن', en: 'Completeness', q: { fa: 'آیا اطلاعات موردنیاز وجود دارد؟', en: 'Is the required data present?' } },
  accuracy: { fa: 'صحت', en: 'Accuracy', q: { fa: 'آیا مقدار ثبت‌شده صحیح است؟', en: 'Is the recorded value correct?' } },
  consistency: { fa: 'سازگاری', en: 'Consistency', q: { fa: 'آیا اطلاعات سامانه‌های مختلف با یکدیگر سازگار است؟', en: 'Is data consistent across systems?' } },
  uniqueness: { fa: 'یکتایی', en: 'Uniqueness', q: { fa: 'آیا یک موجودیت چند بار ثبت شده است؟', en: 'Is an entity recorded more than once?' } },
  timeliness: { fa: 'به‌روز بودن', en: 'Timeliness', q: { fa: 'آیا اطلاعات در زمان مناسب به‌روزرسانی شده است؟', en: 'Was data refreshed on time?' } },
  validity: { fa: 'اعتبار', en: 'Validity', q: { fa: 'آیا داده در محدوده و قالب مجاز قرار دارد؟', en: 'Is data within allowed range and format?' } },
  traceability: { fa: 'قابلیت ردیابی', en: 'Traceability', q: { fa: 'آیا مشخص است داده از کدام منبع و در چه زمانی دریافت شده است؟', en: 'Is origin and time of receipt known?' } }
};

export interface DataSource {
  id: string;
  name: Tx;
  owner: Tx;
  infoType: Tx;
  generation: 'AUTO' | 'MANUAL' | 'MIXED';
  frequency: Tx;
  format: string;
  access: Tx;
  connection: Connection;
  grade: QualityGrade;
  problems: Tx[];
  /** pipeline state */
  pipeline: Level;
  lastSync: Tx;
  records: number;
  errors: number;
  scores: Record<Dimension, number>;
  pilot?: boolean;
}

const unitOps = { fa: 'معاونت بهره‌برداری', en: 'Operations Deputy' };
const unitSvc = { fa: 'معاونت خدمات مشترکین', en: 'Customer Services Deputy' };
const unitFin = { fa: 'معاونت مالی', en: 'Finance Deputy' };
const unitPlan = { fa: 'معاونت برنامه‌ریزی', en: 'Planning Deputy' };
const unitHr = { fa: 'معاونت منابع انسانی', en: 'HR Deputy' };
const unitIt = { fa: 'دفتر فناوری اطلاعات', en: 'IT Office' };

const P = {
  dup: { fa: 'رکورد تکراری', en: 'Duplicate records' },
  gap: { fa: 'کمبود فیلد', en: 'Missing fields' },
  mismatch: { fa: 'مغایرت با سامانه دیگر', en: 'Mismatch with another system' },
  late: { fa: 'تأخیر در به‌روزرسانی', en: 'Late refresh' },
  code: { fa: 'کدگذاری غیراستاندارد', en: 'Non-standard codes' },
  manual: { fa: 'ورود دستی', en: 'Manual entry' },
  range: { fa: 'مقادیر خارج از محدوده', en: 'Out-of-range values' }
};

const sc = (c: number, a: number, s: number, u: number, t: number, v: number, tr: number): Record<Dimension, number> => ({
  completeness: c, accuracy: a, consistency: s, uniqueness: u, timeliness: t, validity: v, traceability: tr
});

export const sources: DataSource[] = [
{
  id: 'SRC-OMS', name: { fa: 'سامانه خاموشی و حوادث', en: 'Outage & Incident System (OMS)' }, owner: unitOps,
  infoType: { fa: 'عملیاتی', en: 'Operational' }, generation: 'MIXED', frequency: { fa: 'لحظه‌ای', en: 'Real-time' },
  format: 'Database', access: { fa: 'بهره‌برداری، مدیریت ارشد', en: 'Operations, Executives' }, connection: 'Database', grade: 'MEDIUM',
  problems: [P.gap, P.mismatch], pipeline: 'OK', lastSync: { fa: '۲ دقیقه پیش', en: '2 min ago' }, records: 186420, errors: 12,
  scores: sc(91, 93, 86, 97, 98, 95, 96), pilot: true
},
{
  id: 'SRC-SCADA', name: { fa: 'سامانه اسکادا / دیسپاچینگ', en: 'SCADA / Dispatching' }, owner: { fa: 'دیسپاچینگ', en: 'Dispatching' },
  infoType: { fa: 'عملیاتی', en: 'Operational' }, generation: 'AUTO', frequency: { fa: 'لحظه‌ای', en: 'Real-time' },
  format: 'API', access: { fa: 'بهره‌برداری', en: 'Operations' }, connection: 'API', grade: 'GOOD',
  problems: [P.range], pipeline: 'OK', lastSync: { fa: '۳۰ ثانیه پیش', en: '30 s ago' }, records: 2840000, errors: 3,
  scores: sc(97, 96, 94, 99, 99, 93, 99), pilot: true
},
{
  id: 'SRC-GIS', name: { fa: 'سامانه اطلاعات مکانی (GIS)', en: 'GIS' }, owner: unitPlan,
  infoType: { fa: 'دارایی و شبکه', en: 'Assets & Network' }, generation: 'MIXED', frequency: { fa: 'هفتگی', en: 'Weekly' },
  format: 'Database', access: { fa: 'برنامه‌ریزی، بهره‌برداری', en: 'Planning, Operations' }, connection: 'Database', grade: 'MEDIUM',
  problems: [P.gap, P.mismatch, P.code], pipeline: 'WARN', lastSync: { fa: '۶ روز پیش', en: '6 days ago' }, records: 94310, errors: 418,
  scores: sc(84, 88, 79, 95, 82, 90, 92), pilot: true
},
{
  id: 'SRC-CIS', name: { fa: 'سامانه مشترکین', en: 'Customer Information System' }, owner: unitSvc,
  infoType: { fa: 'مشترکین', en: 'Customers' }, generation: 'AUTO', frequency: { fa: 'روزانه', en: 'Daily' },
  format: 'WebService', access: { fa: 'خدمات مشترکین، مالی', en: 'Customer services, Finance' }, connection: 'WebService', grade: 'GOOD',
  problems: [P.dup], pipeline: 'OK', lastSync: { fa: '۴ ساعت پیش', en: '4 h ago' }, records: 423100, errors: 27,
  scores: sc(95, 94, 90, 91, 96, 96, 97), pilot: true
},
{
  id: 'SRC-BILL', name: { fa: 'سامانه فروش و صورتحساب', en: 'Billing & Sales' }, owner: unitFin,
  infoType: { fa: 'مالی و مشترکین', en: 'Financial & Customers' }, generation: 'AUTO', frequency: { fa: 'روزانه', en: 'Daily' },
  format: 'Database', access: { fa: 'مالی', en: 'Finance' }, connection: 'Database', grade: 'GOOD',
  problems: [P.mismatch], pipeline: 'OK', lastSync: { fa: '۵ ساعت پیش', en: '5 h ago' }, records: 1290400, errors: 41,
  scores: sc(96, 95, 88, 98, 95, 97, 96)
},
{
  id: 'SRC-MDM', name: { fa: 'سامانه قرائت و اندازه‌گیری (AMR/MDM)', en: 'Metering (AMR / MDM)' }, owner: unitSvc,
  infoType: { fa: 'اندازه‌گیری', en: 'Metering' }, generation: 'AUTO', frequency: { fa: 'ساعتی', en: 'Hourly' },
  format: 'API', access: { fa: 'خدمات مشترکین، کاهش تلفات', en: 'Customer services, Loss office' }, connection: 'API', grade: 'MEDIUM',
  problems: [P.gap, P.range], pipeline: 'WARN', lastSync: { fa: '۳ ساعت پیش', en: '3 h ago' }, records: 5120000, errors: 2380,
  scores: sc(86, 91, 89, 99, 84, 88, 98)
},
{
  id: 'SRC-FIN', name: { fa: 'سامانه مالی و حسابداری', en: 'Finance & Accounting' }, owner: unitFin,
  infoType: { fa: 'مالی', en: 'Financial' }, generation: 'MIXED', frequency: { fa: 'روزانه', en: 'Daily' },
  format: 'Database', access: { fa: 'مالی، مدیریت ارشد', en: 'Finance, Executives' }, connection: 'Database', grade: 'GOOD',
  problems: [P.late], pipeline: 'OK', lastSync: { fa: '۱۱ ساعت پیش', en: '11 h ago' }, records: 312500, errors: 6,
  scores: sc(97, 98, 92, 99, 88, 98, 97), pilot: true
},
{
  id: 'SRC-HR', name: { fa: 'سامانه منابع انسانی', en: 'Human Resources' }, owner: unitHr,
  infoType: { fa: 'منابع انسانی', en: 'HR' }, generation: 'MIXED', frequency: { fa: 'ماهانه', en: 'Monthly' },
  format: 'File', access: { fa: 'منابع انسانی', en: 'HR' }, connection: 'File', grade: 'MEDIUM',
  problems: [P.code, P.late], pipeline: 'OK', lastSync: { fa: '۹ روز پیش', en: '9 days ago' }, records: 2140, errors: 0,
  scores: sc(92, 95, 87, 98, 80, 94, 85)
},
{
  id: 'SRC-PMIS', name: { fa: 'سامانه پروژه و پیمان‌ها', en: 'Projects & Contracts (PMIS)' }, owner: unitPlan,
  infoType: { fa: 'پروژه', en: 'Projects' }, generation: 'MANUAL', frequency: { fa: 'هفتگی', en: 'Weekly' },
  format: 'Database', access: { fa: 'برنامه‌ریزی، مدیریت ارشد', en: 'Planning, Executives' }, connection: 'Database', grade: 'MEDIUM',
  problems: [P.manual, P.late, P.mismatch], pipeline: 'WARN', lastSync: { fa: '۸ روز پیش', en: '8 days ago' }, records: 6820, errors: 74,
  scores: sc(83, 85, 78, 96, 74, 89, 88), pilot: true
},
{
  id: 'SRC-PROC', name: { fa: 'سامانه تدارکات', en: 'Procurement' }, owner: { fa: 'امور تدارکات', en: 'Procurement Affairs' },
  infoType: { fa: 'پشتیبانی', en: 'Support' }, generation: 'MIXED', frequency: { fa: 'روزانه', en: 'Daily' },
  format: 'WebService', access: { fa: 'تدارکات، مالی', en: 'Procurement, Finance' }, connection: 'WebService', grade: 'MEDIUM',
  problems: [P.code], pipeline: 'OK', lastSync: { fa: '۱ روز پیش', en: '1 day ago' }, records: 18400, errors: 9,
  scores: sc(90, 92, 85, 97, 90, 93, 91)
},
{
  id: 'SRC-INV', name: { fa: 'سامانه انبار', en: 'Warehouse / Inventory' }, owner: { fa: 'امور انبارها', en: 'Warehouses' },
  infoType: { fa: 'پشتیبانی', en: 'Support' }, generation: 'MIXED', frequency: { fa: 'روزانه', en: 'Daily' },
  format: 'Database', access: { fa: 'انبار، تدارکات', en: 'Warehouse, Procurement' }, connection: 'Database', grade: 'MEDIUM',
  problems: [P.dup, P.code], pipeline: 'OK', lastSync: { fa: '۱ روز پیش', en: '1 day ago' }, records: 41200, errors: 55,
  scores: sc(89, 90, 83, 86, 91, 92, 90)
},
{
  id: 'SRC-HSE', name: { fa: 'سامانه HSE', en: 'HSE System' }, owner: { fa: 'واحد HSE', en: 'HSE Unit' },
  infoType: { fa: 'ایمنی', en: 'Safety' }, generation: 'MANUAL', frequency: { fa: 'ماهانه', en: 'Monthly' },
  format: 'File', access: { fa: 'HSE، مدیریت ارشد', en: 'HSE, Executives' }, connection: 'File', grade: 'POOR',
  problems: [P.manual, P.gap, P.late], pipeline: 'CRIT', lastSync: { fa: '۴۱ روز پیش', en: '41 days ago' }, records: 960, errors: 112,
  scores: sc(71, 82, 74, 93, 52, 79, 66)
},
{
  id: 'SRC-121', name: { fa: 'مرکز تماس ۱۲۱', en: '121 Call Center' }, owner: unitSvc,
  infoType: { fa: 'مشترکین و حوادث', en: 'Customers & Incidents' }, generation: 'AUTO', frequency: { fa: 'لحظه‌ای', en: 'Real-time' },
  format: 'API', access: { fa: 'خدمات مشترکین، بهره‌برداری', en: 'Customer services, Operations' }, connection: 'API', grade: 'GOOD',
  problems: [P.dup], pipeline: 'OK', lastSync: { fa: '۱ دقیقه پیش', en: '1 min ago' }, records: 412800, errors: 18,
  scores: sc(94, 93, 91, 88, 99, 95, 98), pilot: true
},
{
  id: 'SRC-CRM', name: { fa: 'سامانه درخواست‌ها و شکایات', en: 'Requests & Complaints (CRM)' }, owner: unitSvc,
  infoType: { fa: 'مشترکین', en: 'Customers' }, generation: 'MIXED', frequency: { fa: 'روزانه', en: 'Daily' },
  format: 'WebService', access: { fa: 'خدمات مشترکین', en: 'Customer services' }, connection: 'WebService', grade: 'MEDIUM',
  problems: [P.code, P.gap], pipeline: 'OK', lastSync: { fa: '۶ ساعت پیش', en: '6 h ago' }, records: 96300, errors: 34,
  scores: sc(88, 90, 84, 92, 93, 91, 94)
},
{
  id: 'SRC-AM', name: { fa: 'سامانه نگهداری و دارایی‌ها', en: 'Maintenance & Asset Mgmt.' }, owner: { fa: 'دفتر نگهداری', en: 'Maintenance Office' },
  infoType: { fa: 'دارایی', en: 'Assets' }, generation: 'MANUAL', frequency: { fa: 'هفتگی', en: 'Weekly' },
  format: 'File', access: { fa: 'بهره‌برداری، نگهداری', en: 'Operations, Maintenance' }, connection: 'File', grade: 'POOR',
  problems: [P.manual, P.mismatch, P.dup], pipeline: 'WARN', lastSync: { fa: '۱۲ روز پیش', en: '12 days ago' }, records: 23600, errors: 640,
  scores: sc(76, 81, 72, 84, 70, 83, 78)
},
{
  id: 'SRC-XLS', name: { fa: 'فایل‌های Excel واحدها', en: 'Unit Excel Workbooks' }, owner: { fa: 'واحدهای مختلف', en: 'Various units' },
  infoType: { fa: 'تلفیقی', en: 'Mixed' }, generation: 'MANUAL', frequency: { fa: 'ماهانه', en: 'Monthly' },
  format: 'Excel/CSV', access: { fa: 'محدود', en: 'Restricted' }, connection: 'Manual', grade: 'POOR',
  problems: [P.manual, P.code, P.dup, P.gap], pipeline: 'CRIT', lastSync: { fa: '۳۴ روز پیش', en: '34 days ago' }, records: 14800, errors: 1210,
  scores: sc(68, 74, 61, 72, 58, 70, 49)
},
{
  id: 'SRC-RPT', name: { fa: 'گزارش‌های دوره‌ای واحدها', en: 'Periodic Unit Reports' }, owner: { fa: 'واحدهای مختلف', en: 'Various units' },
  infoType: { fa: 'مدیریتی', en: 'Management' }, generation: 'MANUAL', frequency: { fa: 'ماهانه', en: 'Monthly' },
  format: 'Report', access: { fa: 'مدیریت ارشد', en: 'Executives' }, connection: 'Manual', grade: 'POOR',
  problems: [P.manual, P.mismatch, P.late], pipeline: 'WARN', lastSync: { fa: '۲۲ روز پیش', en: '22 days ago' }, records: 380, errors: 47,
  scores: sc(73, 77, 64, 90, 61, 75, 52)
}];


export const sourceById = (id: string) => sources.find((s) => s.id === id);

export const sourceScore = (s: DataSource) =>
Math.round(DIMENSIONS.reduce((a, d) => a + s.scores[d], 0) / DIMENSIONS.length);

export const dimensionAvg = (d: Dimension) =>
Math.round(sources.reduce((a, s) => a + s.scores[d], 0) / sources.length * 10) / 10;

export const overallQuality = Math.round(DIMENSIONS.reduce((a, d) => a + dimensionAvg(d), 0) / DIMENSIONS.length * 10) / 10;

export interface QualityIssue {
  id: string;
  sourceIds: string[];
  dimension: Dimension;
  title: Tx;
  rule: string;
  records: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  owner: Tx;
}

export const issues: QualityIssue[] = [
{ id: 'DQ-1041', sourceIds: ['SRC-GIS', 'SRC-OMS'], dimension: 'consistency', title: { fa: 'کد فیدر در GIS و سامانه خاموشی یکسان نیست', en: 'Feeder code differs between GIS and OMS' }, rule: 'GIS.feeder_code = OMS.feeder_code', records: 214, priority: 'HIGH', status: 'IN_PROGRESS', owner: unitPlan },
{ id: 'DQ-1038', sourceIds: ['SRC-CIS'], dimension: 'uniqueness', title: { fa: 'شناسه قبض تکراری برای یک مشترک', en: 'Duplicate bill IDs for the same customer' }, rule: 'UNIQUE(bill_id)', records: 1820, priority: 'HIGH', status: 'OPEN', owner: unitSvc },
{ id: 'DQ-1036', sourceIds: ['SRC-MDM'], dimension: 'completeness', title: { fa: 'قرائت ساعتی کنتورهای هوشمند ناقص است', en: 'Missing hourly AMI reads' }, rule: 'COUNT(reads/day) = 24', records: 9640, priority: 'MEDIUM', status: 'IN_PROGRESS', owner: unitSvc },
{ id: 'DQ-1033', sourceIds: ['SRC-PMIS', 'SRC-FIN'], dimension: 'consistency', title: { fa: 'پیشرفت مالی پروژه با اسناد پرداخت مالی مغایرت دارد', en: 'Project financial progress ≠ finance payments' }, rule: 'PMIS.paid ≈ FIN.paid (±2%)', records: 23, priority: 'HIGH', status: 'OPEN', owner: unitPlan },
{ id: 'DQ-1029', sourceIds: ['SRC-HSE'], dimension: 'timeliness', title: { fa: 'گزارش حوادث HSE بیش از ۳۰ روز به‌روز نشده', en: 'HSE incidents not refreshed for 30+ days' }, rule: 'now − last_sync ≤ 31d', records: 1, priority: 'HIGH', status: 'OPEN', owner: { fa: 'واحد HSE', en: 'HSE Unit' } },
{ id: 'DQ-1027', sourceIds: ['SRC-SCADA'], dimension: 'validity', title: { fa: 'جریان منفی یا بالاتر از حد نامی ثبت شده', en: 'Negative or over-rated current values' }, rule: '0 ≤ I ≤ 1.5 × I_rated', records: 312, priority: 'MEDIUM', status: 'RESOLVED', owner: { fa: 'دیسپاچینگ', en: 'Dispatching' } },
{ id: 'DQ-1024', sourceIds: ['SRC-XLS'], dimension: 'traceability', title: { fa: 'فایل‌های Excel فاقد منبع و تاریخ تهیه', en: 'Excel files without origin or date' }, rule: 'origin AND created_at NOT NULL', records: 46, priority: 'MEDIUM', status: 'OPEN', owner: unitIt },
{ id: 'DQ-1021', sourceIds: ['SRC-AM', 'SRC-GIS'], dimension: 'consistency', title: { fa: 'ظرفیت ترانسفورماتور در دو سامانه متفاوت است', en: 'Transformer rating differs in two systems' }, rule: 'AM.kva = GIS.kva', records: 388, priority: 'MEDIUM', status: 'IN_PROGRESS', owner: { fa: 'دفتر نگهداری', en: 'Maintenance Office' } },
{ id: 'DQ-1018', sourceIds: ['SRC-CRM'], dimension: 'validity', title: { fa: 'کد نوع درخواست خارج از فهرست استاندارد', en: 'Request type code outside standard list' }, rule: 'type IN code_list', records: 1170, priority: 'LOW', status: 'RESOLVED', owner: unitSvc },
{ id: 'DQ-1015', sourceIds: ['SRC-INV'], dimension: 'uniqueness', title: { fa: 'کالای یکسان با چند کد انبار', en: 'Same item under multiple stock codes' }, rule: 'UNIQUE(item_spec)', records: 540, priority: 'LOW', status: 'IN_PROGRESS', owner: { fa: 'امور انبارها', en: 'Warehouses' } },
{ id: 'DQ-1012', sourceIds: ['SRC-BILL', 'SRC-MDM'], dimension: 'accuracy', title: { fa: 'مصرف صورتحساب با قرائت کنتور همخوانی ندارد', en: 'Billed kWh ≠ metered kWh' }, rule: '|bill − meter| / meter ≤ 3%', records: 2760, priority: 'HIGH', status: 'IN_PROGRESS', owner: unitFin },
{ id: 'DQ-1009', sourceIds: ['SRC-RPT', 'SRC-OMS'], dimension: 'consistency', title: { fa: 'تعداد خاموشی گزارش دستی با سامانه متفاوت است', en: 'Manual report outage count ≠ OMS' }, rule: 'RPT.outages = OMS.outages', records: 8, priority: 'MEDIUM', status: 'RESOLVED', owner: unitOps }];
