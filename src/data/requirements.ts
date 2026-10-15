/**
 * Requirements traceability: every section / bullet of the scope document
 * («طراحی و پیاده‌سازی پلتفرم یکپارچه‌سازی، تجمیع و هوشمندسازی اطلاعات سامانه‌های شرکت توزیع نیروی برق جنوب کرمان»)
 * mapped to where it lives in this software.
 *
 * DONE    = implemented and visible in the software
 * DRAFT   = implemented as a first draft; values/definitions to be finalised with the employer
 * PROCESS = a project activity or document (delivered by the contractor, tracked on the Pilot / Architecture pages)
 * OUT     = intentionally excluded in this version (AI / prediction — per employer request)
 */
export type ReqStatus = 'DONE' | 'DRAFT' | 'PROCESS' | 'OUT';
export type ReqItem = [fa: string, en: string, route: string, status: ReqStatus];
export interface ReqSection {
  no: string;
  fa: string;
  en: string;
  items: ReqItem[];
}

export const requirements: ReqSection[] = [
{ no: '1', fa: 'مقدمه — مسائل وضع موجود', en: 'Introduction — current problems', items: [
  ['پراکندگی اطلاعات در سامانه‌های مختلف', 'Information scattered across systems', '/sources', 'DONE'],
  ['تعاریف متفاوت برای یک شاخص', 'Different definitions of the same KPI', '/kpi', 'DONE'],
  ['تکرار و هم‌پوشانی اطلاعات', 'Duplicate / overlapping data', '/quality', 'DONE'],
  ['مغایرت اطلاعات بین سامانه‌ها', 'Mismatches between systems', '/quality', 'DONE'],
  ['ناقص بودن داده‌ها', 'Incomplete data', '/quality', 'DONE'],
  ['داده‌های قدیمی یا به‌روزنشده', 'Stale data', '/sources', 'DONE'],
  ['کاهش قابلیت اعتماد گزارش‌ها', 'Low report reliability', '/kpi?id=KPI-35', 'DONE'],
  ['دشواری گزارش‌های تلفیقی', 'Hard consolidated reporting', '/', 'DONE'],
  ['وابستگی به گزارش دستی و Excel', 'Dependence on manual / Excel reports', '/kpi?id=KPI-33', 'DONE'],
  ['زمان زیاد جمع‌آوری و تحلیل', 'Long collection & analysis time', '/kpi?id=KPI-32', 'DONE'],
  ['دشواری دسترسی مدیران به تصویر جامع', 'Managers lack a full picture', '/', 'DONE'],
  ['کاهش کیفیت تصمیم‌گیری', 'Lower decision quality', '/kpi?id=KPI-37', 'DONE']] },
{ no: '2', fa: 'ضرورت و توجیه — پرسش‌های مدیریتی', en: 'Rationale — management questions', items: [
  ['وضعیت فعلی بار شبکه', 'Current network load', '/', 'DONE'],
  ['تجهیزات با ریسک یا اضافه‌بار', 'Assets at risk / overloaded', '/', 'DONE'],
  ['وضعیت خاموشی‌ها', 'Outage status', '/', 'DONE'],
  ['عملکرد مناطق و واحدها نسبت به اهداف', 'Regional performance vs targets', '/', 'DONE'],
  ['پیشرفت پروژه‌های مصوب', 'Progress of approved projects', '/', 'DONE'],
  ['انحراف زمانی و مالی پروژه‌ها', 'Project time & cost variance', '/', 'DONE'],
  ['پروژه‌های مؤثر بر قابلیت اطمینان', 'Projects affecting reliability', '/', 'DONE'],
  ['شاخص‌های بهره‌برداری، مالی، مشترکین و منابع انسانی', 'Operations, finance, customer & HR KPIs', '/', 'DONE'],
  ['زنجیره پنج‌سطحی: منابع ← یکپارچه‌سازی ← کیفیت ← مدل‌سازی ← ارائه', '5-level chain: sources → integrate → quality → model → present', '/architecture', 'DONE']] },
{ no: '3', fa: 'اهداف اختصاصی (۱۸ هدف)', en: 'Specific objectives (18)', items: [
  ['۱. شناسایی و مستندسازی سامانه‌ها و منابع', '1. Identify & document sources', '/sources', 'DONE'],
  ['۲. شناسایی مالک داده و فرآیند تولید و به‌روزرسانی', '2. Data owner & update process', '/sources', 'DONE'],
  ['۳. داده‌های کلیدی موردنیاز مدیران', '3. Key data for managers', '/dictionary', 'DONE'],
  ['۴. شناسایی مغایرت، کمبود، تکرار و ناهماهنگی', '4. Detect mismatches, gaps, duplicates', '/quality', 'DONE'],
  ['۵. استاندارد مشترک تعاریف داده و شاخص', '5. Common data & KPI definitions', '/kpi', 'DONE'],
  ['۶. سازوکار کنترل و ارتقای کیفیت داده', '6. Data-quality control mechanism', '/quality', 'DONE'],
  ['۷. یکپارچه‌سازی اطلاعات سامانه‌ها', '7. Integrate system data', '/sources', 'DONE'],
  ['۸. مخزن یا لایه اطلاعاتی مشترک', '8. Shared data store / layer', '/architecture', 'DONE'],
  ['۹. مدل داده و شاخص‌های استاندارد سازمانی', '9. Data model & standard KPIs', '/dictionary', 'DONE'],
  ['۱۰. کاهش وابستگی به گزارش‌گیری دستی', '10. Less manual reporting', '/kpi?id=KPI-33', 'DONE'],
  ['۱۱. داشبوردهای مدیریتی و عملیاتی', '11. Management & operational dashboards', '/', 'DONE'],
  ['۱۲. ساختار شکست مسئله (Drill-down)', '12. Drill-down', '/drilldown', 'DONE'],
  ['۱۳. گزارش‌های تحلیلی و مدیریتی استاندارد', '13. Standard management reports', '/reports', 'DONE'],
  ['۱۴. پایش روند شاخص‌ها و انحرافات', '14. Trend & deviation monitoring', '/kpi', 'DONE'],
  ['۱۵. سازوکار هشدار برای وضعیت‌های خارج از حد', '15. Out-of-limit alerting', '/alerts', 'DONE'],
  ['۱۶. افزایش سرعت دسترسی مدیران', '16. Faster manager access', '/kpi?id=KPI-34', 'DONE'],
  ['۱۷. افزایش اعتماد به اطلاعات', '17. Higher trust in information', '/kpi?id=KPI-36', 'DONE'],
  ['۱۸. زیرساخت برای تحلیل‌های پیشرفته و هوش مصنوعی آتی', '18. Foundation for future analytics / AI', '/architecture', 'OUT']] },
{ no: '4', fa: 'دامنه خدمات (الف تا هـ)', en: 'Scope (a–e)', items: [
  ['الف) شناسایی سامانه‌ها، پایگاه‌ها، فایل‌ها، منابع دستی، روش تبادل، فرمت، تناوب، مالک', 'a) Systems, DBs, files, manual sources, exchange, format, cadence, owner', '/sources', 'DONE'],
  ['ب) تحلیل داده: ساختار، کامل بودن، صحت، تکرار، تناقض، پرت، فاقد مرجع، تاریخچه', 'b) Data analysis: structure, completeness, accuracy, duplicates, conflicts, outliers, no reference, history', '/quality', 'DONE'],
  ['ج) یکپارچه‌سازی: API/WS، اتصال DB، فایل، ETL/ELT، Staging، انتقال، مدیریت خطا', 'c) Integration: API/WS, DB, file, ETL/ELT, staging, transfer, error handling', '/sources', 'DONE'],
  ['د) استانداردسازی: Data Dictionary، شناسه مشترک، نام و کد، واحد، تعریف شاخص، مرجع اصلی، نگاشت', 'd) Standardisation: dictionary, common IDs, codes, units, KPI definitions, golden source, mapping', '/dictionary', 'DONE'],
  ['هـ) کنترل کیفیت: قواعد، کامل بودن، صحت، سازگاری، تکرار، محدوده، ارتباط، مغایرت، گزارش، اولویت', 'e) Quality: rules, completeness, accuracy, consistency, duplicates, range, relations, report, priority', '/quality', 'DONE']] },
{ no: '5', fa: 'شناخت و ارزیابی وضع موجود (جدول ۱۰ مشخصه)', en: 'As-is assessment (10-attribute table)', items: [
  ['نام سامانه، واحد مالک، نوع اطلاعات، روش تولید، تناوب، فرمت، سطح دسترسی، کیفیت، مشکلات، قابلیت اتصال', 'Name, owner, info type, generation, cadence, format, access, quality, issues, connectivity', '/sources', 'DONE'],
  ['خروجی: نقشه جامع منابع اطلاعاتی', 'Output: complete source map', '/sources', 'DONE']] },
{ no: '6', fa: 'مدل یکپارچه اطلاعات و فرهنگ داده', en: 'Unified model & data dictionary', items: [
  ['چه داده‌ای، از کجا، مالک، مرجع، ارتباط، استانداردسازی، شاخص‌های وابسته', 'Which data, from where, owner, golden source, relations, standardisation, dependent KPIs', '/dictionary', 'DONE'],
  ['۱۰ مشخصه هر داده: نام، تعریف، نوع، واحد، منبع، مالک، دوره، کیفیت، قواعد، ارتباط', '10 attributes per element', '/dictionary', 'DONE']] },
{ no: '7', fa: 'یکپارچه‌سازی و تجمیع', en: 'Integration & aggregation', items: [
  ['API، Web Service، Database، تبادل فایل، Excel/CSV، سرویس زمان‌بندی، ورود کنترل‌شده', 'API, Web Service, DB, file exchange, Excel/CSV, scheduled, controlled entry', '/sources', 'DONE'],
  ['سامانه‌های مبدأ حذف یا جایگزین نمی‌شوند', 'Source systems are not replaced', '/architecture', 'DONE']] },
{ no: '8', fa: 'مدیریت کیفیت داده (۷ بُعد)', en: 'Data quality (7 dimensions)', items: [
  ['کامل بودن، صحت، سازگاری، یکتایی، به‌روز بودن، اعتبار، قابلیت ردیابی', 'Completeness, accuracy, consistency, uniqueness, timeliness, validity, traceability', '/quality', 'DONE'],
  ['قواعد اصلاح، تطبیق و اولویت‌بندی اصلاحات', 'Correction, reconciliation & prioritisation rules', '/quality', 'DONE']] },
{ no: '9', fa: 'موتور شاخص‌ها و KPI Master', en: 'KPI engine & KPI Master', items: [
  ['نام، تعریف، فرمول، داده‌های موردنیاز، منبع، دوره، واحد، حد مطلوب، هشدار، بحرانی، مسئول', 'Name, definition, formula, required data, source, period, unit, target, warning, critical, owner', '/kpi', 'DONE'],
  ['مقادیر هدف و حدود نهایی با تأیید کارفرما', 'Final targets/thresholds approved by employer', '/kpi', 'DRAFT']] },
{ no: '10', fa: 'داشبوردهای مدیریتی و عملیاتی', en: 'Management & operational dashboards', items: [
  ['۱۰-۱ مدیرعامل: شاخص‌های کلیدی، بهره‌برداری، خاموشی، بار و ظرفیت، پروژه، مالی، مشترکین، عملکرد مناطق، هشدار و انحراف، روند', '10.1 CEO: KPIs, ops, outages, load & capacity, projects, finance, customers, regions, alerts, trend', '/', 'DONE'],
  ['۱۰-۲ بهره‌برداری: شبکه، بار تجهیزات، خاموشی، رخداد، قابلیت اطمینان، تجهیزات حساس، روند خرابی، زمان رفع، نقاط پرریسک', '10.2 Ops: network, asset load, outages, incidents, reliability, sensitive assets, fault trend, restoration, risk points', '/operations', 'DONE'],
  ['۱۰-۳ پروژه‌ها: مصوب، پیشرفت فیزیکی و مالی، انحراف زمانی و هزینه، قراردادها، بحرانی، ریسک، تحقق اهداف', '10.3 Projects: approved, physical & financial, time & cost variance, contracts, critical, risk, goals', '/projects', 'DONE'],
  ['۱۰-۴ مالی: بودجه، عملکرد بودجه، تعهدات، هزینه‌ها، انحرافات، اعتبارات، روند هزینه', '10.4 Finance: budget, performance, commitments, costs, variances, credits, cost trend', '/finance', 'DONE'],
  ['۱۰-۵ مشترکین: تعداد، درخواست‌ها، زمان پاسخگویی، شکایات، وضعیت خدمات، روند درخواست، کیفیت خدمات', '10.5 Customers: count, requests, response, complaints, service status, trend, quality', '/customers', 'DONE']] },
{ no: '11', fa: 'شکست مسئله (Drill-down)', en: 'Drill-down', items: [
  ['شرکت ← منطقه ← ناحیه ← فیدر ← تجهیز ← رخداد', 'Company → region → district → feeder → asset → event', '/drilldown', 'DONE'],
  ['کل پروژه‌ها ← معاونت ← پروژه ← فعالیت ← وضعیت اجرا', 'Projects → deputy → project → activity → status', '/drilldown?mode=projects', 'DONE']] },
{ no: '12', fa: 'هشدار و مدیریت استثناها (۸ نمونه)', en: 'Alerts & exceptions (8 examples)', items: [
  ['افزایش غیرعادی خاموشی، عبور بار از حد، افزایش هزینه، تأخیر پروژه، افت عملکرد منطقه، کاهش کیفیت داده، افزایش رخداد، عدم به‌روزرسانی منبع', 'Outage rise, overload, cost rise, project delay, regional drop, quality drop, incident surge, stale source', '/alerts', 'DONE'],
  ['تشخیص علت و پیش‌بینی با هوش مصنوعی (فاز بعد)', 'AI root cause & prediction (later phase)', '/alerts', 'OUT']] },
{ no: '13', fa: 'معماری پیشنهادی (۸ لایه)', en: 'Proposed architecture (8 layers)', items: [
  ['منابع ← اتصال ← Staging ← کیفیت ← داده یکپارچه ← مدل و KPI ← هوش تجاری و ارائه ← تصمیم‌گیری', 'Sources → ingest → staging → quality → unified → model & KPI → BI → decisions', '/architecture', 'DONE']] },
{ no: '14', fa: 'منابع اطلاعاتی قابل بررسی (۱۵ دسته)', en: 'Candidate sources (15 groups)', items: [
  ['بهره‌برداری، GIS، مشترکین، خاموشی و حوادث، قرائت، مالی، منابع انسانی، پروژه، تدارکات، انبار، HSE، گزارش واحدها، Excel، پایگاه‌های موجود', 'Ops, GIS, customers, outages, metering, finance, HR, projects, procurement, warehouse, HSE, unit reports, Excel, existing DBs', '/sources', 'DONE'],
  ['فهرست نهایی پس از مطالعه وضع موجود و تأیید کارفرما', 'Final list after as-is study & employer approval', '/sources', 'DRAFT']] },
{ no: '15', fa: 'مراحل اجرایی (۸ مرحله)', en: 'Implementation phases (8)', items: [
  ['شناخت، ارزیابی، طراحی معماری، یکپارچه‌سازی، کیفیت، داشبورد، آزمون و Pilot، استقرار و آموزش', 'Discovery, assessment, design, integration, quality, dashboards, test & pilot, rollout & training', '/architecture', 'PROCESS']] },
{ no: '16', fa: 'خروجی‌ها و تحویل‌دادنی‌ها (۲۱ مورد)', en: 'Deliverables (21)', items: [
  ['گزارش وضع موجود، نقشه منابع، نقشه جریان، ارزیابی کیفیت، گزارش مغایرت، Data Dictionary، مدل داده، مدل KPI، قواعد کیفیت', 'As-is, source map, data flow, quality assessment, discrepancy report, dictionary, data model, KPI model, quality rules', '/architecture', 'PROCESS'],
  ['لایه یکپارچه‌سازی، مخزن، داشبورد ارشد و تخصصی، گزارش‌ها، هشدار، Drill-down', 'Integration layer, store, executive & unit dashboards, reports, alerts, drill-down', '/', 'DONE'],
  ['مستندات فنی و کاربری، آموزش، گزارش Pilot، برنامه توسعه', 'Technical & user docs, training, pilot report, roadmap', '/pilot', 'PROCESS']] },
{ no: '17', fa: 'نقش‌ها و مسئولیت‌های کارفرما و مجری', en: 'Employer & contractor roles', items: [
  ['۱۲ مسئولیت مجری و ۸ مسئولیت کارفرما', '12 contractor and 8 employer responsibilities', '/pilot', 'PROCESS']] },
{ no: '18', fa: 'امنیت، دسترسی و حاکمیت داده (۱۰ الزام)', en: 'Security, access & governance (10)', items: [
  ['دسترسی مبتنی بر نقش، سطح‌بندی، ثبت دسترسی، تاریخچه تغییرات، تفکیک دسترسی، کنترل انتقال، پشتیبان‌گیری، حساب‌ها، منشأ، ممیزی', 'RBAC, classification, access log, change history, segregation, transfer control, backup, accounts, provenance, audit', '/architecture', 'DRAFT']] },
{ no: '19', fa: 'شاخص‌های ارزیابی موفقیت پروژه (۱۷ شاخص)', en: 'Project success KPIs (17)', items: [
  ['کیفیت داده: کامل بودن، معتبر، مغایرت شناسایی‌شده و اصلاح‌شده، تکراری، اتصال استاندارد', 'Data quality: completeness, valid, discrepancies found & fixed, duplicates, standard links', '/kpi', 'DONE'],
  ['عملکرد سامانه: زمان گزارش، زمان به‌روزرسانی، موفقیت انتقال، پاسخ داشبورد، خطاهای انتقال', 'Platform: report time, refresh time, ETL success, dashboard response, transfer errors', '/kpi', 'DONE'],
  ['مدیریتی: کاهش زمان گزارش، کاهش گزارش دستی، دسترسی مدیران، اختلاف اعداد، ردیابی، سرعت تصمیم', 'Management: report time saved, manual reports, access, mismatch, traceability, decision speed', '/kpi', 'DONE']] },
{ no: '20', fa: 'دستاوردهای مورد انتظار', en: 'Expected achievements', items: [
  ['سطح مدیریت ارشد، معاونت‌ها، فناوری اطلاعات و سازمان', 'Executive, deputies, IT and organisation levels', '/kpi', 'DONE']] },
{ no: '21–22', fa: 'مسیر تحول دیجیتال و توسعه آتی', en: 'Digital roadmap & future development', items: [
  ['مراحل ۱ تا ۴ (داده، اطلاعات، پایش، تحلیل)', 'Stages 1–4 (data, information, monitoring, analysis)', '/architecture', 'DONE'],
  ['مراحل ۵ تا ۷ و قابلیت‌های هوش مصنوعی، پیش‌بینی، دوقلوی دیجیتال', 'Stages 5–7: AI, prediction, digital twin', '/architecture', 'OUT']] },
{ no: '23', fa: 'رویکرد پیشنهادی Pilot', en: 'Pilot approach', items: [
  ['منابع محدود با اهمیت بالا و یک زنجیره کامل: دریافت ← کیفیت ← یکپارچه‌سازی ← KPI ← داشبورد ← گزارش', 'Few high-value sources, one full chain: ingest → quality → integrate → KPI → dashboard → report', '/pilot', 'DONE']] },
{ no: '25', fa: 'خلاصه خدمات (۱۸ خدمت)', en: 'Services summary (18)', items: [
  ['از گزارش As-Is تا Development Roadmap', 'From As-Is report to development roadmap', '/architecture', 'DONE']] }];
