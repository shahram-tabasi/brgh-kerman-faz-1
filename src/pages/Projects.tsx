import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceArea,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis } from
'recharts';
import { BriefcaseIcon, FileSignatureIcon, FlagIcon, ListTreeIcon, ShieldAlertIcon, TargetIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { KpiTile } from '../components/common/KpiTile';
import { LevelBadge, Tag } from '../components/common/Badge';
import { Meter } from '../components/common/Gauge';
import { DataTable } from '../components/common/DataTable';
import { Lineage } from '../components/common/Lineage';
import { Segmented } from '../components/common/Segmented';
import { GRID_STROKE, Legend, PALETTE, useAxes } from '../components/charts/ChartKit';
import { useLocale } from '../contexts/LocaleContext';
import { contractLabel, deputies, projectTotals, projects } from '../data/projects';
import type { ContractStatus, Project } from '../data/projects';
import { company, regionById } from '../data/regions';
import { kpiById, kpiLevel } from '../data/kpis';
import { levelColor } from '../utils/format';

const CONTRACT_TONE: Record<ContractStatus, 'ok' | 'warn' | 'crit' | 'elec' | 'slate'> = {
  ACTIVE: 'elec', SIGNED: 'ok', TENDER: 'warn', SUSPENDED: 'crit', CLOSED: 'slate'
};

export function Projects() {
  const { tr, tx, n, pct } = useLocale();
  const ax = useAxes();
  const [deputy, setDeputy] = useState('ALL');
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'RISK' | 'DELAYED'>('ALL');
  const [selected, setSelected] = useState<string>('PRJ-102');

  const rows = useMemo(
    () => projects.filter((p) =>
    (deputy === 'ALL' || p.deputyId === deputy) && (
    filter === 'ALL' ||
    filter === 'CRITICAL' && p.critical ||
    filter === 'RISK' && p.risk !== 'OK' ||
    filter === 'DELAYED' && p.delayDays > 0)
    ),
    [deputy, filter]
  );
  const sel = projects.find((p) => p.id === selected) ?? rows[0];

  const contractCounts = (Object.keys(contractLabel) as ContractStatus[]).map((c) => ({
    c, count: projects.filter((p) => p.contract === c).length
  }));

  const cols = [
  { key: 'id', label: tr('کد', 'Code'), render: (p: Project) => <span className="font-mono text-elec-300">{p.id}</span> },
  { key: 'name', label: tr('پروژه', 'Project'), render: (p: Project) => <span className="block max-w-[260px] truncate">{tx(p.name)}</span> },
  { key: 'reg', label: tr('منطقه', 'Region'), render: (p: Project) => tx(regionById(p.regionId).name) },
  {
    key: 'phy', label: tr('پیشرفت فیزیکی / برنامه', 'Physical / plan'), width: '170px',
    render: (p: Project) =>
    <div className="flex items-center gap-2">
          <div className="relative h-1.5 w-20 bg-slate-500/15">
            <div className="absolute inset-y-0 start-0 bg-elec-400" style={{ width: `${p.physical}%` }} />
            <div className="absolute inset-y-[-3px] w-[2px] bg-slate-200" style={{ insetInlineStart: `${p.planned}%` }} />
          </div>
          <span className="font-mono text-2xs">{pct(p.physical, 0)} / {pct(p.planned, 0)}</span>
        </div>

  },
  { key: 'fin', label: tr('پیشرفت مالی', 'Financial'), align: 'end' as const, render: (p: Project) => pct(p.financial, 0) },
  {
    key: 'dl', label: tr('انحراف زمانی', 'Time var.'), align: 'end' as const,
    render: (p: Project) => <span className={p.delayDays >= 60 ? 'text-signal-crit' : p.delayDays > 0 ? 'text-signal-warn' : 'text-signal-ok'}>{p.delayDays ? `${n(p.delayDays)} ${tr('روز', 'd')}` : tr('به‌موقع', 'on time')}</span>
  },
  {
    key: 'cv', label: tr('انحراف هزینه', 'Cost var.'), align: 'end' as const,
    render: (p: Project) => <span className={p.costVarPct >= 10 ? 'text-signal-crit' : p.costVarPct >= 5 ? 'text-signal-warn' : 'text-slate-300'}>{pct(p.costVarPct, 1)}</span>
  },
  { key: 'ct', label: tr('قرارداد', 'Contract'), render: (p: Project) => <Tag tone={CONTRACT_TONE[p.contract]}>{tx(contractLabel[p.contract])}</Tag> },
  { key: 'risk', label: tr('ریسک', 'Risk'), render: (p: Project) => <span className="flex items-center gap-1"><LevelBadge level={p.risk} size="xs" />{p.critical && <Tag tone="crit">{tr('بحرانی', 'Critical')}</Tag>}</span> }];


  return (
    <>
      <PageHeader
        section="10.3"
        title={tr('داشبورد برنامه‌ریزی و پروژه‌ها', 'Planning & Projects Dashboard')}
        subtitle={tr(
          'پروژه‌های مصوب، پیشرفت فیزیکی و مالی، انحراف زمانی و هزینه، وضعیت قراردادها، پروژه‌های بحرانی و دارای ریسک، تحقق اهداف',
          'Approved projects, physical & financial progress, time & cost variance, contracts, critical and at-risk projects, goal achievement'
        )}
        actions={
        <label className="flex items-center gap-2 text-2xs text-slate-500">
            {tr('معاونت', 'Deputy')}
            <select value={deputy} onChange={(e) => setDeputy(e.target.value)} className="border border-line bg-ink-850 px-2 py-1 text-[12px] text-slate-200 outline-none">
              <option value="ALL">{tr('همه', 'All')}</option>
              {deputies.map((d) => <option key={d.id} value={d.id}>{tx(d.name)}</option>)}
            </select>
          </label>
        } />
      

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 2xl:grid-cols-8">
        <KpiTile label={tr('پروژه‌های مصوب ۱۴۰۵', 'Approved projects 1405')} value={n(company.projects)} unit={`${n(projectTotals.count)} ${tr('پروژه شاخص در فهرست زیر', 'flagship listed below')}`} tone="elec" />
        <KpiTile label={tr('پیشرفت فیزیکی', 'Physical progress')} value={pct(projectTotals.avgPhysical, 0)} unit={`${tr('برنامه', 'plan')} ${pct(projectTotals.avgPlanned, 0)}`} gauge={projectTotals.avgPhysical} tone="elec" />
        <KpiTile label={tr('پیشرفت مالی', 'Financial progress')} value={pct(projectTotals.avgFinancial, 0)} gauge={projectTotals.avgFinancial} tone="forecast" />
        <KpiTile label="SPI" value={pct(kpiById('KPI-07').value, 1)} level={kpiLevel(kpiById('KPI-07'))} trend={kpiById('KPI-07').trend} to="/kpi?id=KPI-07" />
        <KpiTile label={tr('پروژه‌های دارای تأخیر', 'Delayed projects')} value={n(company.delayedProjects)} unit={`${tr('از', 'of')} ${n(company.projects)} · ${tr('شاخص', 'flagship')} ${n(projectTotals.delayed)}`} tone="warn" />
        <KpiTile label={tr('پروژه‌های بحرانی', 'Critical projects')} value={n(projectTotals.critical)} tone="crit" />
        <KpiTile label={tr('انحراف هزینه', 'Cost variance')} value={pct(kpiById('KPI-09').value, 1)} level={kpiLevel(kpiById('KPI-09'))} trend={kpiById('KPI-09').trend} to="/kpi?id=KPI-09" />
        <KpiTile label={tr('تحقق اهداف', 'Goals achieved')} value={pct(projectTotals.goalsMet / projectTotals.goalsTotal * 100, 0)} unit={`${n(projectTotals.goalsMet)} / ${n(projectTotals.goalsTotal)}`} gauge={projectTotals.goalsMet / projectTotals.goalsTotal * 100} tone="ok" />
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-6" title={tr('پیشرفت برنامه‌ای، فیزیکی و مالی', 'Planned vs physical vs financial')} icon={<BriefcaseIcon size={14} />} accent="elec">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows.map((p) => ({ id: p.id, planned: p.planned, physical: p.physical, financial: p.financial }))} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barGap={1}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="id" {...ax.x} interval={0} tick={{ fill: '#64748b', fontSize: 9 }} tickFormatter={(v: string) => v.replace('PRJ-', '')} />
                <YAxis {...ax.y} domain={[0, 100]} />
                <Tooltip content={<ProgressTip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
                <Bar dataKey="planned" name={tr('برنامه', 'Planned')} fill={PALETTE.slate} barSize={7} />
                <Bar dataKey="physical" name={tr('فیزیکی', 'Physical')} fill={PALETTE.elec} barSize={7} />
                <Bar dataKey="financial" name={tr('مالی', 'Financial')} fill={PALETTE.violet} barSize={7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Legend items={[{ label: tr('برنامه', 'Planned'), color: PALETTE.slate }, { label: tr('فیزیکی', 'Physical'), color: PALETTE.elec }, { label: tr('مالی', 'Financial'), color: PALETTE.violet }]} />
        </Panel>

        <Panel className="xl:col-span-4" title={tr('ماتریس انحراف زمانی و هزینه', 'Time vs cost variance matrix')} subtitle={tr('ناحیه قرمز: تأخیر ≥ ۶۰ روز یا انحراف هزینه ≥ ۱۰٪', 'Red zone: delay ≥ 60 d or cost var. ≥ 10%')} icon={<ShieldAlertIcon size={14} />} accent="crit">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
                <CartesianGrid stroke={GRID_STROKE} />
                <ReferenceArea x1={60} x2={110} y1={-5} y2={20} fill={PALETTE.crit} fillOpacity={0.07} />
                <ReferenceArea x1={-5} x2={110} y1={10} y2={20} fill={PALETTE.crit} fillOpacity={0.07} />
                <XAxis type="number" dataKey="x" name={tr('تأخیر (روز)', 'Delay (d)')} {...ax.xn} domain={[-5, 110]} />
                <YAxis type="number" dataKey="y" name={tr('انحراف هزینه٪', 'Cost var. %')} {...ax.y} domain={[-5, 20]} />
                <ZAxis type="number" dataKey="z" range={[40, 360]} />
                <Tooltip content={<ScatterTip />} />
                <Scatter data={rows.map((p) => ({ x: p.delayDays, y: p.costVarPct, z: p.budgetBn, id: p.id, risk: p.risk }))} onClick={(d: {id?: string;}) => d.id && setSelected(d.id)}>
                  {rows.map((p) => <Cell key={p.id} fill={levelColor[p.risk]} fillOpacity={0.7} stroke={p.id === sel?.id ? '#fff' : 'none'} cursor="pointer" />)}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-2xs text-slate-500">{tr('اندازه دایره: بودجه پروژه', 'Bubble size: project budget')}</p>
        </Panel>

        <Panel className="xl:col-span-2" title={tr('وضعیت قراردادها', 'Contracts')} icon={<FileSignatureIcon size={14} />}>
          <ul className="space-y-2.5">
            {contractCounts.map(({ c, count }) =>
            <li key={c}>
                <div className="flex items-center justify-between text-[12px]">
                  <Tag tone={CONTRACT_TONE[c]}>{tx(contractLabel[c])}</Tag>
                  <span className="font-mono text-slate-200">{n(count)}</span>
                </div>
                <div className="mt-1"><Meter value={count} max={projects.length} color={c === 'SUSPENDED' ? PALETTE.crit : c === 'TENDER' ? PALETTE.warn : PALETTE.elec} height={3} /></div>
              </li>
            )}
          </ul>
        </Panel>
      </div>

      <Panel
        title={tr('پروژه‌های شاخص برنامه ۱۴۰۵', 'Flagship projects — 1405 programme')}
        icon={<FlagIcon size={14} />}
        bodyClassName="p-0"
        actions={
        <Segmented
          label={tr('فیلتر', 'Filter')}
          value={filter}
          onChange={setFilter}
          options={[
          { value: 'ALL', label: tr('همه', 'All') },
          { value: 'CRITICAL', label: tr('بحرانی', 'Critical') },
          { value: 'RISK', label: tr('دارای ریسک', 'At risk') },
          { value: 'DELAYED', label: tr('دارای تأخیر', 'Delayed') }]
          } />
        }>
        
        <DataTable columns={cols} rows={rows} rowKey={(p) => p.id} onRowClick={(p) => setSelected(p.id)} activeKey={sel?.id} dense />
      </Panel>

      {sel &&
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
          <Panel
          className="xl:col-span-8"
          title={`${sel.id} — ${tx(sel.name)}`}
          subtitle={`${tx(deputies.find((d) => d.id === sel.deputyId)!.name)} · ${tx(regionById(sel.regionId).name)} · ${tx(sel.contractor)}`}
          icon={<ListTreeIcon size={14} />}
          accent={sel.risk === 'CRIT' ? 'crit' : sel.risk === 'WARN' ? 'warn' : 'elec'}>
          
            <p className="mb-2 text-2xs text-slate-500">
              {tr('شکست مسئله: کل پروژه‌ها ← معاونت ← پروژه ← فعالیت ← وضعیت اجرا', 'Breakdown: all projects → deputy → project → activity → execution status')}
            </p>
            <ul className="space-y-2.5">
              {sel.activities.map((a) => {
              const gap = a.actual - a.planned;
              const tone = gap >= 0 ? PALETTE.ok : gap > -10 ? PALETTE.warn : PALETTE.crit;
              return (
                <li key={a.name.en} className="grid grid-cols-[140px_1fr_120px] items-center gap-3 text-[12px]">
                    <span className="truncate text-slate-300">{tx(a.name)}</span>
                    <div className="relative h-2 bg-slate-500/15">
                      <div className="absolute inset-y-0 start-0" style={{ width: `${a.actual}%`, background: tone }} />
                      <div className="absolute inset-y-[-3px] w-[2px] bg-slate-200" style={{ insetInlineStart: `${a.planned}%` }} />
                    </div>
                    <span className="font-mono text-2xs text-slate-400">
                      {pct(a.actual, 0)} / {pct(a.planned, 0)}{' '}
                      <span style={{ color: tone }}>({gap >= 0 ? '+' : ''}{n(gap)})</span>
                    </span>
                  </li>);

            })}
            </ul>
          </Panel>
          <Panel className="xl:col-span-4" title={tr('خلاصه پروژه', 'Project summary')} icon={<TargetIcon size={14} />}>
            <dl className="space-y-1.5 text-[12px]">
              {[
            [tr('بودجه', 'Budget'), `${n(sel.budgetBn)} ${tr('میلیارد تومان', 'bn toman')}`],
            [tr('هزینه‌شده', 'Spent'), `${n(sel.spentBn)} ${tr('میلیارد تومان', 'bn toman')}`],
            [tr('پیشرفت فیزیکی', 'Physical'), pct(sel.physical, 0)],
            [tr('پیشرفت مالی', 'Financial'), pct(sel.financial, 0)],
            [tr('انحراف زمانی', 'Delay'), `${n(sel.delayDays)} ${tr('روز', 'days')}`],
            [tr('انحراف هزینه', 'Cost variance'), pct(sel.costVarPct, 1)],
            [tr('تحقق اهداف', 'Goals met'), `${n(sel.goalsMet)} / ${n(sel.goalsTotal)}`]].
            map(([k, v]) =>
            <div key={k} className="flex justify-between gap-2">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="font-mono text-slate-200">{v}</dd>
                </div>
            )}
            </dl>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-line pt-2">
              <LevelBadge level={sel.risk} size="xs" />
              <Tag tone={CONTRACT_TONE[sel.contract]}>{tx(contractLabel[sel.contract])}</Tag>
              {sel.critical && <Tag tone="crit">{tr('پروژه بحرانی', 'Critical project')}</Tag>}
            </div>
          </Panel>
        </div>
      }

      <Lineage ids={['SRC-PMIS', 'SRC-FIN', 'SRC-PROC']} />
    </>);

}

function ProgressTip({ active, payload, label }: {active?: boolean;payload?: {name: string;value: number;color: string;}[];label?: string;}) {
  const { tx, pct } = useLocale();
  if (!active || !payload?.length) return null;
  const p = projects.find((x) => x.id === label);
  return (
    <div className="max-w-[240px] border border-line-strong bg-ink-900/95 px-2.5 py-1.5 text-[11px] shadow-xl">
      <p className="mb-1 font-mono text-elec-300">{label}</p>
      {p && <p className="mb-1 text-slate-400">{tx(p.name)}</p>}
      {payload.map((x) =>
      <p key={x.name} className="flex justify-between gap-3"><span style={{ color: x.color }}>{x.name}</span><span className="font-mono text-slate-100">{pct(x.value, 0)}</span></p>
      )}
    </div>);

}

function ScatterTip({ active, payload }: {active?: boolean;payload?: {payload: {id: string;x: number;y: number;};}[];}) {
  const { tr, tx, n, pct } = useLocale();
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const p = projects.find((x) => x.id === d.id)!;
  return (
    <div className="max-w-[240px] border border-line-strong bg-ink-900/95 px-2.5 py-1.5 text-[11px] shadow-xl">
      <p className="font-mono text-elec-300">{d.id}</p>
      <p className="text-slate-400">{tx(p.name)}</p>
      <p className="mt-1 text-slate-300">{tr('تأخیر', 'Delay')}: {n(d.x)} · {tr('هزینه', 'Cost')}: {pct(d.y, 1)}</p>
    </div>);

}
