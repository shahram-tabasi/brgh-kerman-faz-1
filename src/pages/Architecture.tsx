import { Link } from 'react-router-dom';
import { CheckCircle2Icon, CircleDashedIcon, LayersIcon, ListOrderedIcon, LoaderIcon, PackageCheckIcon, RocketIcon, ShieldCheckIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { LevelDot, Tag } from '../components/common/Badge';
import { Meter } from '../components/common/Gauge';
import { useLocale } from '../contexts/LocaleContext';
import { sources } from '../data/sources';
import type { Level } from '../types';

type Phase = 'DONE' | 'ACTIVE' | 'PLANNED';

const LAYERS: {fa: string;en: string;tech: string;level: Level;}[] = [
{ fa: 'سامانه‌ها و منابع اطلاعاتی موجود', en: 'Existing systems & data sources', tech: `${sources.length} sources`, level: 'OK' },
{ fa: 'لایه اتصال و دریافت اطلاعات', en: 'Connection & ingestion layer', tech: 'API / Web Service / Database / File', level: 'OK' },
{ fa: 'لایه Staging و کنترل اولیه', en: 'Staging & initial checks', tech: 'Staging · schema & range checks', level: 'WARN' },
{ fa: 'لایه کیفیت و استانداردسازی داده', en: 'Quality & standardisation layer', tech: 'Cleanse → reconcile → de-duplicate → consistency → validate', level: 'WARN' },
{ fa: 'لایه داده یکپارچه', en: 'Unified data layer', tech: 'Data Warehouse / Data Mart / Unified Data Layer', level: 'OK' },
{ fa: 'لایه مدل اطلاعات و KPI', en: 'Information model & KPI layer', tech: 'Data Model + Data Dictionary + KPI Engine', level: 'OK' },
{ fa: 'لایه هوش تجاری و ارائه', en: 'BI & presentation layer', tech: 'Dashboard + Report + Drill-down + Alert', level: 'OK' },
{ fa: 'مدیریت و تصمیم‌گیری', en: 'Management & decision-making', tech: 'Executives · deputies · units', level: 'OK' }];


const PHASES: {fa: string;en: string;items: [string, string][];status: Phase;progress: number;}[] = [
{ fa: 'شناخت و نیازسنجی', en: 'Discovery & needs analysis', status: 'DONE', progress: 100, items: [['جلسات با مدیران', 'Executive sessions'], ['مصاحبه با واحدها', 'Unit interviews'], ['شناسایی سامانه‌ها', 'System inventory'], ['استخراج نیازهای مدیریتی', 'Management needs']] },
{ fa: 'ارزیابی داده و سامانه‌ها', en: 'Data & system assessment', status: 'ACTIVE', progress: 70, items: [['Data Profiling', 'Data profiling'], ['بررسی کیفیت و مغایرت‌ها', 'Quality & discrepancies'], ['داده‌های بحرانی', 'Critical data'], ['روش‌های اتصال', 'Connection methods']] },
{ fa: 'طراحی معماری و مدل اطلاعات', en: 'Architecture & information model', status: 'ACTIVE', progress: 35, items: [['طراحی معماری', 'Architecture'], ['Data Model', 'Data model'], ['Data Dictionary', 'Data dictionary'], ['طراحی KPI و قواعد کیفیت', 'KPI & quality rules']] },
{ fa: 'پیاده‌سازی لایه یکپارچه‌سازی', en: 'Integration layer build', status: 'PLANNED', progress: 0, items: [['ارتباط با منابع', 'Source connectors'], ['ETL/ELT', 'ETL/ELT'], ['Staging', 'Staging'], ['کنترل خطا', 'Error handling']] },
{ fa: 'پیاده‌سازی کیفیت داده', en: 'Data quality implementation', status: 'PLANNED', progress: 0, items: [['اعتبارسنجی', 'Validation'], ['تطبیق و رفع تکرار', 'Reconcile & de-dupe'], ['گزارش کیفیت', 'Quality report'], ['کنترل مغایرت', 'Discrepancy control']] },
{ fa: 'طراحی و پیاده‌سازی داشبورد', en: 'Dashboard design & build', status: 'ACTIVE', progress: 25, items: [['نمونه اولیه (همین نرم‌افزار) برای نیازسنجی', 'Prototype (this software) for requirements'], ['طراحی UX', 'UX design'], ['داشبورد مدیریت ارشد و واحدها', 'Executive & unit dashboards'], ['KPI، گزارش، Drill-down', 'KPI, reports, drill-down'], ['هشدارها', 'Alerts']] },
{ fa: 'آزمون و Pilot', en: 'Testing & pilot', status: 'PLANNED', progress: 0, items: [['آزمون فنی، داده و عملکرد', 'Technical, data & performance tests'], ['اعتبارسنجی خروجی‌ها', 'Output validation'], ['اجرای Pilot', 'Pilot run']] },
{ fa: 'استقرار و آموزش', en: 'Deployment & training', status: 'PLANNED', progress: 0, items: [['استقرار نهایی', 'Final deployment'], ['آموزش کاربران', 'User training'], ['مستندسازی و تحویل', 'Documentation & handover'], ['پشتیبانی اولیه', 'Initial support']] }];


const DELIVERABLES: [string, string, string, Phase][] = [
['شناخت وضع موجود', 'Current-state assessment', 'As-Is Report', 'ACTIVE'],
['شناسایی منابع اطلاعاتی', 'Data source discovery', 'Data Source Map', 'ACTIVE'],
['تحلیل کیفیت داده', 'Data quality analysis', 'Data Quality Report', 'ACTIVE'],
['طراحی مدل اطلاعات', 'Information model design', 'Unified Data Model', 'ACTIVE'],
['استانداردسازی', 'Standardisation', 'Data Dictionary', 'ACTIVE'],
['یکپارچه‌سازی', 'Integration', 'Integration Layer', 'PLANNED'],
['پاک‌سازی و تطبیق', 'Cleansing & reconciliation', 'Cleansed Data', 'PLANNED'],
['تعریف شاخص‌ها', 'KPI definition', 'KPI Master', 'ACTIVE'],
['مخزن اطلاعاتی', 'Information store', 'Unified Data Layer', 'PLANNED'],
['داشبورد مدیریت ارشد', 'Executive dashboard', 'Executive Dashboard', 'ACTIVE'],
['داشبوردهای تخصصی', 'Specialist dashboards', 'Operational Dashboards', 'ACTIVE'],
['گزارش‌گیری', 'Reporting', 'Management Reports', 'ACTIVE'],
['Drill-down', 'Drill-down', 'Hierarchical Analysis', 'ACTIVE'],
['هشدار', 'Alerting', 'Alert & Exception Management', 'ACTIVE'],
['Pilot', 'Pilot', 'Pilot Implementation', 'ACTIVE'],
['آموزش', 'Training', 'Training', 'PLANNED'],
['مستندسازی', 'Documentation', 'Technical/User Documentation', 'ACTIVE'],
['برنامه توسعه', 'Development plan', 'Development Roadmap', 'PLANNED']];


const SECURITY: [string, string, boolean][] = [
['کنترل دسترسی مبتنی بر نقش', 'Role-based access control', true],
['سطح‌بندی اطلاعات', 'Information classification', true],
['ثبت رخدادهای دسترسی', 'Access event logging', true],
['ثبت تاریخچه تغییرات', 'Change history', true],
['تفکیک دسترسی کاربران', 'User access segregation', true],
['کنترل انتقال اطلاعات', 'Data-transfer control', true],
['پشتیبان‌گیری', 'Backups', true],
['مدیریت حساب‌های کاربری', 'User account management', true],
['ثبت منشأ اطلاعات', 'Data provenance', true],
['قابلیت ممیزی و ردیابی', 'Audit & traceability', false]];


const PHASE_UI: Record<Phase, {icon: JSX.Element;tone: 'ok' | 'elec' | 'slate';fa: string;en: string;}> = {
  DONE: { icon: <CheckCircle2Icon size={13} />, tone: 'ok', fa: 'انجام‌شده', en: 'Done' },
  ACTIVE: { icon: <LoaderIcon size={13} />, tone: 'elec', fa: 'در حال اجرا', en: 'In progress' },
  PLANNED: { icon: <CircleDashedIcon size={13} />, tone: 'slate', fa: 'برنامه‌ریزی‌شده', en: 'Planned' }
};

export function Architecture() {
  const { tr, n } = useLocale();
  return (
    <>
      <PageHeader
        section="13"
        title={tr('معماری سامانه، مراحل اجرا و حاکمیت داده', 'Architecture, delivery phases & data governance')}
        subtitle={tr(
          'سامانه‌های موجود به فعالیت خود ادامه می‌دهند؛ اطلاعات آن‌ها از طریق یک لایه استاندارد و کنترل‌شده جمع‌آوری، یکپارچه و به اطلاعات قابل اعتماد مدیریتی تبدیل می‌شود',
          'Existing systems keep running; their data is collected through a standard, controlled layer, integrated and turned into trusted management information'
        )} />
      

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-5" title={tr('معماری پیشنهادی سامانه', 'Proposed system architecture')} icon={<LayersIcon size={14} />} accent="elec">
          <ol className="flex flex-col items-stretch">
            {LAYERS.map((l, i) =>
            <li key={l.en} className="flex flex-col items-center">
                <div className="relative w-full border border-line bg-ink-800/50 px-3 py-2 text-center">
                  <span className="absolute start-2 top-2"><LevelDot level={l.level} pulse={l.level !== 'OK'} /></span>
                  <p className="text-[12.5px] font-semibold text-slate-100">{tr(l.fa, l.en)}</p>
                  <p className="font-mono text-2xs text-elec-300/80" dir="ltr">{l.tech}</p>
                </div>
                {i < LAYERS.length - 1 &&
              <svg width="56" height="14" viewBox="0 0 56 14" aria-hidden="true" className="my-0.5">
                    <path d="M2 1 L28 13 L54 1" fill="none" stroke="#3b6fd1" strokeWidth="1.5" />
                  </svg>
              }
              </li>
            )}
          </ol>
        </Panel>

        <div className="flex flex-col gap-3 xl:col-span-7">
          <Panel title={tr('مراحل اجرایی پروژه', 'Implementation phases')} icon={<ListOrderedIcon size={14} />}>
            <ol className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {PHASES.map((p, i) => {
                const ui = PHASE_UI[p.status];
                return (
                  <li key={p.en} className="border border-line bg-ink-800/40 p-2.5">
                    <div className="flex items-center gap-2">
                      <span className="hex-mark grid h-6 w-7 shrink-0 place-items-center bg-elec-400/15 font-mono text-2xs font-bold text-elec-300">{n(i + 1)}</span>
                      <p className="flex-1 truncate text-[12.5px] font-semibold text-slate-100">{tr(p.fa, p.en)}</p>
                      <Tag tone={ui.tone}>{ui.icon}{tr(ui.fa, ui.en)}</Tag>
                    </div>
                    <div className="mt-2"><Meter value={p.progress} color={p.status === 'DONE' ? '#34d399' : '#38bdf8'} height={3} /></div>
                    <p className="mt-1.5 text-2xs leading-relaxed text-slate-500">{p.items.map(([fa, en]) => tr(fa, en)).join(' · ')}</p>
                  </li>);

              })}
            </ol>
          </Panel>

          <Panel title={tr('رویکرد اجرای Pilot', 'Pilot approach')} icon={<RocketIcon size={14} />} accent="warn">
            <p className="text-[12px] text-slate-400">
              {tr('ابتدا تعداد محدودی از منابع با اهمیت بالا انتخاب و یک زنجیره کامل پیاده‌سازی می‌شود:', 'A small set of high-value sources is selected first and one complete chain is delivered:')}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[12px]">
              {[['دریافت داده', 'Ingest'], ['کنترل کیفیت', 'Quality control'], ['یکپارچه‌سازی', 'Integrate'], ['محاسبه KPI', 'Compute KPIs'], ['داشبورد', 'Dashboard'], ['گزارش مدیریتی', 'Management report']].map(([fa, en], i) =>
              <span key={en} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-slate-600">{tr('←', '→')}</span>}
                  <span className="border border-elec-400/30 bg-elec-400/10 px-2 py-0.5 text-elec-300">{tr(fa, en)}</span>
                </span>
              )}
            </div>
            <p className="mt-2 text-2xs text-slate-500">
              <Link to="/pilot" className="text-elec-300 hover:underline">{tr('جزئیات کامل Pilot ←', 'Full pilot details →')}</Link> · {tr('منابع منتخب Pilot', 'Pilot sources')}: {sources.filter((s) => s.pilot).map((s) => s.id.replace('SRC-', '')).join(' · ')}
            </p>
          </Panel>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-8" title={tr('خلاصه خدمات و خروجی‌های اصلی', 'Services & key deliverables')} icon={<PackageCheckIcon size={14} />} bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-line-strong text-2xs uppercase tracking-[0.08em] text-slate-500">
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('ردیف', '#')}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('خدمت', 'Service')}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('خروجی اصلی', 'Key output')}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('وضعیت', 'Status')}</th>
                </tr>
              </thead>
              <tbody>
                {DELIVERABLES.map(([fa, en, out, st], i) =>
                <tr key={out + i} className="border-b border-line/60">
                    <td className="px-2.5 py-1.5 font-mono text-slate-500">{n(i + 1)}</td>
                    <td className="px-2.5 py-1.5 text-slate-200">{tr(fa, en)}</td>
                    <td className="px-2.5 py-1.5 text-slate-400" dir="ltr">{out}</td>
                    <td className="px-2.5 py-1.5"><Tag tone={PHASE_UI[st].tone}>{PHASE_UI[st].icon}{tr(PHASE_UI[st].fa, PHASE_UI[st].en)}</Tag></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="border-t border-line px-3 py-2 text-2xs text-slate-500">
            {tr('خروجی‌ها', 'Deliverables')}: <span className="font-mono text-elec-300">{n(DELIVERABLES.filter((d) => d[3] === 'ACTIVE').length)}</span> {tr('در حال تهیه', 'in progress')} · <span className="font-mono text-slate-400">{n(DELIVERABLES.filter((d) => d[3] === 'PLANNED').length)}</span> {tr('برنامه‌ریزی‌شده (مطابق برنامه Pilot — هفته ۶ از ۱۶)', 'planned (per pilot plan — week 6 of 16)')}
          </p>
        </Panel>

        <Panel className="xl:col-span-4" title={tr('الزامات امنیت، دسترسی و حاکمیت داده', 'Security, access & data governance')} icon={<ShieldCheckIcon size={14} />} accent="elec">
          <ul className="space-y-1.5">
            {SECURITY.map(([fa, en, done]) =>
            <li key={en} className="flex items-center gap-2 text-[12px]">
                {done ? <CheckCircle2Icon size={14} className="text-signal-ok" /> : <CircleDashedIcon size={14} className="text-signal-warn" />}
                <span className={done ? 'text-slate-300' : 'text-slate-400'}>{tr(fa, en)}</span>
              </li>
            )}
          </ul>
          <p className="mt-3 border-t border-line pt-2 text-2xs leading-relaxed text-slate-500">
            {tr(
              'یکپارچه‌سازی به معنای دسترسی غیرمجاز به اطلاعات سامانه‌های مبدأ نیست؛ دسترسی‌ها بر اساس سیاست‌های امنیتی و مصوبات شرکت مدیریت می‌شوند.',
              'Integration never grants unauthorised access to source systems; access follows company security policies and resolutions.'
            )}
          </p>
        </Panel>
      </div>
    </>);

}
