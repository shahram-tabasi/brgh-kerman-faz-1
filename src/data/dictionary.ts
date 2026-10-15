import type { Tx } from '../types';

export interface DataElement {
  id: string;
  name: Tx;
  definition: Tx;
  type: string;
  unit: Tx;
  source: string;
  owner: Tx;
  refresh: Tx;
  quality: 'GOOD' | 'MEDIUM' | 'POOR';
  rules: string;
  relations: string[];
  domain: Tx;
}

const ops = { fa: 'معاونت بهره‌برداری', en: 'Operations Deputy' };
const svc = { fa: 'معاونت فروش و خدمات مشترکین', en: 'Sales & Customer Services Deputy' };
const fin = { fa: 'معاونت مالی و پشتیبانی', en: 'Finance & Support Deputy' };
const pln = { fa: 'معاونت برنامه‌ریزی و مهندسی', en: 'Planning & Engineering Deputy' };

const D = {
  net: { fa: 'شبکه و دارایی', en: 'Network & assets' },
  ops: { fa: 'بهره‌برداری', en: 'Operations' },
  cus: { fa: 'مشترکین', en: 'Customers' },
  fin: { fa: 'مالی', en: 'Finance' },
  prj: { fa: 'پروژه', en: 'Projects' },
  org: { fa: 'سازمانی', en: 'Organisation' }
};

export const dictionary: DataElement[] = [
{ id: 'DE-REGION', domain: D.org, name: { fa: 'منطقه / مدیریت شهرستان', en: 'Region' }, definition: { fa: 'واحد سازمانی پاسخگو در یک شهرستان', en: 'Accountable county-level unit' }, type: 'CHAR(3)', unit: { fa: '—', en: '—' }, source: 'SRC-HR', owner: { fa: 'دفتر برنامه‌ریزی', en: 'Planning Office' }, refresh: { fa: 'سالانه', en: 'Yearly' }, quality: 'GOOD', rules: 'IN (16 county unit codes: SRJ, JRF, BAM, ANB, RJN, KHN, BRD, RGN, BFT, MNJ, QGJ, FHJ, NRM, ARZ, FRB, RBR)', relations: ['DE-DISTRICT', 'DE-CUSTOMER'] },
{ id: 'DE-DISTRICT', domain: D.org, name: { fa: 'ناحیه', en: 'District' }, definition: { fa: 'زیرمجموعه عملیاتی منطقه', en: 'Operational sub-unit of a region' }, type: 'CHAR(6)', unit: { fa: '—', en: '—' }, source: 'SRC-GIS', owner: pln, refresh: { fa: 'سالانه', en: 'Yearly' }, quality: 'GOOD', rules: 'FK → DE-REGION', relations: ['DE-REGION', 'DE-FEEDER'] },
{ id: 'DE-FEEDER', domain: D.net, name: { fa: 'کد فیدر', en: 'Feeder code' }, definition: { fa: 'شناسه یکتای فیدر فشار متوسط', en: 'Unique MV feeder identifier' }, type: 'CHAR(7)', unit: { fa: '—', en: '—' }, source: 'SRC-GIS', owner: pln, refresh: { fa: 'هفتگی', en: 'Weekly' }, quality: 'MEDIUM', rules: 'PATTERN ^[A-Z]{3}-F\\d{2}$ ; = OMS.feeder_code', relations: ['DE-DISTRICT', 'DE-ASSET', 'DE-OUTAGE'] },
{ id: 'DE-ASSET', domain: D.net, name: { fa: 'شناسه تجهیز', en: 'Asset ID' }, definition: { fa: 'شناسه ترانس، ریکلوزر، سکسیونر یا خط', en: 'Transformer / recloser / switch / line ID' }, type: 'VARCHAR(16)', unit: { fa: '—', en: '—' }, source: 'SRC-GIS', owner: { fa: 'دفتر نگهداری', en: 'Maintenance Office' }, refresh: { fa: 'هفتگی', en: 'Weekly' }, quality: 'MEDIUM', rules: 'UNIQUE ; FK → DE-FEEDER', relations: ['DE-FEEDER', 'DE-LOADING', 'DE-OUTAGE'] },
{ id: 'DE-LOADING', domain: D.ops, name: { fa: 'درصد بارگذاری', en: 'Loading %' }, definition: { fa: 'نسبت بار لحظه‌ای به ظرفیت نامی', en: 'Instant load over rated capacity' }, type: 'DECIMAL(5,1)', unit: { fa: 'درصد', en: '%' }, source: 'SRC-SCADA', owner: { fa: 'دیسپاچینگ', en: 'Dispatching' }, refresh: { fa: 'لحظه‌ای', en: 'Real-time' }, quality: 'GOOD', rules: '0 ≤ x ≤ 150', relations: ['DE-ASSET', 'KPI-04'] },
{ id: 'DE-OUTAGE', domain: D.ops, name: { fa: 'رخداد خاموشی', en: 'Outage event' }, definition: { fa: 'قطع برق ثبت‌شده با زمان شروع و پایان', en: 'Recorded interruption with start/end' }, type: 'RECORD', unit: { fa: 'دقیقه', en: 'min' }, source: 'SRC-OMS', owner: ops, refresh: { fa: 'لحظه‌ای', en: 'Real-time' }, quality: 'MEDIUM', rules: 'end ≥ start ; cause IN code_list', relations: ['DE-FEEDER', 'DE-ASSET', 'KPI-01', 'KPI-02', 'KPI-05'] },
{ id: 'DE-ENERGY', domain: D.ops, name: { fa: 'انرژی دریافتی شبکه', en: 'Energy received' }, definition: { fa: 'انرژی تحویلی از پست‌های فوق‌توزیع در خروجی ۲۰ کیلوولت', en: 'Energy delivered at 20 kV incomers of sub-transmission substations' }, type: 'DECIMAL(14,1)', unit: { fa: 'مگاوات‌ساعت', en: 'MWh' }, source: 'SRC-SCADA', owner: { fa: 'دیسپاچینگ توزیع', en: 'Distribution dispatching' }, refresh: { fa: 'ساعتی', en: 'Hourly' }, quality: 'GOOD', rules: 'x ≥ 0 ; Σ(feeders) ≈ incomer (±1%)', relations: ['DE-LOADING', 'KPI-03', 'KPI-24'] },
{ id: 'DE-CUSTOMER', domain: D.cus, name: { fa: 'شناسه مشترک', en: 'Customer ID' }, definition: { fa: 'شماره اشتراک یکتا', en: 'Unique account number' }, type: 'CHAR(13)', unit: { fa: '—', en: '—' }, source: 'SRC-CIS', owner: svc, refresh: { fa: 'روزانه', en: 'Daily' }, quality: 'GOOD', rules: 'UNIQUE ; checksum valid', relations: ['DE-REGION', 'DE-BILL', 'DE-REQUEST'] },
{ id: 'DE-TARIFF', domain: D.cus, name: { fa: 'تعرفه', en: 'Tariff class' }, definition: { fa: 'گروه تعرفه مشترک', en: 'Customer tariff group' }, type: 'CHAR(2)', unit: { fa: '—', en: '—' }, source: 'SRC-CIS', owner: svc, refresh: { fa: 'روزانه', en: 'Daily' }, quality: 'GOOD', rules: 'IN (خانگی، عمومی، کشاورزی، صنعتی، سایر مصارف)', relations: ['DE-CUSTOMER'] },
{ id: 'DE-READ', domain: D.cus, name: { fa: 'قرائت کنتور', en: 'Meter read' }, definition: { fa: 'مقدار انرژی ثبت‌شده توسط کنتور', en: 'Energy recorded by the meter' }, type: 'DECIMAL(12,2)', unit: { fa: 'کیلووات‌ساعت', en: 'kWh' }, source: 'SRC-MDM', owner: svc, refresh: { fa: 'ساعتی', en: 'Hourly' }, quality: 'MEDIUM', rules: 'x ≥ previous ; 24 reads/day', relations: ['DE-CUSTOMER', 'DE-BILL', 'KPI-03'] },
{ id: 'DE-BILL', domain: D.fin, name: { fa: 'مبلغ صورتحساب', en: 'Bill amount' }, definition: { fa: 'مبلغ صادره برای دوره مصرف', en: 'Amount billed for the period' }, type: 'DECIMAL(18,0)', unit: { fa: 'ریال', en: 'IRR' }, source: 'SRC-CIS', owner: fin, refresh: { fa: 'روزانه', en: 'Daily' }, quality: 'GOOD', rules: 'x ≥ 0 ; |kWh − DE-READ| ≤ 3%', relations: ['DE-CUSTOMER', 'DE-READ', 'KPI-11'] },
{ id: 'DE-BUDGET', domain: D.fin, name: { fa: 'ردیف بودجه', en: 'Budget line' }, definition: { fa: 'ردیف مصوب بودجه سالانه', en: 'Approved annual budget line' }, type: 'RECORD', unit: { fa: 'میلیارد تومان', en: 'bn toman' }, source: 'SRC-FIN', owner: fin, refresh: { fa: 'ماهانه', en: 'Monthly' }, quality: 'GOOD', rules: 'spent ≤ allocated ≤ approved', relations: ['DE-PROJECT', 'KPI-10'] },
{ id: 'DE-PROJECT', domain: D.prj, name: { fa: 'پروژه مصوب', en: 'Approved project' }, definition: { fa: 'پروژه دارای مصوبه و ردیف اعتبار', en: 'Project with approval and credit line' }, type: 'RECORD', unit: { fa: '—', en: '—' }, source: 'SRC-PMIS', owner: pln, refresh: { fa: 'هفتگی', en: 'Weekly' }, quality: 'MEDIUM', rules: 'FK → DE-BUDGET ; 0 ≤ progress ≤ 100', relations: ['DE-BUDGET', 'DE-CONTRACT', 'KPI-07', 'KPI-08'] },
{ id: 'DE-CONTRACT', domain: D.prj, name: { fa: 'قرارداد', en: 'Contract' }, definition: { fa: 'قرارداد پیمانکاری پروژه', en: 'Project contract' }, type: 'RECORD', unit: { fa: '—', en: '—' }, source: 'SRC-PMIS', owner: { fa: 'امور قراردادها', en: 'Contracts Affairs' }, refresh: { fa: 'هفتگی', en: 'Weekly' }, quality: 'MEDIUM', rules: 'status IN code_list', relations: ['DE-PROJECT'] },
{ id: 'DE-REQUEST', domain: D.cus, name: { fa: 'درخواست مشترک', en: 'Customer request' }, definition: { fa: 'درخواست خدمت ثبت‌شده در هر کانال', en: 'Service request from any channel' }, type: 'RECORD', unit: { fa: 'ساعت', en: 'hours' }, source: 'SRC-APP', owner: svc, refresh: { fa: 'روزانه', en: 'Daily' }, quality: 'MEDIUM', rules: 'type IN code_list ; closed ≥ opened', relations: ['DE-CUSTOMER', 'KPI-14'] },
{ id: 'DE-COMPLAINT', domain: D.cus, name: { fa: 'شکایت', en: 'Complaint' }, definition: { fa: 'شکایت ثبت‌شده مشترک', en: 'Registered customer complaint' }, type: 'RECORD', unit: { fa: '—', en: '—' }, source: 'SRC-APP', owner: svc, refresh: { fa: 'روزانه', en: 'Daily' }, quality: 'MEDIUM', rules: 'category IN code_list', relations: ['DE-CUSTOMER', 'KPI-15'] }];
