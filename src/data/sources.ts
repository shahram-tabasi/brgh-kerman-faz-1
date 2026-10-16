import type { Level, Tx } from '../types';

export type Connection = 'API' | 'WebService' | 'Database' | 'FileExchange' | 'ExcelCSV' | 'Scheduled' | 'Manual';
export type QualityGrade = 'GOOD' | 'MEDIUM' | 'POOR';

/** Integration methods listed in spec §7. */
export const CONNECTIONS: {id: Connection;fa: string;en: string;}[] = [
{ id: 'API', fa: 'API', en: 'API' },
{ id: 'WebService', fa: 'Web Service', en: 'Web Service' },
{ id: 'Database', fa: 'اتصال کنترل‌شده به Database', en: 'Controlled DB link' },
{ id: 'FileExchange', fa: 'تبادل فایل', en: 'File exchange' },
{ id: 'ExcelCSV', fa: 'فایل‌های Excel/CSV استانداردشده', en: 'Standardised Excel/CSV' },
{ id: 'Scheduled', fa: 'سرویس زمان‌بندی‌شده', en: 'Scheduled service' },
{ id: 'Manual', fa: 'ورود اطلاعات کنترل‌شده', en: 'Controlled manual entry' }];

export const connectionLabel = (c: Connection) => CONNECTIONS.find((x) => x.id === c)!;

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

/** Source categories exactly as listed in spec §14. */
export type SourceGroup = 'ops' | 'gis' | 'customers' | 'outage' | 'metering' | 'finance' | 'hr' | 'projects' | 'procurement' | 'warehouse' | 'hse' | 'reports' | 'excel' | 'databases';
export const groupLabel: Record<SourceGroup, Tx> = {
  ops: { fa: 'سامانه‌های بهره‌برداری', en: 'Operations systems' },
  gis: { fa: 'سامانه‌های GIS', en: 'GIS' },
  customers: { fa: 'سامانه‌های مشترکین', en: 'Customer systems' },
  outage: { fa: 'سامانه‌های خاموشی و حوادث', en: 'Outage & incident systems' },
  metering: { fa: 'سامانه‌های قرائت و اندازه‌گیری', en: 'Metering systems' },
  finance: { fa: 'سامانه‌های مالی و حسابداری', en: 'Finance & accounting' },
  hr: { fa: 'سامانه‌های منابع انسانی', en: 'Human resources' },
  projects: { fa: 'سامانه‌های پروژه و پیمان‌ها', en: 'Projects & contracts' },
  procurement: { fa: 'سامانه‌های تدارکات', en: 'Procurement' },
  warehouse: { fa: 'سامانه‌های انبار', en: 'Warehouse' },
  hse: { fa: 'سامانه‌های HSE', en: 'HSE' },
  reports: { fa: 'گزارش‌های واحدها', en: 'Unit reports' },
  excel: { fa: 'فایل‌های Excel', en: 'Excel files' },
  databases: { fa: 'پایگاه‌های داده موجود', en: 'Existing databases' }
};

export interface DataSource {
  id: string;
  group: SourceGroup;
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
const unitSvc = { fa: 'معاونت فروش و خدمات مشترکین', en: 'Sales & Customer Services Deputy' };
const unitFin = { fa: 'معاونت مالی و پشتیبانی', en: 'Finance & Support Deputy' };
const unitPlan = { fa: 'معاونت برنامه‌ریزی و مهندسی', en: 'Planning & Engineering Deputy' };
const unitHr = { fa: 'معاونت منابع انسانی', en: 'Human Resources Deputy' };
const unitIt = { fa: 'دفتر فناوری اطلاعات و ارتباطات', en: 'ICT Office' };

const P = {
  dup: { fa: 'رکورد تکراری', en: 'Duplicate records' },
  gap: { fa: 'کمبود فیلد', en: 'Missing fields' },
  mismatch: { fa: 'مغایرت با سامانه دیگر', en: 'Mismatch with another system' },
  late: { fa: 'تأخیر در به‌روزرسانی', en: 'Late refresh' },
  code: { fa: 'کدگذاری غیراستاندارد', en: 'Non-standard codes' },
  manual: { fa: 'ورود دستی', en: 'Manual entry' },
  range: { fa: 'مقادیر خارج از محدوده', en: 'Out-of-range values' },
  coverage: { fa: 'پوشش ناقص (همه نقاط مجهز نیستند)', en: 'Partial coverage' }
};

const sc = (c: number, a: number, s: number, u: number, t: number, v: number, tr: number): Record<Dimension, number> => ({
  completeness: c, accuracy: a, consistency: s, uniqueness: u, timeliness: t, validity: v, traceability: tr
});

const RT = { fa: 'لحظه‌ای', en: 'Real-time' };
const HR = { fa: 'ساعتی', en: 'Hourly' };
const DY = { fa: 'روزانه', en: 'Daily' };
const WK = { fa: 'هفتگی', en: 'Weekly' };
const MO = { fa: 'ماهانه', en: 'Monthly' };

/**
 * Pilot scope (spec §23): a few high-value sources and one complete chain.
 * Selected: incidents/121, distribution SCADA, customer & billing, GIS, AMI — the minimum set that feeds the
 * executive + operations dashboards and the reliability / loss / customer KPIs.
 */
export const sources: DataSource[] = [
{
  id: 'SRC-OMS', group: 'outage', name: { fa: 'سامانه ثبت و مدیریت حوادث (۱۲۱)', en: 'Incident management system (121)' }, owner: unitOps,
  infoType: { fa: 'عملیاتی', en: 'Operational' }, generation: 'MIXED', frequency: RT,
  format: 'SQL Server', access: { fa: 'بهره‌برداری، مدیریت ارشد', en: 'Operations, Executives' }, connection: 'Database', grade: 'MEDIUM',
  problems: [P.gap, P.mismatch], pipeline: 'OK', lastSync: { fa: '۲ دقیقه پیش', en: '2 min ago' }, records: 412800, errors: 31,
  scores: sc(91, 93, 86, 95, 98, 95, 96), pilot: true
},
{
  id: 'SRC-SCADA', group: 'ops', name: { fa: 'اسکادا / دیسپاچینگ توزیع', en: 'Distribution SCADA / dispatching' }, owner: { fa: 'دیسپاچینگ توزیع', en: 'Distribution dispatching' },
  infoType: { fa: 'عملیاتی', en: 'Operational' }, generation: 'AUTO', frequency: RT,
  format: 'Historian API', access: { fa: 'بهره‌برداری', en: 'Operations' }, connection: 'API', grade: 'GOOD',
  problems: [P.range, P.coverage], pipeline: 'OK', lastSync: { fa: '۳۰ ثانیه پیش', en: '30 s ago' }, records: 2840000, errors: 3,
  scores: sc(88, 96, 94, 99, 99, 93, 99), pilot: true
},
{
  id: 'SRC-GIS', group: 'gis', name: { fa: 'سامانه اطلاعات مکانی شبکه (GIS)', en: 'Network GIS' }, owner: unitPlan,
  infoType: { fa: 'دارایی و شبکه', en: 'Assets & Network' }, generation: 'MIXED', frequency: WK,
  format: 'Geodatabase', access: { fa: 'برنامه‌ریزی، بهره‌برداری', en: 'Planning, Operations' }, connection: 'Database', grade: 'MEDIUM',
  problems: [P.gap, P.mismatch, P.code], pipeline: 'WARN', lastSync: { fa: '۶ روز پیش', en: '6 days ago' }, records: 94310, errors: 418,
  scores: sc(84, 88, 79, 95, 82, 90, 92), pilot: true
},
{
  id: 'SRC-CIS', group: 'customers', name: { fa: 'سامانه جامع مشترکین و فروش (بیلینگ)', en: 'Customer & billing system (CIS)' }, owner: unitSvc,
  infoType: { fa: 'مشترکین و فروش', en: 'Customers & sales' }, generation: 'AUTO', frequency: DY,
  format: 'Web Service', access: { fa: 'فروش و خدمات مشترکین، مالی', en: 'Sales & customer services, Finance' }, connection: 'WebService', grade: 'GOOD',
  problems: [P.dup], pipeline: 'OK', lastSync: { fa: '۴ ساعت پیش', en: '4 h ago' }, records: 1715600, errors: 64,
  scores: sc(95, 94, 89, 91, 96, 96, 97), pilot: true
},
{
  id: 'SRC-MDM', group: 'metering', name: { fa: 'سامانه کنتورهای هوشمند (AMI)', en: 'Smart metering head-end (AMI)' }, owner: unitSvc,
  infoType: { fa: 'اندازه‌گیری', en: 'Metering' }, generation: 'AUTO', frequency: HR,
  format: 'REST API', access: { fa: 'فروش، دفتر کاهش تلفات', en: 'Sales, Loss office' }, connection: 'API', grade: 'MEDIUM',
  problems: [P.gap, P.coverage], pipeline: 'WARN', lastSync: { fa: '۳ ساعت پیش', en: '3 h ago' }, records: 1320000, errors: 2380,
  scores: sc(86, 91, 89, 99, 84, 88, 98), pilot: true
},
{
  id: 'SRC-APP', group: 'customers', name: { fa: 'درگاه‌های خدمات غیرحضوری (برق من)', en: 'Digital service channels (Bargh-e Man)' }, owner: unitSvc,
  infoType: { fa: 'درخواست‌های مشترکین', en: 'Customer requests' }, generation: 'AUTO', frequency: DY,
  format: 'Web Service', access: { fa: 'فروش و خدمات مشترکین', en: 'Sales & customer services' }, connection: 'WebService', grade: 'MEDIUM',
  problems: [P.code, P.gap], pipeline: 'OK', lastSync: { fa: '۶ ساعت پیش', en: '6 h ago' }, records: 96300, errors: 34,
  scores: sc(88, 90, 84, 92, 93, 91, 94)
},
{
  id: 'SRC-FIN', group: 'finance', name: { fa: 'سامانه مالی و حسابداری', en: 'Finance & accounting ERP' }, owner: unitFin,
  infoType: { fa: 'مالی و بودجه', en: 'Finance & budget' }, generation: 'MIXED', frequency: DY,
  format: 'SQL Server (view)', access: { fa: 'مالی، مدیریت ارشد', en: 'Finance, Executives' }, connection: 'Scheduled', grade: 'GOOD',
  problems: [P.late], pipeline: 'OK', lastSync: { fa: '۱۱ ساعت پیش', en: '11 h ago' }, records: 312500, errors: 6,
  scores: sc(97, 98, 92, 99, 88, 98, 97)
},
{
  id: 'SRC-HR', group: 'hr', name: { fa: 'سامانه منابع انسانی و حضور', en: 'HR & attendance' }, owner: unitHr,
  infoType: { fa: 'منابع انسانی', en: 'HR' }, generation: 'MIXED', frequency: MO,
  format: 'CSV export', access: { fa: 'منابع انسانی', en: 'HR' }, connection: 'FileExchange', grade: 'MEDIUM',
  problems: [P.code, P.late], pipeline: 'OK', lastSync: { fa: '۹ روز پیش', en: '9 days ago' }, records: 2140, errors: 0,
  scores: sc(92, 95, 87, 98, 80, 94, 85)
},
{
  id: 'SRC-PMIS', group: 'projects', name: { fa: 'سامانه پروژه و پیمان‌ها', en: 'Projects & contracts (PMIS)' }, owner: unitPlan,
  infoType: { fa: 'پروژه', en: 'Projects' }, generation: 'MANUAL', frequency: WK,
  format: 'Database', access: { fa: 'برنامه‌ریزی، مدیریت ارشد', en: 'Planning, Executives' }, connection: 'Database', grade: 'MEDIUM',
  problems: [P.manual, P.late, P.mismatch], pipeline: 'WARN', lastSync: { fa: '۸ روز پیش', en: '8 days ago' }, records: 6820, errors: 74,
  scores: sc(83, 85, 78, 96, 74, 89, 88)
},
{
  id: 'SRC-PROC', group: 'procurement', name: { fa: 'سامانه تدارکات و قراردادها', en: 'Procurement & contracts' }, owner: unitFin,
  infoType: { fa: 'پشتیبانی', en: 'Support' }, generation: 'MIXED', frequency: DY,
  format: 'Web Service', access: { fa: 'تدارکات، مالی', en: 'Procurement, Finance' }, connection: 'WebService', grade: 'MEDIUM',
  problems: [P.code], pipeline: 'OK', lastSync: { fa: '۱ روز پیش', en: '1 day ago' }, records: 18400, errors: 9,
  scores: sc(90, 92, 85, 97, 90, 93, 91)
},
{
  id: 'SRC-INV', group: 'warehouse', name: { fa: 'سامانه انبار و کالا', en: 'Warehouse & inventory' }, owner: unitFin,
  infoType: { fa: 'پشتیبانی', en: 'Support' }, generation: 'MIXED', frequency: DY,
  format: 'Database', access: { fa: 'انبار، تدارکات', en: 'Warehouse, Procurement' }, connection: 'Scheduled', grade: 'MEDIUM',
  problems: [P.dup, P.code], pipeline: 'OK', lastSync: { fa: '۱ روز پیش', en: '1 day ago' }, records: 41200, errors: 55,
  scores: sc(89, 90, 83, 86, 91, 92, 90)
},
{
  id: 'SRC-AM', group: 'ops', name: { fa: 'سامانه نگهداری و تعمیرات (بازدید و سرویس)', en: 'Maintenance (inspections & work orders)' }, owner: unitOps,
  infoType: { fa: 'دارایی', en: 'Assets' }, generation: 'MANUAL', frequency: WK,
  format: 'Excel template', access: { fa: 'بهره‌برداری، نگهداری', en: 'Operations, Maintenance' }, connection: 'ExcelCSV', grade: 'POOR',
  problems: [P.manual, P.mismatch, P.dup], pipeline: 'WARN', lastSync: { fa: '۱۲ روز پیش', en: '12 days ago' }, records: 23600, errors: 640,
  scores: sc(76, 81, 72, 84, 70, 83, 78)
},
{
  id: 'SRC-HSE', group: 'hse', name: { fa: 'سامانه HSE (حوادث ناشی از کار)', en: 'HSE (occupational incidents)' }, owner: { fa: 'واحد HSE', en: 'HSE Unit' },
  infoType: { fa: 'ایمنی', en: 'Safety' }, generation: 'MANUAL', frequency: MO,
  format: 'Form', access: { fa: 'HSE، مدیریت ارشد', en: 'HSE, Executives' }, connection: 'Manual', grade: 'POOR',
  problems: [P.manual, P.gap, P.late], pipeline: 'CRIT', lastSync: { fa: '۴۱ روز پیش', en: '41 days ago' }, records: 960, errors: 112,
  scores: sc(71, 82, 74, 93, 52, 79, 66)
},
{
  id: 'SRC-RPT', group: 'reports', name: { fa: 'گزارش‌های دوره‌ای مدیریت‌های شهرستان', en: 'County units periodic reports' }, owner: { fa: '۱۶ مدیریت برق شهرستان', en: '16 county units' },
  infoType: { fa: 'مدیریتی', en: 'Management' }, generation: 'MANUAL', frequency: MO,
  format: 'Word/PDF', access: { fa: 'مدیریت ارشد', en: 'Executives' }, connection: 'Manual', grade: 'POOR',
  problems: [P.manual, P.mismatch, P.late], pipeline: 'WARN', lastSync: { fa: '۲۲ روز پیش', en: '22 days ago' }, records: 380, errors: 47,
  scores: sc(73, 77, 64, 90, 61, 75, 52)
},
{
  id: 'SRC-XLS', group: 'excel', name: { fa: 'فایل‌های Excel واحدها (پیک، بار ترانس، تلفات)', en: 'Unit Excel workbooks (peak, transformer load, losses)' }, owner: { fa: 'واحدهای مختلف', en: 'Various units' },
  infoType: { fa: 'تلفیقی', en: 'Mixed' }, generation: 'MANUAL', frequency: MO,
  format: 'Excel/CSV', access: { fa: 'محدود', en: 'Restricted' }, connection: 'ExcelCSV', grade: 'POOR',
  problems: [P.manual, P.code, P.dup, P.gap], pipeline: 'CRIT', lastSync: { fa: '۳۴ روز پیش', en: '34 days ago' }, records: 14800, errors: 1210,
  scores: sc(68, 74, 61, 72, 58, 70, 49)
},
{
  id: 'SRC-DB', group: 'databases', name: { fa: 'پایگاه‌های داده موجود (بار ترانس‌ها، اندازه‌گیری فیدرها)', en: 'Existing databases (transformer & feeder measurements)' }, owner: unitOps,
  infoType: { fa: 'اندازه‌گیری شبکه', en: 'Network measurements' }, generation: 'MIXED', frequency: WK,
  format: 'Access / SQL', access: { fa: 'بهره‌برداری', en: 'Operations' }, connection: 'FileExchange', grade: 'MEDIUM',
  problems: [P.code, P.late], pipeline: 'OK', lastSync: { fa: '۵ روز پیش', en: '5 days ago' }, records: 38200, errors: 22,
  scores: sc(85, 87, 80, 93, 78, 86, 82)
},
{
  id: 'SRC-SOLAR', group: 'metering', name: { fa: 'سامانه پایش نیروگاه‌های خورشیدی مقیاس کوچک', en: 'Small-scale solar monitoring' }, owner: unitPlan,
  infoType: { fa: 'تولید پراکنده', en: 'Distributed generation' }, generation: 'AUTO', frequency: HR,
  format: 'REST API', access: { fa: 'برنامه‌ریزی، بهره‌برداری', en: 'Planning, Operations' }, connection: 'API', grade: 'GOOD',
  problems: [P.coverage], pipeline: 'OK', lastSync: { fa: '۱ ساعت پیش', en: '1 h ago' }, records: 210400, errors: 12,
  scores: sc(90, 94, 91, 99, 95, 94, 96)
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
{ id: 'DQ-1018', sourceIds: ['SRC-APP'], dimension: 'validity', title: { fa: 'کد نوع درخواست خارج از فهرست استاندارد', en: 'Request type code outside standard list' }, rule: 'type IN code_list', records: 1170, priority: 'LOW', status: 'RESOLVED', owner: unitSvc },
{ id: 'DQ-1015', sourceIds: ['SRC-INV'], dimension: 'uniqueness', title: { fa: 'کالای یکسان با چند کد انبار', en: 'Same item under multiple stock codes' }, rule: 'UNIQUE(item_spec)', records: 540, priority: 'LOW', status: 'IN_PROGRESS', owner: { fa: 'امور انبارها', en: 'Warehouses' } },
{ id: 'DQ-1012', sourceIds: ['SRC-CIS', 'SRC-MDM'], dimension: 'accuracy', title: { fa: 'مصرف صورتحساب با قرائت کنتور همخوانی ندارد', en: 'Billed kWh ≠ metered kWh' }, rule: '|bill − meter| / meter ≤ 3%', records: 2760, priority: 'HIGH', status: 'IN_PROGRESS', owner: unitFin },
{ id: 'DQ-1009', sourceIds: ['SRC-RPT', 'SRC-OMS'], dimension: 'consistency', title: { fa: 'تعداد خاموشی گزارش دستی با سامانه متفاوت است', en: 'Manual report outage count ≠ OMS' }, rule: 'RPT.outages = OMS.outages', records: 8, priority: 'MEDIUM', status: 'RESOLVED', owner: unitOps }];
