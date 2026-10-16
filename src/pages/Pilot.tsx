import { CalendarRangeIcon, CheckCircle2Icon, CircleDashedIcon, ClipboardCheckIcon, FlaskConicalIcon, HandshakeIcon, LoaderIcon, ShieldAlertIcon, TargetIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { KpiTile } from '../components/common/KpiTile';
import { LevelBadge, LevelDot, Tag } from '../components/common/Badge';
import { useLocale } from '../contexts/LocaleContext';
import { sourceScore, sources } from '../data/sources';
import { kpiById, kpiLevel } from '../data/kpis';
import { regionById } from '../data/regions';
import type { Level } from '../types';

/** Pilot as of Mehr 1405: week 6 of 16. */
const CURRENT_WEEK = 6;
const TOTAL_WEEKS = 16;

const TIMELINE: {fa: string;en: string;from: number;to: number;}[] = [
{ fa: 'تأیید دامنه، معرفی نمایندگان و اخذ دسترسی‌ها', en: 'Scope sign-off, focal points, access grants', from: 1, to: 3 },
{ fa: 'Data Profiling منابع Pilot و گزارش وضع موجود', en: 'Profiling of pilot sources & as-is report', from: 3, to: 6 },
{ fa: 'مدل داده، فرهنگ داده و تعریف نهایی ۸ شاخص', en: 'Data model, dictionary, final definition of 8 KPIs', from: 5, to: 7 },
{ fa: 'اتصال به منابع، Staging و قواعد کیفیت', en: 'Connectors, staging & quality rules', from: 7, to: 10 },
{ fa: 'محاسبه KPI، داشبورد ارشد و بهره‌برداری، هشدارها', en: 'KPI engine, executive & ops dashboards, alerts', from: 10, to: 13 },
{ fa: 'اجرای موازی با گزارش‌های دستی و آزمون پذیرش', en: 'Parallel run vs manual reports & UAT', from: 13, to: 15 },
{ fa: 'گزارش ارزیابی Pilot و تصمیم توسعه', en: 'Pilot evaluation report & go/no-go', from: 16, to: 16 }];


const PILOT_KPIS = ['KPI-01', 'KPI-02', 'KPI-05', 'KPI-04', 'KPI-03', 'KPI-06', 'KPI-14', 'KPI-18'];

const ACCEPTANCE: {fa: string;en: string;metric: string;}[] = [
{ fa: 'اختلاف SAIDI، SAIFI و تلفات با گزارش رسمی ماهانه کمتر از ۲٪', en: 'SAIDI, SAIFI & loss within ±2% of the official monthly report', metric: '±2%' },
{ fa: 'کامل بودن داده منابع Pilot حداقل ۹۵٪', en: 'Completeness of pilot sources ≥ 95%', metric: '≥95%' },
{ fa: 'به‌روزرسانی منابع روزانه ظرف ۲۴ ساعت؛ حوادث ۱۲۱ ظرف ۱۵ دقیقه', en: 'Daily sources refreshed < 24 h; 121 incidents < 15 min', metric: '<24h' },
{ fa: 'زمان پاسخ داشبورد (صدک ۹۵) کمتر از ۵ ثانیه', en: 'Dashboard p95 response < 5 s', metric: '<5s' },
{ fa: 'استفاده هفتگی حداقل ۱۰ مدیر هدف (ستاد، جیرفت، سیرجان)', en: '≥ 10 target managers using it weekly', metric: '≥10' },
{ fa: 'حذف تهیه دستی گزارش ماهانه خاموشی دو مدیریت Pilot', en: 'Manual monthly outage report retired for both pilot units', metric: '100%' },
{ fa: 'صفر مورد دسترسی غیرمجاز به سامانه‌های مبدأ', en: 'Zero unauthorised access to source systems', metric: '0' }];


const RISKS: {fa: string;en: string;level: Level;mitigation: [string, string];}[] = [
{ fa: 'تأخیر در اخذ مجوز اتصال به پایگاه داده سامانه‌ها', en: 'Delay in DB connection approvals', level: 'CRIT', mitigation: ['استفاده موقت از View فقط‌خواندنی یا خروجی زمان‌بندی‌شده', 'Interim read-only views or scheduled exports'] },
{ fa: 'ناهماهنگی کد فیدر بین GIS و سامانه حوادث', en: 'Feeder code mismatch GIS ↔ incidents', level: 'WARN', mitigation: ['جدول نگاشت کدها و تأیید مالک داده', 'Code-mapping table approved by data owner'] },
{ fa: 'پوشش محدود کنتور هوشمند (حدود ۲۴٪ چاه‌ها)', en: 'Limited smart-meter coverage (~24% of wells)', level: 'WARN', mitigation: ['محاسبه تلفات با قرائت دوره‌ای + AMI و درج سطح اطمینان', 'Loss calculated from periodic reads + AMI with confidence flag'] },
{ fa: 'کمبود وقت کارشناسان واحدها برای اعتبارسنجی', en: 'Limited unit staff time for validation', level: 'WARN', mitigation: ['جلسات کوتاه هفتگی و چک‌لیست اعتبارسنجی', 'Short weekly sessions and validation checklist'] },
{ fa: 'تعاریف متفاوت شاخص‌ها بین واحدها', en: 'Different KPI definitions between units', level: 'OK', mitigation: ['تصویب شناسنامه شاخص در کمیته داده', 'KPI Master approved by data committee'] }];


const CONTRACTOR: [string, string][] = [
['تحلیل و طراحی راهکار', 'Analysis & solution design'], ['معماری سامانه', 'System architecture'], ['طراحی مدل داده', 'Data model'],
['طراحی فرآیندهای یکپارچه‌سازی', 'Integration processes'], ['طراحی قواعد کیفیت داده', 'Data-quality rules'], ['طراحی KPI', 'KPI design'],
['توسعه لایه‌های موردنیاز', 'Build required layers'], ['طراحی داشبوردها', 'Dashboard design'], ['آزمون', 'Testing'],
['مستندسازی', 'Documentation'], ['آموزش', 'Training'], ['استقرار و پشتیبانی اولیه', 'Deployment & initial support']];

const EMPLOYER: [string, string][] = [
['معرفی نمایندگان واحدها', 'Nominate unit representatives'], ['فراهم‌کردن دسترسی‌های موردنیاز', 'Provide required access'],
['ارائه اطلاعات و مستندات سامانه‌ها', 'Provide system information & docs'], ['معرفی مالکین داده', 'Name data owners'],
['همکاری در اعتبارسنجی اطلاعات', 'Help validate data'], ['تأیید شاخص‌ها و تعاریف', 'Approve KPIs & definitions'],
['تأیید خروجی‌ها', 'Approve deliverables'], ['همکاری در اجرای Pilot', 'Support the pilot run']];

export function Pilot() {
  const { tr, tx, n, pct } = useLocale();
  const pilotSources = sources.filter((s) => s.pilot);
  const units = [regionById('JRF'), regionById('SRJ')];

  return (
    <>
      <PageHeader
        section="23"
        title={tr('اجرای Pilot', 'Pilot implementation')}
        subtitle={tr(
          'برای کاهش ریسک: ابتدا تعداد محدودی منبع با اهمیت بالا و یک زنجیره کامل (دریافت ← کیفیت ← یکپارچه‌سازی ← KPI ← داشبورد ← گزارش) در دو مدیریت شهرستان اجرا می‌شود؛ پس از تأیید، دامنه توسعه می‌یابد',
          'To reduce risk, a few high-value sources and one complete chain run in two county units first; scope expands after approval'
        )} />
      

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-6">
        <KpiTile label={tr('مدیریت‌های Pilot', 'Pilot units')} value={units.map((u) => tx(u.name)).join(' + ')} unit={`${n(units.reduce((a, u) => a + u.customers, 0))} ${tr('مشترک', 'customers')} (${pct(units.reduce((a, u) => a + u.customers, 0) / 725400 * 100, 0)})`} tone="elec" />
        <KpiTile label={tr('منابع Pilot', 'Pilot sources')} value={`${n(pilotSources.length)} / ${n(sources.length)}`} tone="elec" />
        <KpiTile label={tr('شاخص‌های Pilot', 'Pilot KPIs')} value={n(PILOT_KPIS.length)} unit={tr('از شناسنامه شاخص', 'from KPI Master')} tone="neutral" />
        <KpiTile label={tr('پیشرفت زمانی', 'Schedule')} value={`${tr('هفته', 'week')} ${n(CURRENT_WEEK)} / ${n(TOTAL_WEEKS)}`} gauge={CURRENT_WEEK / TOTAL_WEEKS * 100} tone="elec" />
        <KpiTile label={tr('داشبوردهای Pilot', 'Pilot dashboards')} value={n(2)} unit={tr('مدیریت ارشد + بهره‌برداری', 'executive + operations')} tone="neutral" />
        <KpiTile label={tr('بودجه Pilot', 'Pilot budget')} value={n(9)} unit={tr('میلیارد تومان (PRJ-112)', 'bn toman (PRJ-112)')} tone="neutral" />
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-7" title={tr('برنامه زمانی ۱۶ هفته‌ای', '16-week schedule')} subtitle={tr(`وضعیت فعلی: هفته ${n(CURRENT_WEEK)}`, `Now: week ${CURRENT_WEEK}`)} icon={<CalendarRangeIcon size={14} />} accent="elec">
          <div className="relative">
            <div className="mb-1 grid grid-cols-[minmax(160px,1.2fr)_2fr] gap-2 text-2xs text-slate-600">
              <span />
              <div className="flex justify-between font-mono">{[1, 4, 8, 12, 16].map((w) => <span key={w}>{n(w)}</span>)}</div>
            </div>
            <ul className="space-y-1.5">
              {TIMELINE.map((t) => {
                const status = t.to < CURRENT_WEEK ? 'DONE' : t.from <= CURRENT_WEEK ? 'ACTIVE' : 'PLANNED';
                const color = status === 'DONE' ? '#34d399' : status === 'ACTIVE' ? '#38bdf8' : '#475569';
                return (
                  <li key={t.en} className="grid grid-cols-[minmax(160px,1.2fr)_2fr] items-center gap-2 text-[12px]">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      {status === 'DONE' ? <CheckCircle2Icon size={12} className="text-signal-ok" /> : status === 'ACTIVE' ? <LoaderIcon size={12} className="text-elec-300" /> : <CircleDashedIcon size={12} className="text-slate-600" />}
                      {tr(t.fa, t.en)}
                    </span>
                    <div className="relative h-3 bg-slate-500/10">
                      <div className="absolute inset-y-0" style={{ insetInlineStart: `${(t.from - 1) / TOTAL_WEEKS * 100}%`, width: `${(t.to - t.from + 1) / TOTAL_WEEKS * 100}%`, background: color, opacity: 0.8 }} />
                      <div className="absolute inset-y-[-3px] w-[2px] bg-signal-warn" style={{ insetInlineStart: `${(CURRENT_WEEK - 0.5) / TOTAL_WEEKS * 100}%` }} />
                    </div>
                  </li>);

              })}
            </ul>
          </div>
        </Panel>

        <Panel className="xl:col-span-5" title={tr('زنجیره کامل Pilot', 'Pilot end-to-end chain')} icon={<FlaskConicalIcon size={14} />}>
          <ol className="space-y-1.5 text-[12px]">
            {[
            ['دریافت داده از ۵ منبع', 'Ingest from 5 sources', 'OK'],
            ['کنترل کیفیت (۷ بُعد)', 'Quality control (7 dimensions)', 'WARN'],
            ['یکپارچه‌سازی و نگاشت کدها', 'Integration & code mapping', 'WARN'],
            ['محاسبه ۸ شاخص', 'Compute 8 KPIs', 'OK'],
            ['داشبورد ارشد و بهره‌برداری', 'Executive & operations dashboards', 'OK'],
            ['گزارش مدیریتی ماهانه خاموشی', 'Monthly outage management report', 'OK']].
            map(([fa, en, l], i) =>
            <li key={en} className="flex items-center gap-2 border border-line bg-ink-800/40 px-2.5 py-1.5">
                <span className="hex-mark grid h-5 w-6 shrink-0 place-items-center bg-elec-400/15 font-mono text-2xs text-elec-300">{n(i + 1)}</span>
                <span className="flex-1 text-slate-300">{tr(fa, en)}</span>
                <LevelDot level={l as Level} pulse={l !== 'OK'} />
              </li>
            )}
          </ol>
          <p className="mt-2 text-2xs leading-relaxed text-slate-500">
            {tr('جیرفت به دلیل تلفات و پیچیدگی شبکه کشاورزی و سیرجان به دلیل بیشترین مشترک و بار صنعتی انتخاب شده‌اند؛ دو الگوی متفاوت برای آزمون واقعی.', 'Jiroft (high losses, agricultural network) and Sirjan (largest customer base, industrial load) give two contrasting real-world test cases.')}
          </p>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-6" title={tr('منابع و شاخص‌های Pilot', 'Pilot sources & KPIs')} icon={<TargetIcon size={14} />} bodyClassName="p-0">
          <table className="w-full border-collapse text-[12px]">
            <tbody>
              {pilotSources.map((s) =>
              <tr key={s.id} className="border-b border-line/60">
                  <td className="px-2.5 py-1.5"><LevelDot level={s.pipeline} /></td>
                  <td className="px-2.5 py-1.5 text-slate-200">{tx(s.name)}</td>
                  <td className="px-2.5 py-1.5 text-2xs text-slate-500">{tx(s.lastSync)}</td>
                  <td className="px-2.5 py-1.5 text-end font-mono text-slate-400">{n(sourceScore(s))}</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex flex-wrap gap-1.5 p-3">
            {PILOT_KPIS.map((id) => {
              const k = kpiById(id);
              return <span key={id} className="flex items-center gap-1 border border-line px-1.5 py-0.5 text-2xs text-slate-300"><LevelDot level={kpiLevel(k)} />{tx(k.name)}</span>;
            })}
          </div>
        </Panel>
        <Panel className="xl:col-span-6" title={tr('معیارهای پذیرش Pilot', 'Pilot acceptance criteria')} icon={<ClipboardCheckIcon size={14} />} accent="elec">
          <ul className="space-y-1.5">
            {ACCEPTANCE.map((a) =>
            <li key={a.en} className="flex items-start gap-2 text-[12px]">
                <span className="mt-0.5 min-w-[46px] border border-elec-400/30 px-1 text-center font-mono text-2xs text-elec-300" dir="ltr">{a.metric}</span>
                <span className="text-slate-300">{tr(a.fa, a.en)}</span>
              </li>
            )}
          </ul>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-6" title={tr('ریسک‌ها و راهکارها', 'Risks & mitigations')} icon={<ShieldAlertIcon size={14} />} accent="warn">
          <ul className="space-y-2">
            {RISKS.map((r) =>
            <li key={r.en} className="border-b border-line/60 pb-2 last:border-0">
                <div className="flex items-center justify-between gap-2 text-[12px]"><span className="text-slate-200">{tr(r.fa, r.en)}</span><LevelBadge level={r.level} size="xs" /></div>
                <p className="mt-0.5 text-2xs text-slate-500">{tr('راهکار', 'Mitigation')}: {tr(...r.mitigation)}</p>
              </li>
            )}
          </ul>
        </Panel>
        <Panel className="xl:col-span-6" title={tr('نقش‌ها و مسئولیت‌ها (بند ۱۷)', 'Roles & responsibilities (§17)')} icon={<HandshakeIcon size={14} />}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-2xs font-semibold text-elec-300">{tr('مسئولیت‌های مجری', 'Contractor')}</p>
              <ul className="space-y-0.5 text-[12px] text-slate-300">{CONTRACTOR.map(([fa, en]) => <li key={en}>• {tr(fa, en)}</li>)}</ul>
            </div>
            <div>
              <p className="mb-1 text-2xs font-semibold text-signal-warn">{tr('مسئولیت‌های کارفرما', 'Employer')}</p>
              <ul className="space-y-0.5 text-[12px] text-slate-300">{EMPLOYER.map(([fa, en]) => <li key={en}>• {tr(fa, en)}</li>)}</ul>
              <p className="mt-2"><Tag tone="warn">{tr('بدون این همکاری‌ها زمان‌بندی Pilot تضمین‌شدنی نیست', 'Schedule depends on these')}</Tag></p>
            </div>
          </div>
        </Panel>
      </div>
    </>);

}
