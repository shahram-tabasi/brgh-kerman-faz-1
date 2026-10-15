import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { ActivityIcon, AlertTriangleIcon, CpuIcon, MapPinIcon, NetworkIcon, TimerIcon, WrenchIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { KpiTile } from '../components/common/KpiTile';
import { LevelBadge, LevelDot, Tag } from '../components/common/Badge';
import { Meter } from '../components/common/Gauge';
import { DataTable } from '../components/common/DataTable';
import { Lineage } from '../components/common/Lineage';
import { RegionFilter } from '../components/common/RegionFilter';
import { ChartTooltip, GRID_STROKE, Legend, PALETTE, useAxes } from '../components/charts/ChartKit';
import { useLocale } from '../contexts/LocaleContext';
import { company, regionById, regions } from '../data/regions';
import { kpiById, levelOf } from '../data/kpis';
import { faultCauses, incidents, opsTrend, riskPoints, sensitiveAssets } from '../data/operations';
import { MONTHS } from '../data/common';
import { levelColor } from '../utils/format';
import type { Incident, SensitiveAsset } from '../data/operations';

export function Operations() {
  const { tr, tx, n, pct } = useLocale();
  const ax = useAxes();
  const [region, setRegion] = useState('ALL');

  const scope = region === 'ALL' ? null : regionById(region);
  const m = scope ?? {
    peakMW: company.peakMW, capacityMW: company.capacityMW, saidi: company.saidi, saifi: company.saifi,
    outages: company.outages, faults: company.faults, restoreMin: company.restoreMin
  };
  const share = scope ? scope.outages / company.outages : 1;
  const loadShare = scope ? scope.peakMW / company.peakMW : 1;

  const inScope = <T extends {regionId: string;}>(rows: T[]) => region === 'ALL' ? rows : rows.filter((r) => r.regionId === region);
  const incs = inScope(incidents);
  const assets = inScope(sensitiveAssets);
  const risks = inScope(riskPoints);
  const active = incs.filter((i) => i.status === 'ACTIVE');
  const util = m.peakMW / m.capacityMW * 100;

  const trend = useMemo(
    () => MONTHS.map((mo, i) => ({
      m: tx(mo),
      peak: Math.round(opsTrend.peakMW[i] * loadShare),
      cap: Math.round(opsTrend.capacityMW[i] * loadShare),
      outages: Math.round(opsTrend.outages[i] * share),
      faults: Math.round(opsTrend.faults[i] * share),
      restore: opsTrend.restoreMin[i]
    })),
    [tx, share, loadShare]
  );

  const k = (id: string, v: number) => levelOf(kpiById(id), v);

  const assetCols = [
  { key: 'id', label: tr('تجهیز', 'Asset'), render: (a: SensitiveAsset) => <span className="font-mono text-elec-300">{a.id}</span> },
  { key: 'kind', label: tr('نوع', 'Type'), render: (a: SensitiveAsset) => tx(a.kind) },
  { key: 'reg', label: tr('منطقه', 'Region'), render: (a: SensitiveAsset) => tx(regionById(a.regionId).name) },
  {
    key: 'load', label: tr('بارگذاری', 'Loading'), width: '140px',
    render: (a: SensitiveAsset) =>
    <div className="flex items-center gap-2">
          <span className="w-16"><Meter value={Math.min(a.loadingPct, 120)} max={120} color={levelColor[a.level]} /></span>
          <span className="font-mono tabular-nums" style={{ color: levelColor[a.level] }}>{pct(a.loadingPct, 0)}</span>
        </div>

  },
  { key: 'temp', label: tr('دما °C', 'Temp °C'), align: 'end' as const, render: (a: SensitiveAsset) => a.tempC ? n(a.tempC) : '—' },
  { key: 'age', label: tr('عمر', 'Age'), align: 'end' as const, render: (a: SensitiveAsset) => n(a.ageYears) },
  { key: 'f', label: tr('خرابی ۱۲ ماه', 'Faults 12m'), align: 'end' as const, render: (a: SensitiveAsset) => n(a.faults12m) },
  { key: 'lv', label: tr('وضعیت', 'Status'), render: (a: SensitiveAsset) => <LevelBadge level={a.level} size="xs" /> }];


  const incCols = [
  { key: 'id', label: tr('شناسه', 'ID'), render: (i: Incident) => <span className="font-mono text-slate-400">{i.id}</span> },
  { key: 't', label: tr('زمان', 'Time'), render: (i: Incident) => <span className="font-mono">{n(Number(i.time.slice(0, 2)))}:{i.time.slice(3)}</span> },
  { key: 'r', label: tr('منطقه / فیدر', 'Region / feeder'), render: (i: Incident) => <>{tx(regionById(i.regionId).name)} · <span className="font-mono text-elec-300">{i.feeder}</span></> },
  { key: 'ty', label: tr('نوع رخداد', 'Event'), render: (i: Incident) => tx(i.type) },
  { key: 'c', label: tr('مشترک متأثر', 'Customers'), align: 'end' as const, render: (i: Incident) => n(i.customers) },
  { key: 'd', label: tr('مدت (دقیقه)', 'Duration'), align: 'end' as const, render: (i: Incident) => n(i.durationMin) },
  {
    key: 's', label: tr('وضعیت', 'Status'),
    render: (i: Incident) => i.status === 'ACTIVE' ? <Tag tone="crit">{tr('فعال', 'Active')}</Tag> : <Tag tone="ok">{tr('وصل شده', 'Restored')}</Tag>
  }];


  return (
    <>
      <PageHeader
        section="10.2"
        title={tr('داشبورد بهره‌برداری', 'Operations Dashboard')}
        subtitle={tr(
          'وضعیت شبکه، بار تجهیزات، خاموشی‌ها، رخدادها، قابلیت اطمینان، تجهیزات حساس، روند خرابی، زمان رفع خاموشی و نقاط پرریسک',
          'Network status, equipment loading, outages, incidents, reliability, sensitive assets, fault trend, restoration time and high-risk points'
        )}
        actions={<RegionFilter value={region} onChange={setRegion} />} />
      

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 2xl:grid-cols-8">
        <KpiTile label={tr('پیک بار', 'Peak load')} value={n(m.peakMW)} unit={tr('مگاوات', 'MW')} tone="elec" trend={trend.map((t) => t.peak)} />
        <KpiTile label={tr('بار به ظرفیت', 'Load / capacity')} value={pct(util, 1)} level={k('KPI-04', util)} gauge={util} to="/kpi?id=KPI-04" />
        <KpiTile label={tr('رخداد فعال', 'Active incidents')} value={n(active.length)} unit={`${n(active.reduce((a, i) => a + i.customers, 0))} ${tr('مشترک', 'customers')}`} tone={active.length ? 'crit' : 'ok'} />
        <KpiTile label={tr('خاموشی ماه', 'Outages (month)')} value={n(m.outages)} unit={tr('مورد', 'events')} tone="warn" trend={trend.map((t) => t.outages)} />
        <KpiTile label="SAIDI" value={n(m.saidi)} unit={tr('دقیقه/مشترک', 'min/customer')} level={k('KPI-01', m.saidi)} to="/kpi?id=KPI-01" />
        <KpiTile label="SAIFI" value={n(m.saifi, 2)} unit={tr('بار/مشترک', 'int./customer')} level={k('KPI-02', m.saifi)} to="/kpi?id=KPI-02" />
        <KpiTile label={tr('زمان رفع خاموشی', 'Restoration time')} value={n(m.restoreMin)} unit={tr('دقیقه', 'min')} level={k('KPI-05', m.restoreMin)} to="/kpi?id=KPI-05" />
        <KpiTile label={tr('خرابی تجهیزات', 'Equipment faults')} value={n(m.faults)} unit={tr('مورد در ماه', 'per month')} tone="warn" trend={trend.map((t) => t.faults)} />
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-4" title={tr('وضعیت شبکه — بار به ظرفیت مناطق', 'Network status — load vs capacity')} icon={<NetworkIcon size={14} />} accent="elec">
          <ul className="space-y-2">
            {regions.map((r) => {
              const u = r.peakMW / r.capacityMW * 100;
              const l = k('KPI-04', u);
              const dim = region !== 'ALL' && region !== r.id;
              return (
                <li key={r.id} className={`transition-opacity duration-150 ${dim ? 'opacity-35' : ''}`}>
                  <button type="button" onClick={() => setRegion(region === r.id ? 'ALL' : r.id)} className="w-full text-start">
                    <div className="flex items-baseline justify-between text-[12px]">
                      <span className="flex items-center gap-1.5 text-slate-300"><LevelDot level={l} />{tx(r.name)}</span>
                      <span className="font-mono text-2xs text-slate-500">
                        {n(r.peakMW)} / {n(r.capacityMW)} {tr('مگاوات', 'MW')} · <span style={{ color: levelColor[l] }}>{pct(u, 0)}</span>
                      </span>
                    </div>
                    <div className="mt-1"><Meter value={u} color={levelColor[l]} height={4} /></div>
                  </button>
                </li>);

            })}
          </ul>
        </Panel>

        <Panel className="xl:col-span-5" title={tr('بار و ظرفیت — ۱۲ ماه', 'Load & capacity — 12 months')} icon={<ActivityIcon size={14} />}>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trend} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="m" {...ax.x} interval={1} />
                <YAxis {...ax.y} />
                <Tooltip content={<ChartTooltip unit={tr('مگاوات', 'MW')} />} />
                <Bar dataKey="peak" name={tr('پیک بار', 'Peak load')} fill={PALETTE.elec} fillOpacity={0.75} barSize={14} />
                <Line dataKey="cap" name={tr('ظرفیت', 'Capacity')} stroke={PALETTE.warn} strokeWidth={2} dot={false} strokeDasharray="5 3" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <Legend items={[{ label: tr('پیک بار', 'Peak load'), color: PALETTE.elec }, { label: tr('ظرفیت در دسترس', 'Available capacity'), color: PALETTE.warn, dashed: true }]} />
        </Panel>

        <Panel className="xl:col-span-3" title={tr('علل خرابی', 'Fault causes')} icon={<WrenchIcon size={14} />}>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={faultCauses.map((f) => ({ name: tx(f.name), v: Math.round(f.count * share), c: f.color }))} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
                <XAxis type="number" {...ax.xn} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={92} axisLine={false} tickLine={false} orientation={ax.y.orientation} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
                <Bar dataKey="v" name={tr('تعداد', 'Count')} barSize={12}>
                  {faultCauses.map((f) => <Cell key={f.color} fill={f.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-7" title={tr('روند خاموشی و خرابی', 'Outage & fault trend')} icon={<AlertTriangleIcon size={14} />} accent="warn">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trend} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="m" {...ax.x} interval={1} />
                <YAxis {...ax.y} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="outages" name={tr('خاموشی', 'Outages')} fill={PALETTE.crit} fillOpacity={0.7} barSize={10} />
                <Bar dataKey="faults" name={tr('خرابی', 'Faults')} fill={PALETTE.orange} fillOpacity={0.6} barSize={10} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <Legend items={[{ label: tr('خاموشی', 'Outages'), color: PALETTE.crit }, { label: tr('خرابی تجهیزات', 'Equipment faults'), color: PALETTE.orange }]} />
        </Panel>
        <Panel className="xl:col-span-5" title={tr('زمان رفع خاموشی به تفکیک منطقه', 'Restoration time by region')} icon={<TimerIcon size={14} />}>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regions.map((r) => ({ name: tx(r.name), v: r.restoreMin, id: r.id }))} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="name" {...ax.x} interval={0} tick={{ fill: '#64748b', fontSize: 9 }} />
                <YAxis {...ax.y} />
                <Tooltip content={<ChartTooltip unit={tr('دقیقه', 'min')} />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
                <ReferenceLine y={kpiById('KPI-05').target} stroke={PALETTE.ok} strokeDasharray="4 4" />
                <ReferenceLine y={kpiById('KPI-05').warn} stroke={PALETTE.warn} strokeDasharray="2 4" />
                <Bar dataKey="v" name={tr('رفع خاموشی', 'Restoration')} barSize={18}>
                  {regions.map((r) =>
                  <Cell key={r.id} fill={levelColor[k('KPI-05', r.restoreMin)]} fillOpacity={region === 'ALL' || region === r.id ? 0.85 : 0.25} />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Legend items={[{ label: tr('هدف ۴۵ دقیقه', 'Target 45 min'), color: PALETTE.ok, dashed: true }, { label: tr('حد هشدار ۶۰', 'Warning 60'), color: PALETTE.warn, dashed: true }]} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-7" title={tr('رخدادهای ۲۴ ساعت اخیر', 'Incidents — last 24 h')} icon={<AlertTriangleIcon size={14} />} accent="crit" bodyClassName="p-0">
          <DataTable columns={incCols} rows={incs} rowKey={(i) => i.id} dense />
          {!incs.length && <p className="p-3 text-[12px] text-slate-500">{tr('رخدادی ثبت نشده است.', 'No incidents recorded.')}</p>}
        </Panel>
        <Panel className="xl:col-span-5" title={tr('نقاط دارای ریسک بالا', 'High-risk points')} icon={<MapPinIcon size={14} />} accent="warn">
          <ul className="space-y-2">
            {risks.map((p) =>
            <li key={p.name.en} className="flex items-start gap-2.5 border-b border-line/60 pb-2 last:border-0 last:pb-0">
                <span className="mt-1.5"><LevelDot level={p.level} pulse /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] text-slate-200">{tx(p.name)}</p>
                  <p className="text-2xs text-slate-500">{tx(regionById(p.regionId).name)} · {tx(p.reason)}</p>
                </div>
                <LevelBadge level={p.level} size="xs" />
              </li>
            )}
            {!risks.length && <li className="text-[12px] text-slate-500">{tr('نقطه پرریسکی در این منطقه ثبت نشده.', 'No high-risk points in this region.')}</li>}
          </ul>
        </Panel>
      </div>

      <Panel title={tr('وضعیت تجهیزات حساس', 'Sensitive equipment status')} subtitle={tr('قاعده: بارگذاری ≥ ۹۰٪ هشدار، ≥ ۹۵٪ بحرانی', 'Rule: loading ≥ 90% warning, ≥ 95% critical')} icon={<CpuIcon size={14} />} bodyClassName="p-0">
        <DataTable columns={assetCols} rows={assets} rowKey={(a) => a.id} dense />
      </Panel>

      <Lineage ids={['SRC-SCADA', 'SRC-OMS', 'SRC-GIS', 'SRC-AM', 'SRC-121']} />
    </>);

}
