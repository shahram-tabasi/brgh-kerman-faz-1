import { useMemo, useState } from 'react';
import { ClipboardCheckIcon, GridIcon, ListChecksIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { KpiMasterTile, KpiTile } from '../components/common/KpiTile';
import { Gauge } from '../components/common/Gauge';
import { Tag } from '../components/common/Badge';
import { Segmented } from '../components/common/Segmented';
import { useLocale } from '../contexts/LocaleContext';
import { DIMENSIONS, dimensionAvg, dimensionLabel, issues, overallQuality, sourceScore, sources } from '../data/sources';
import type { QualityIssue } from '../data/sources';
import { kpiById } from '../data/kpis';

const scoreColor = (v: number) => v >= 90 ? '#34d399' : v >= 80 ? '#f59e0b' : '#ef4444';

const PRI = { HIGH: ['بالا', 'High', 'crit'], MEDIUM: ['متوسط', 'Medium', 'warn'], LOW: ['پایین', 'Low', 'slate'] } as const;
const STAT = { OPEN: ['باز', 'Open', 'crit'], IN_PROGRESS: ['در حال اصلاح', 'In progress', 'elec'], RESOLVED: ['اصلاح‌شده', 'Resolved', 'ok'] } as const;

export function Quality() {
  const { tr, tx, n } = useLocale();
  const [status, setStatus] = useState<'ALL' | QualityIssue['status']>('ALL');
  const list = useMemo(() => {
    const rank = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return issues.filter((i) => status === 'ALL' || i.status === status).sort((a, b) => rank[a.priority] - rank[b.priority] || b.records - a.records);
  }, [status]);
  const resolved = issues.filter((i) => i.status === 'RESOLVED').length;

  return (
    <>
      <PageHeader
        section="8"
        title={tr('مدیریت کیفیت داده', 'Data quality management')}
        subtitle={tr(
          'سازوکار نظام‌مند کیفیت داده در هفت بُعد؛ برای خطاهای مهم، قواعد اصلاح، تطبیق و اولویت‌بندی اصلاحات تعریف می‌شود',
          'Systematic data-quality control across seven dimensions; correction, reconciliation and prioritisation rules for significant errors'
        )} />
      

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-6">
        <div className="flex items-center gap-3 border border-line bg-ink-850/70 px-3 py-2">
          <Gauge value={overallQuality} size={58} thickness={6} color={scoreColor(overallQuality)} label={<span className="font-mono text-[13px] font-bold" style={{ color: scoreColor(overallQuality) }}>{n(overallQuality, 0)}</span>} />
          <div>
            <p className="text-2xs uppercase tracking-[0.1em] text-slate-500">{tr('امتیاز کل کیفیت', 'Overall quality')}</p>
            <p className="text-2xs text-slate-500">{tr('میانگین ۷ بُعد × ۱۷ منبع', '7 dimensions × 17 sources')}</p>
          </div>
        </div>
        <KpiMasterTile kpi={kpiById('KPI-18')} />
        <KpiMasterTile kpi={kpiById('KPI-19')} />
        <KpiMasterTile kpi={kpiById('KPI-20')} />
        <KpiTile label={tr('مغایرت‌های شناسایی‌شده', 'Discrepancies found')} value={n(issues.length)} unit={`${n(issues.reduce((a, i) => a + i.records, 0))} ${tr('رکورد', 'records')}`} tone="warn" />
        <KpiTile label={tr('اصلاح‌شده', 'Resolved')} value={n(resolved)} unit={`${tr('از', 'of')} ${n(issues.length)}`} tone="ok" gauge={resolved / issues.length * 100} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
        {DIMENSIONS.map((d, i) => {
          const v = dimensionAvg(d);
          return (
            <div key={d} className="relative border border-line bg-ink-850/70 px-3 py-2">
              <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: scoreColor(v) }} />
              <p className="flex items-center justify-between text-2xs text-slate-500">
                <span className="font-mono">{n(8)}.{n(i + 1)}</span>
              </p>
              <p className="text-[12.5px] font-semibold text-slate-200">{tx(dimensionLabel[d])}</p>
              <p className="font-mono text-xl font-semibold" style={{ color: scoreColor(v) }}>{n(v, 1)}</p>
              <p className="mt-1 text-2xs leading-snug text-slate-500">{tx(dimensionLabel[d].q)}</p>
            </div>);

        })}
      </div>

      <Panel title={tr('ماتریس کیفیت: منابع × ابعاد', 'Quality matrix: sources × dimensions')} subtitle={tr('سبز ≥ ۹۰ · زرد ≥ ۸۰ · قرمز < ۸۰', 'Green ≥ 90 · amber ≥ 80 · red < 80')} icon={<GridIcon size={14} />} bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-line-strong text-2xs uppercase tracking-[0.06em] text-slate-500">
                <th className="px-2.5 py-2 text-start font-semibold">{tr('منبع', 'Source')}</th>
                {DIMENSIONS.map((d) => <th key={d} className="px-1.5 py-2 text-center font-semibold">{tx(dimensionLabel[d])}</th>)}
                <th className="px-2.5 py-2 text-center font-semibold">{tr('کل', 'Total')}</th>
              </tr>
            </thead>
            <tbody>
              {[...sources].sort((a, b) => sourceScore(a) - sourceScore(b)).map((s) =>
              <tr key={s.id} className="border-b border-line/60">
                  <td className="whitespace-nowrap px-2.5 py-1 text-slate-300">{tx(s.name)}</td>
                  {DIMENSIONS.map((d) => {
                  const v = s.scores[d];
                  const c = scoreColor(v);
                  return (
                    <td key={d} className="px-1 py-1">
                        <span className="block py-0.5 text-center font-mono" style={{ color: c, background: `${c}${v >= 90 ? '10' : '22'}` }}>{n(v)}</span>
                      </td>);

                })}
                  <td className="px-2.5 py-1 text-center font-mono font-semibold" style={{ color: scoreColor(sourceScore(s)) }}>{n(sourceScore(s))}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title={tr('مغایرت‌ها، قواعد اصلاح و اولویت‌بندی', 'Discrepancies, correction rules & priority')}
        icon={<ListChecksIcon size={14} />}
        accent="warn"
        bodyClassName="p-0"
        actions={
        <Segmented
          label={tr('وضعیت', 'Status')}
          value={status}
          onChange={setStatus}
          options={[{ value: 'ALL', label: tr('همه', 'All') }, { value: 'OPEN', label: tr('باز', 'Open') }, { value: 'IN_PROGRESS', label: tr('در حال اصلاح', 'In progress') }, { value: 'RESOLVED', label: tr('اصلاح‌شده', 'Resolved') }]} />
        }>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-line-strong text-2xs uppercase tracking-[0.08em] text-slate-500">
                <th className="px-2.5 py-2 text-start font-semibold">{tr('کد', 'ID')}</th>
                <th className="px-2.5 py-2 text-start font-semibold">{tr('شرح مغایرت', 'Discrepancy')}</th>
                <th className="px-2.5 py-2 text-start font-semibold">{tr('بُعد', 'Dimension')}</th>
                <th className="px-2.5 py-2 text-start font-semibold">{tr('قاعده کنترل', 'Control rule')}</th>
                <th className="px-2.5 py-2 text-end font-semibold">{tr('رکورد', 'Records')}</th>
                <th className="px-2.5 py-2 text-start font-semibold">{tr('اولویت', 'Priority')}</th>
                <th className="px-2.5 py-2 text-start font-semibold">{tr('وضعیت', 'Status')}</th>
                <th className="px-2.5 py-2 text-start font-semibold">{tr('مسئول', 'Owner')}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((i) =>
              <tr key={i.id} className="border-b border-line/60">
                  <td className="px-2.5 py-1.5 font-mono text-2xs text-slate-500">{i.id}</td>
                  <td className="px-2.5 py-1.5 text-slate-200">
                    {tx(i.title)}
                    <span className="ms-1.5 inline-flex gap-1">{i.sourceIds.map((s) => <Tag key={s}>{s.replace('SRC-', '')}</Tag>)}</span>
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-1.5 text-slate-400">{tx(dimensionLabel[i.dimension])}</td>
                  <td className="whitespace-nowrap px-2.5 py-1.5 font-mono text-2xs text-elec-300" dir="ltr">{i.rule}</td>
                  <td className="px-2.5 py-1.5 text-end font-mono text-slate-400">{n(i.records)}</td>
                  <td className="px-2.5 py-1.5"><Tag tone={PRI[i.priority][2]}>{tr(PRI[i.priority][0], PRI[i.priority][1])}</Tag></td>
                  <td className="px-2.5 py-1.5"><Tag tone={STAT[i.status][2]}>{tr(STAT[i.status][0], STAT[i.status][1])}</Tag></td>
                  <td className="whitespace-nowrap px-2.5 py-1.5 text-2xs text-slate-400">{tx(i.owner)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <p className="flex items-center gap-1.5 text-2xs text-slate-500">
        <ClipboardCheckIcon size={12} />
        {tr('چرخه: تعریف قاعده ← کنترل خودکار در لایه Staging ← ثبت مغایرت ← اعلام به مالک داده ← اصلاح در سامانه مبدأ ← کنترل مجدد', 'Cycle: define rule → automatic check in staging → log discrepancy → notify data owner → fix at source → re-check')}
      </p>
    </>);

}
