import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FunctionSquareIcon, TargetIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { LevelBadge, LevelDot, Tag } from '../components/common/Badge';
import { Segmented } from '../components/common/Segmented';
import { Lineage } from '../components/common/Lineage';
import { ChartTooltip, GRID_STROKE, Legend, PALETTE, useAxes } from '../components/charts/ChartKit';
import { useLocale } from '../contexts/LocaleContext';
import { achievement, kpiById, kpiLevel, kpis } from '../data/kpis';
import { sources } from '../data/sources';
import { MONTHS } from '../data/common';
import type { KpiCategory } from '../types';
import { levelColor } from '../utils/format';

const CAT: Record<KpiCategory, [string, string]> = {
  executive: ['کلان', 'Executive'],
  operations: ['بهره‌برداری', 'Operations'],
  projects: ['پروژه', 'Projects'],
  finance: ['مالی', 'Finance'],
  customers: ['مشترکین', 'Customers'],
  data: ['کیفیت داده', 'Data quality'],
  platform: ['عملکرد سامانه', 'Platform performance'],
  management: ['مدیریتی (دستاورد)', 'Management benefit']
};

export function KpiMaster() {
  const { tr, tx, n, pct } = useLocale();
  const ax = useAxes();
  const [params, setParams] = useSearchParams();
  const [cat, setCat] = useState<'ALL' | KpiCategory>('ALL');
  const selId = params.get('id') ?? 'KPI-01';
  const k = kpiById(selId) ?? kpis[0];
  const rows = useMemo(() => kpis.filter((x) => cat === 'ALL' || x.category === cat), [cat]);
  const d = k.digits ?? 1;
  const data = k.trend.map((v, i) => ({ m: tx(MONTHS[i]), v }));
  const srcIds = k.sources[0] === 'ALL' ? sources.map((s) => s.id) : k.sources;

  return (
    <>
      <PageHeader
        section="9"
        title={tr('موتور شاخص‌ها و شناسنامه شاخص (KPI Master)', 'KPI engine & KPI Master')}
        subtitle={tr(
          'برای هر شاخص کلیدی یک مرجع واحد: تعریف، فرمول، داده‌ها و منبع، دوره محاسبه، واحد، حد مطلوب، حد هشدار، حد بحرانی و مسئول',
          'One reference per KPI: definition, formula, data & source, period, unit, target, warning, critical threshold and owner'
        )}
        actions={
        <Segmented
          label={tr('دسته', 'Category')}
          value={cat}
          onChange={setCat}
          options={[{ value: 'ALL' as const, label: tr('همه', 'All') }, ...(Object.keys(CAT) as KpiCategory[]).map((c) => ({ value: c, label: tr(...CAT[c]) }))]} />
        } />
      

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-7" title={tr('فهرست شاخص‌ها', 'KPI register')} icon={<TargetIcon size={14} />} bodyClassName="p-0">
          <div className="max-h-[560px] overflow-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead className="sticky top-0 bg-ink-850">
                <tr className="border-b border-line-strong text-2xs uppercase tracking-[0.08em] text-slate-500">
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('کد', 'ID')}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('نام شاخص', 'KPI')}</th>
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('دسته', 'Category')}</th>
                  <th className="px-2.5 py-2 text-end font-semibold">{tr('مقدار', 'Value')}</th>
                  <th className="px-2.5 py-2 text-end font-semibold">{tr('مطلوب / هشدار / بحرانی', 'Target / warn / crit')}</th>
                  <th className="px-2.5 py-2 text-end font-semibold">{tr('تحقق', 'Achv.')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((x) => {
                  const l = kpiLevel(x);
                  const dd = x.digits ?? 1;
                  return (
                    <tr
                      key={x.id}
                      tabIndex={0}
                      onClick={() => setParams({ id: x.id })}
                      onKeyDown={(e) => {if (e.key === 'Enter') setParams({ id: x.id });}}
                      className={`cursor-pointer border-b border-line/60 transition-colors duration-150 hover:bg-elec-400/[0.06] focus:outline-none ${x.id === k.id ? 'bg-elec-400/[0.1]' : ''}`}>
                      
                      <td className="whitespace-nowrap px-2.5 py-1.5 font-mono text-2xs text-slate-500">{x.id}</td>
                      <td className="px-2.5 py-1.5 text-slate-200"><span className="flex items-center gap-1.5"><LevelDot level={l} />{tx(x.name)}</span></td>
                      <td className="px-2.5 py-1.5"><Tag>{tr(...CAT[x.category])}</Tag></td>
                      <td className="whitespace-nowrap px-2.5 py-1.5 text-end font-mono" style={{ color: levelColor[l] }}>{n(x.value, dd)}</td>
                      <td className="whitespace-nowrap px-2.5 py-1.5 text-end font-mono text-2xs text-slate-500">
                        <span className="text-signal-ok">{n(x.target, dd)}</span> / <span className="text-signal-warn">{n(x.warn, dd)}</span> / <span className="text-signal-crit">{n(x.crit, dd)}</span>
                      </td>
                      <td className="px-2.5 py-1.5 text-end font-mono text-slate-400">{pct(achievement(x), 0)}</td>
                    </tr>);

                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="flex flex-col gap-3 xl:col-span-5">
          <Panel title={`${k.id} — ${tx(k.name)}`} icon={<FunctionSquareIcon size={14} />} accent={kpiLevel(k) === 'OK' ? 'elec' : kpiLevel(k) === 'WARN' ? 'warn' : 'crit'} actions={<LevelBadge level={kpiLevel(k)} size="xs" />}>
            <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-1.5 text-[12px]">
              <dt className="text-slate-500">{tr('تعریف', 'Definition')}</dt><dd className="text-slate-300">{tx(k.definition)}</dd>
              <dt className="text-slate-500">{tr('فرمول', 'Formula')}</dt><dd className="font-mono text-2xs text-elec-300" dir="ltr">{k.formula}</dd>
              <dt className="text-slate-500">{tr('منابع داده', 'Data sources')}</dt><dd className="flex flex-wrap gap-1">{(k.sources[0] === 'ALL' ? [tr('همه منابع', 'All sources')] : k.sources).map((s) => <Tag key={s} tone="elec">{s}</Tag>)}</dd>
              <dt className="text-slate-500">{tr('داده‌های موردنیاز', 'Required data')}</dt>
              <dd className="flex flex-wrap gap-1">
                {(k.data ?? []).length ? (k.data ?? []).map((d) => <Link key={d} to={`/dictionary?id=${d}`} className="border border-signal-forecast/30 px-1.5 py-0.5 font-mono text-2xs text-signal-forecast hover:bg-signal-forecast/10">{d}</Link>) : <span className="text-2xs text-slate-500">{tr('متاداده و لاگ‌های پلتفرم', 'Platform metadata & logs')}</span>}
              </dd>
              <dt className="text-slate-500">{tr('دوره محاسبه', 'Period')}</dt><dd className="text-slate-300">{tx(k.period)}</dd>
              <dt className="text-slate-500">{tr('واحد', 'Unit')}</dt><dd className="text-slate-300">{tx(k.unit)}</dd>
              <dt className="text-slate-500">{tr('جهت مطلوب', 'Better when')}</dt><dd className="text-slate-300">{k.direction === 'higher' ? tr('بیشتر بهتر', 'higher') : tr('کمتر بهتر', 'lower')}</dd>
              <dt className="text-slate-500">{tr('حدود', 'Thresholds')}</dt>
              <dd className="font-mono text-2xs">
                <span className="text-signal-ok">{tr('مطلوب', 'target')} {n(k.target, d)}</span> · <span className="text-signal-warn">{tr('هشدار', 'warn')} {n(k.warn, d)}</span> · <span className="text-signal-crit">{tr('بحرانی', 'crit')} {n(k.crit, d)}</span>
              </dd>
              <dt className="text-slate-500">{tr('مسئول شاخص', 'Owner')}</dt><dd className="text-slate-300">{tx(k.owner)}</dd>
              <dt className="text-slate-500">{tr('مقدار جاری', 'Current')}</dt><dd className="font-mono text-base font-semibold" style={{ color: levelColor[kpiLevel(k)] }}>{n(k.value, d)} <span className="text-2xs font-normal text-slate-500">{tx(k.unit)}</span></dd>
            </dl>
          </Panel>
          <Panel title={tr('روند ۱۲ ماهه', '12-month trend')}>
            <div className="h-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                  <XAxis dataKey="m" {...ax.x} interval={2} />
                  <YAxis {...ax.y} domain={['auto', 'auto']} />
                  <Tooltip content={<ChartTooltip unit={tx(k.unit)} />} />
                  <ReferenceLine y={k.target} stroke={PALETTE.ok} strokeDasharray="4 4" />
                  <ReferenceLine y={k.warn} stroke={PALETTE.warn} strokeDasharray="2 4" />
                  <ReferenceLine y={k.crit} stroke={PALETTE.crit} strokeDasharray="2 4" />
                  <Area dataKey="v" name={tx(k.name)} stroke="none" fill={levelColor[kpiLevel(k)]} fillOpacity={0.1} />
                  <Line dataKey="v" name={tx(k.name)} stroke={levelColor[kpiLevel(k)]} strokeWidth={2} dot={{ r: 2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <Legend items={[{ label: tr('مطلوب', 'Target'), color: PALETTE.ok, dashed: true }, { label: tr('هشدار', 'Warning'), color: PALETTE.warn, dashed: true }, { label: tr('بحرانی', 'Critical'), color: PALETTE.crit, dashed: true }]} />
          </Panel>
        </div>
      </div>
      <Lineage ids={srcIds.slice(0, 8)} />
    </>);

}
