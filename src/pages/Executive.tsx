import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import {
  BellRingIcon,
  BriefcaseIcon,
  GaugeIcon,
  HelpCircleIcon,
  LineChartIcon,
  MapIcon,
  PowerOffIcon,
  UsersIcon,
  WalletIcon,
  ZapIcon } from
'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { KpiMasterTile } from '../components/common/KpiTile';
import { LevelBadge, LevelDot } from '../components/common/Badge';
import { Meter } from '../components/common/Gauge';
import { Lineage } from '../components/common/Lineage';
import { ChartTooltip, GRID_STROKE, Legend, PALETTE, useAxes } from '../components/charts/ChartKit';
import { useLocale } from '../contexts/LocaleContext';
import { kpiById, kpiLevel, kpis, levelOf } from '../data/kpis';
import { company, regionScore, regions } from '../data/regions';
import { alerts, categoryLabel } from '../data/alerts';
import { projectTotals, projects } from '../data/projects';
import { incidents, sensitiveAssets } from '../data/operations';
import { MONTHS } from '../data/common';
import type { Level, Region } from '../types';
import { levelColor } from '../utils/format';

const EXEC_KPIS = ['KPI-01', 'KPI-03', 'KPI-04', 'KPI-07', 'KPI-10', 'KPI-11', 'KPI-14', 'KPI-16'];

function worst(levels: Level[]): Level {
  if (levels.includes('CRIT')) return 'CRIT';
  if (levels.includes('WARN')) return 'WARN';
  return 'OK';
}

export function Executive() {
  const { tr, tx, n, pct } = useLocale();
  const [trendId, setTrendId] = useState('KPI-01');

  const lv = (id: string) => kpiLevel(kpiById(id));
  const activeIncidents = incidents.filter((i) => i.status === 'ACTIVE');

  const domains = [
  {
    key: 'ops', to: '/operations', icon: <ZapIcon size={14} />, title: tr('وضعیت بهره‌برداری', 'Operations'),
    level: worst([lv('KPI-02'), lv('KPI-05'), lv('KPI-06')]),
    rows: [
    [tr('خرابی ماه', 'Faults (month)'), n(company.faults)],
    [tr('رفع خاموشی', 'Restoration'), `${n(company.restoreMin)} ${tr('دقیقه', 'min')}`]]

  },
  {
    key: 'out', to: '/operations', icon: <PowerOffIcon size={14} />, title: tr('وضعیت خاموشی‌ها', 'Outages'),
    level: worst([lv('KPI-01'), lv('KPI-02')]),
    rows: [
    [tr('خاموشی فعال', 'Active now'), n(activeIncidents.length)],
    [tr('مشترک متأثر', 'Customers off'), n(activeIncidents.reduce((a, i) => a + i.customers, 0))]]

  },
  {
    key: 'load', to: '/operations', icon: <GaugeIcon size={14} />, title: tr('بار و ظرفیت', 'Load & capacity'),
    level: lv('KPI-04'),
    rows: [
    [tr('پیک بار', 'Peak load'), `${n(company.peakMW)} ${tr('مگاوات', 'MW')}`],
    [tr('ظرفیت', 'Capacity'), `${n(company.capacityMW)} ${tr('مگاوات', 'MW')}`]]

  },
  {
    key: 'prj', to: '/projects', icon: <BriefcaseIcon size={14} />, title: tr('وضعیت پروژه‌ها', 'Projects'),
    level: worst([lv('KPI-07'), lv('KPI-08'), lv('KPI-09')]),
    rows: [
    [tr('پیشرفت / برنامه', 'Actual / plan'), `${pct(projectTotals.avgPhysical, 0)} / ${pct(projectTotals.avgPlanned, 0)}`],
    [tr('بحرانی', 'Critical'), n(projectTotals.critical)]]

  },
  {
    key: 'fin', to: '/finance', icon: <WalletIcon size={14} />, title: tr('وضعیت مالی', 'Finance'),
    level: worst([lv('KPI-10'), lv('KPI-11'), lv('KPI-12'), lv('KPI-13')]),
    rows: [
    [tr('جذب بودجه', 'Absorption'), pct(company.spentBn / company.budgetBn * 100, 0)],
    [tr('وصول', 'Collection'), pct(company.collectionPct, 0)]]

  },
  {
    key: 'cus', to: '/customers', icon: <UsersIcon size={14} />, title: tr('وضعیت مشترکین', 'Customers'),
    level: worst([lv('KPI-14'), lv('KPI-15'), lv('KPI-16')]),
    rows: [
    [tr('مشترکین', 'Customers'), n(company.customers)],
    [tr('رضایت', 'Satisfaction'), n(company.satisfaction, 0)]]

  }];


  const kpiHealth = useMemo(() => {
    const c = { OK: 0, WARN: 0, CRIT: 0 } as Record<Level, number>;
    kpis.forEach((k) => c[kpiLevel(k)]++);
    return c;
  }, []);

  const openAlerts = alerts.filter((a) => a.state !== 'RESOLVED');

  return (
    <>
      <PageHeader
        section="10.1"
        title={tr('داشبورد مدیرعامل و مدیریت ارشد', 'CEO & Executive Dashboard')}
        subtitle={tr(
          'تصویر کلان شرکت: شاخص‌های کلیدی، بهره‌برداری، خاموشی، بار و ظرفیت، پروژه‌ها، مالی، مشترکین و عملکرد مناطق',
          'Company-wide picture: key KPIs, operations, outages, load & capacity, projects, finance, customers and regional performance'
        )} />
      

      {/* briefing + domain status */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <section className="relative flex items-center gap-3 overflow-hidden border border-line bg-ink-850/80 p-3 xl:col-span-3">
          <span className="brand-band absolute inset-y-0 start-0 w-[3px]" />
          <img src="/brand/baba-barghi.png" alt="" className="h-20 w-20 shrink-0 rounded-full bg-white object-cover ring-2 ring-signal-warn/40" />
          <div className="min-w-0">
            <p className="text-2xs uppercase tracking-[0.12em] text-slate-500">{tr('خلاصه وضعیت امروز', "Today's briefing")}</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-slate-300 fa-body">
              {tr(
                `از ${n(kpis.length)} شاخص کلیدی، ${n(kpiHealth.OK)} مطلوب، ${n(kpiHealth.WARN)} در هشدار و ${n(kpiHealth.CRIT)} بحرانی است. ${n(openAlerts.length)} هشدار باز وجود دارد.`,
                `Of ${kpis.length} KPIs, ${kpiHealth.OK} are on target, ${kpiHealth.WARN} in warning and ${kpiHealth.CRIT} critical. ${openAlerts.length} alerts are open.`
              )}
            </p>
            <div className="mt-2 flex h-1.5 w-full overflow-hidden">
              {(['OK', 'WARN', 'CRIT'] as Level[]).map((l) =>
              <span key={l} style={{ width: `${kpiHealth[l] / kpis.length * 100}%`, background: levelColor[l] }} />
              )}
            </div>
          </div>
        </section>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:col-span-9 xl:grid-cols-6">
          {domains.map((d) =>
          <Link
            key={d.key}
            to={d.to}
            className="group relative flex flex-col border border-line bg-ink-850/70 px-3 py-2 transition-colors duration-150 hover:border-elec-400/40">
            
              <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: levelColor[d.level] }} />
              <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-elec-300">
                {d.icon}
                <span className="truncate text-[12px] font-semibold">{d.title}</span>
              </div>
              <div className="mt-1.5">
                <LevelBadge level={d.level} size="xs" />
              </div>
              <dl className="mt-1.5 space-y-0.5 text-2xs">
                {d.rows.map(([k, v]) =>
              <div key={k} className="flex justify-between gap-2">
                    <dt className="truncate text-slate-500">{k}</dt>
                    <dd className="font-mono text-slate-200">{v}</dd>
                  </div>
              )}
              </dl>
            </Link>
          )}
        </div>
      </div>

      {/* key KPIs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 2xl:grid-cols-8">
        {EXEC_KPIS.map((id) => <KpiMasterTile key={id} kpi={kpiById(id)} />)}
      </div>

      <ManagementQuestions />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <RegionalPanel />
        <Panel
          className="xl:col-span-4"
          title={tr('شاخص‌های هشدار و انحراف', 'Alerts & deviations')}
          icon={<BellRingIcon size={14} />}
          accent="crit"
          actions={
          <Link to="/alerts" className="text-2xs text-slate-500 transition-colors duration-150 hover:text-signal-crit">
              {tr('همه هشدارها', 'All alerts')}
            </Link>
          }>
          
          <ul className="space-y-1.5">
            {openAlerts.slice(0, 7).map((a) =>
            <li key={a.id}>
                <Link to={a.link} className="flex items-start gap-2 border border-transparent px-1 py-1 transition-colors duration-150 hover:border-line hover:bg-ink-800/50">
                  <span className="mt-1.5"><LevelDot level={a.level} pulse /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] text-slate-200">{tx(a.title)}</p>
                    <p className="truncate text-2xs text-slate-500">{tx(categoryLabel[a.category])} · {tx(a.detail)}</p>
                  </div>
                  <span className="shrink-0 text-2xs text-slate-600">{tx(a.time)}</span>
                </Link>
              </li>
            )}
          </ul>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel
          className="xl:col-span-8"
          title={tr('روند شاخص‌های کلیدی', 'Key KPI trend')}
          subtitle={tr('۱۲ ماه اخیر — خطوط هدف و حد هشدار از شناسنامه شاخص', 'Last 12 months — target & warning lines from the KPI Master')}
          icon={<LineChartIcon size={14} />}
          accent="elec">
          
          <div className="mb-2 flex flex-wrap gap-1">
            {kpis.filter((k) => k.category !== 'data').map((k) =>
            <button
              key={k.id}
              type="button"
              onClick={() => setTrendId(k.id)}
              aria-pressed={trendId === k.id}
              className={`flex items-center gap-1 border px-1.5 py-0.5 text-2xs transition-colors duration-150 ${
              trendId === k.id ? 'border-elec-400/50 bg-elec-400/10 text-elec-300' : 'border-line text-slate-500 hover:text-slate-300'}`
              }>
              
                <LevelDot level={kpiLevel(k)} />
                {tx(k.name)}
              </button>
            )}
          </div>
          <KpiTrendChart id={trendId} />
        </Panel>
        <Panel className="xl:col-span-4" title={tr('عملکرد مناطق (امتیاز ترکیبی)', 'Regional performance score')} icon={<MapIcon size={14} />}>
          <RegionScores />
          <p className="mt-2 border-t border-line pt-2 text-2xs leading-relaxed text-slate-500">
            {tr(
              'امتیاز = ۳۰٪ قابلیت اطمینان + ۲۰٪ تلفات + ۲۰٪ رضایت + ۱۵٪ وصول + ۱۵٪ پروژه‌های به‌موقع (فرمول شفاف و قابل ممیزی)',
              'Score = 30% reliability + 20% loss + 20% satisfaction + 15% collection + 15% on-time projects (transparent, auditable formula)'
            )}
          </p>
        </Panel>
      </div>

      <Lineage ids={['SRC-OMS', 'SRC-SCADA', 'SRC-CIS', 'SRC-FIN', 'SRC-PMIS', 'SRC-APP', 'SRC-MDM']} />
    </>);

}

function KpiTrendChart({ id }: {id: string;}) {
  const { tx, n } = useLocale();
  const ax = useAxes();
  const k = kpiById(id);
  const data = k.trend.map((v, i) => ({ m: tx(MONTHS[i]), v }));
  const color = levelColor[kpiLevel(k)];
  return (
    <>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} vertical={false} />
            <XAxis dataKey="m" {...ax.x} interval={1} />
            <YAxis {...ax.y} domain={['auto', 'auto']} />
            <Tooltip content={<ChartTooltip unit={tx(k.unit)} />} />
            <ReferenceLine y={k.target} stroke={PALETTE.ok} strokeDasharray="4 4" />
            <ReferenceLine y={k.warn} stroke={PALETTE.warn} strokeDasharray="2 4" />
            <ReferenceLine y={k.crit} stroke={PALETTE.crit} strokeDasharray="2 4" />
            <Area dataKey="v" name={tx(k.name)} stroke="none" fill={color} fillOpacity={0.1} />
            <Line dataKey="v" name={tx(k.name)} stroke={color} strokeWidth={2} dot={{ r: 2.5, fill: color }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Legend
        items={[
        { label: tx(k.name), color },
        { label: `${tx({ fa: 'هدف', en: 'Target' })} ${n(k.target, k.digits ?? 1)}`, color: PALETTE.ok, dashed: true },
        { label: `${tx({ fa: 'هشدار', en: 'Warning' })} ${n(k.warn, k.digits ?? 1)}`, color: PALETTE.warn, dashed: true },
        { label: `${tx({ fa: 'بحرانی', en: 'Critical' })} ${n(k.crit, k.digits ?? 1)}`, color: PALETTE.crit, dashed: true }]
        } />
      
    </>);

}

function RegionScores() {
  const { tx, n } = useLocale();
  const navigate = useNavigate();
  const rows = [...regions].map((r) => ({ r, s: regionScore(r) })).sort((a, b) => b.s - a.s);
  return (
    <ul className="space-y-1.5">
      {rows.map(({ r, s }) => {
        const level: Level = s >= 75 ? 'OK' : s >= 65 ? 'WARN' : 'CRIT';
        return (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => navigate(`/drilldown?path=${r.id}`)}
              className="flex w-full items-center gap-2 text-start text-[12px] transition-colors duration-150 hover:text-elec-300">
              
              <span className="w-24 shrink-0 truncate text-slate-300">{tx(r.name)}</span>
              <span className="flex-1"><Meter value={s} color={levelColor[level]} height={5} /></span>
              <span className="w-8 shrink-0 text-end font-mono tabular-nums" style={{ color: levelColor[level] }}>{n(s)}</span>
            </button>
          </li>);

      })}
    </ul>);

}

type Col = {key: string;fa: string;en: string;kpi: string;get: (r: Region) => number;digits?: number;};

const COLS: Col[] = [
{ key: 'saidi', fa: 'SAIDI', en: 'SAIDI', kpi: 'KPI-01', get: (r) => r.saidi },
{ key: 'saifi', fa: 'SAIFI', en: 'SAIFI', kpi: 'KPI-02', get: (r) => r.saifi, digits: 2 },
{ key: 'loss', fa: 'تلفات٪', en: 'Loss %', kpi: 'KPI-03', get: (r) => r.lossPct, digits: 1 },
{ key: 'util', fa: 'بار/ظرفیت٪', en: 'Util. %', kpi: 'KPI-04', get: (r) => r.peakMW / r.capacityMW * 100 },
{ key: 'rest', fa: 'رفع خاموشی', en: 'Restore', kpi: 'KPI-05', get: (r) => r.restoreMin },
{ key: 'delay', fa: 'پروژه تأخیری٪', en: 'Delayed %', kpi: 'KPI-08', get: (r) => r.delayedProjects / r.projects * 100 },
{ key: 'coll', fa: 'وصول٪', en: 'Collect. %', kpi: 'KPI-11', get: (r) => r.collectionPct },
{ key: 'resp', fa: 'پاسخگویی (ساعت)', en: 'Response h', kpi: 'KPI-14', get: (r) => r.responseHrs },
{ key: 'sat', fa: 'رضایت', en: 'Satisf.', kpi: 'KPI-16', get: (r) => r.satisfaction }];


function RegionalPanel() {
  const { tr, tx, n } = useLocale();
  const navigate = useNavigate();
  return (
    <Panel
      className="xl:col-span-8"
      title={tr('شاخص‌های عملکرد مناطق', 'Regional performance indicators')}
      subtitle={tr('رنگ هر خانه با حدود شناسنامه شاخص تعیین می‌شود — برای شکست مسئله روی منطقه کلیک کنید', 'Cell colour follows KPI Master thresholds — click a region to drill down')}
      icon={<MapIcon size={14} />}
      bodyClassName="p-0">
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-line-strong">
              <th className="px-2.5 py-2 text-start text-2xs font-semibold uppercase tracking-[0.1em] text-slate-500">{tr('منطقه', 'Region')}</th>
              {COLS.map((c) =>
              <th key={c.key} className="whitespace-nowrap px-2 py-2 text-center text-2xs font-semibold uppercase tracking-[0.06em] text-slate-500">
                  {tr(c.fa, c.en)}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {regions.map((r) =>
            <tr
              key={r.id}
              tabIndex={0}
              onClick={() => navigate(`/drilldown?path=${r.id}`)}
              onKeyDown={(e) => {if (e.key === 'Enter') navigate(`/drilldown?path=${r.id}`);}}
              className="cursor-pointer border-b border-line/60 transition-colors duration-150 hover:bg-elec-400/[0.06] focus:bg-elec-400/[0.08] focus:outline-none">
              
                <td className="whitespace-nowrap px-2.5 py-1.5 text-slate-200">{tx(r.name)}</td>
                {COLS.map((c) => {
                const v = c.get(r);
                const l = levelOf(kpiById(c.kpi), v);
                const color = levelColor[l];
                return (
                  <td key={c.key} className="px-1 py-1">
                      <span
                      className="block px-1.5 py-1 text-center font-mono tabular-nums"
                      style={{ color, background: `${color}${l === 'OK' ? '10' : '1f'}` }}>
                      
                        {n(v, c.digits ?? 0)}
                      </span>
                    </td>);

              })}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>);

}

/** Spec §2-1: the management questions that used to need several systems — each answered here in one click. */
function ManagementQuestions() {
  const { tr, n, pct } = useLocale();
  const overloaded = sensitiveAssets.filter((a) => a.loadingPct >= 90).length;
  const weakRegions = regions.filter((r) => regionScore(r) < 65).length;
  const reliabilityProjects = projects.filter((p) => ['PRJ-101', 'PRJ-103', 'PRJ-107'].includes(p.id));
  const qs: {q: [string, string];a: string;to: string;}[] = [
  { q: ['وضعیت فعلی بار شبکه چیست؟', 'What is the current network load?'], a: `${n(company.peakMW)} / ${n(company.capacityMW)} ${tr('مگاوات', 'MW')} (${pct(company.peakMW / company.capacityMW * 100, 0)})`, to: '/operations' },
  { q: ['کدام تجهیزات با ریسک یا اضافه‌بار مواجه‌اند؟', 'Which assets are at risk or overloaded?'], a: `${n(overloaded)} ${tr('تجهیز بالای ۹۰٪ بار', 'assets above 90% load')}`, to: '/operations' },
  { q: ['وضعیت خاموشی‌ها چگونه است؟', 'What is the outage situation?'], a: `SAIDI ${n(company.saidi)} · SAIFI ${n(company.saifi, 2)}`, to: '/operations' },
  { q: ['عملکرد مناطق نسبت به اهداف چگونه است؟', 'How do regions perform vs targets?'], a: `${n(weakRegions)} ${tr('مدیریت زیر امتیاز ۶۵', 'units below score 65')}`, to: '/drilldown' },
  { q: ['چه میزان از پروژه‌های مصوب پیشرفت داشته‌اند؟', 'How far have approved projects progressed?'], a: `${pct(projectTotals.avgPhysical, 0)} ${tr('در برابر برنامه', 'vs plan')} ${pct(projectTotals.avgPlanned, 0)}`, to: '/projects' },
  { q: ['انحراف زمانی و مالی پروژه‌ها چقدر است؟', 'What are project time & cost variances?'], a: `${n(company.delayedProjects)} ${tr('پروژه با تأخیر', 'delayed')} · ${tr('هزینه', 'cost')} ${pct(kpiById('KPI-09').value, 1)}`, to: '/projects' },
  { q: ['کدام پروژه‌ها بیشترین اثر بر قابلیت اطمینان دارند؟', 'Which projects most affect reliability?'], a: reliabilityProjects.map((p) => p.id).join('، '), to: '/projects' },
  { q: ['وضعیت شاخص‌های بهره‌برداری، مالی، مشترکین و منابع انسانی؟', 'Status of operations, finance, customer & HR KPIs?'], a: `${n(kpis.filter((k) => kpiLevel(k) !== 'OK').length)} ${tr('شاخص خارج از حد مطلوب', 'KPIs off target')}`, to: '/kpi' }];

  return (
    <Panel
      title={tr('پرسش‌های مدیریتی — پاسخ در یک نگاه', 'Management questions — answered at a glance')}
      subtitle={tr('پرسش‌های بند ۲-۱ شرح خدمات که پیش‌تر نیازمند استخراج دستی از چند سامانه بود', 'The §2-1 questions that previously required manual extraction from several systems')}
      icon={<HelpCircleIcon size={14} />}>
      
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {qs.map((x) =>
        <Link key={x.q[1]} to={x.to} className="group border border-line bg-ink-800/40 px-2.5 py-2 transition-colors duration-150 hover:border-elec-400/40">
            <p className="text-[12px] text-slate-300 group-hover:text-elec-300">{tr(x.q[0], x.q[1])}</p>
            <p className="mt-1 font-mono text-[12px] text-slate-100">{x.a}</p>
          </Link>
        )}
      </div>
    </Panel>);

}
