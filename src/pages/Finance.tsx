import { useMemo } from 'react';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { BanknoteIcon, LandmarkIcon, PieChartIcon, ReceiptIcon, TrendingUpIcon, WalletIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { KpiMasterTile, KpiTile } from '../components/common/KpiTile';
import { Lineage } from '../components/common/Lineage';
import { ChartTooltip, GRID_STROKE, Legend, PALETTE, useAxes } from '../components/charts/ChartKit';
import { useLocale } from '../contexts/LocaleContext';
import { budgetLines, costCategories, credits, monthlyCost, receivables } from '../data/finance';
import { kpiById } from '../data/kpis';
import { regions } from '../data/regions';
import { MONTHS } from '../data/common';

const PIE = [PALETTE.violet, PALETTE.elec, PALETTE.brandOrange, PALETTE.warn, PALETTE.slate];

export function Finance() {
  const { tr, tx, n, pct } = useLocale();
  const ax = useAxes();
  const bn = tr('میلیارد تومان', 'bn toman');

  const trend = useMemo(() => {
    let cp = 0;
    let ca = 0;
    return MONTHS.map((m, i) => {
      cp += monthlyCost.planned[i];
      ca += monthlyCost.actual[i];
      return { m: tx(m), planned: Math.round(monthlyCost.planned[i]), actual: Math.round(monthlyCost.actual[i]), cumDev: Math.round((ca - cp) / cp * 1000) / 10 };
    });
  }, [tx]);

  const remaining = credits.approvedBn - credits.spentBn - credits.committedBn;
  const funnel = [
  { k: tr('مصوب', 'Approved'), v: credits.approvedBn, c: PALETTE.slate },
  { k: tr('تخصیص‌یافته', 'Allocated'), v: credits.allocatedBn, c: PALETTE.brandBlue },
  { k: tr('هزینه‌شده', 'Spent'), v: credits.spentBn, c: PALETTE.elec },
  { k: tr('تعهدشده', 'Committed'), v: credits.committedBn, c: PALETTE.violet },
  { k: tr('مانده آزاد', 'Free balance'), v: remaining, c: PALETTE.ok }];


  const recv = [
  { k: tr('دستگاه‌های دولتی', 'Government'), v: receivables.govBn },
  { k: tr('کشاورزی', 'Agricultural'), v: receivables.agriBn },
  { k: tr('خانگی', 'Residential'), v: receivables.residentialBn },
  { k: tr('تجاری و صنعتی', 'Commercial & industrial'), v: receivables.commercialBn }];


  return (
    <>
      <PageHeader
        section="10.4"
        title={tr('داشبورد مالی', 'Finance Dashboard')}
        subtitle={tr('بودجه، عملکرد بودجه، تعهدات، هزینه‌ها، انحرافات، وضعیت اعتبارات و روند هزینه‌ها', 'Budget, budget performance, commitments, costs, variances, credit status and cost trend')} />
      

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 2xl:grid-cols-8">
        <KpiTile label={tr('بودجه مصوب', 'Approved budget')} value={n(credits.approvedBn)} unit={bn} tone="neutral" />
        <KpiTile label={tr('اعتبار تخصیص‌یافته', 'Allocated credit')} value={n(credits.allocatedBn)} unit={`${bn} · ${pct(credits.allocatedBn / credits.approvedBn * 100, 0)}`} tone="elec" />
        <KpiTile label={tr('هزینه‌شده', 'Spent')} value={n(credits.spentBn)} unit={bn} tone="elec" gauge={credits.spentBn / credits.approvedBn * 100} />
        <KpiTile label={tr('تعهدات', 'Commitments')} value={n(credits.committedBn)} unit={bn} tone="forecast" />
        <KpiMasterTile kpi={kpiById('KPI-10')} />
        <KpiMasterTile kpi={kpiById('KPI-13')} />
        <KpiMasterTile kpi={kpiById('KPI-11')} />
        <KpiMasterTile kpi={kpiById('KPI-12')} />
      </div>

      <Panel title={tr('عملکرد ردیف‌های بودجه', 'Budget line performance')} subtitle={tr('نوار: مصوب ← تخصیص ← هزینه + تعهد', 'Bar: approved → allocated → spent + committed')} icon={<WalletIcon size={14} />} accent="elec" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-line-strong text-2xs uppercase tracking-[0.08em] text-slate-500">
                <th className="px-2.5 py-2 text-start font-semibold">{tr('ردیف بودجه', 'Budget line')}</th>
                <th className="px-2.5 py-2 text-end font-semibold">{tr('مصوب', 'Approved')}</th>
                <th className="px-2.5 py-2 text-end font-semibold">{tr('تخصیص', 'Allocated')}</th>
                <th className="px-2.5 py-2 text-end font-semibold">{tr('هزینه', 'Spent')}</th>
                <th className="px-2.5 py-2 text-end font-semibold">{tr('تعهد', 'Committed')}</th>
                <th className="w-[34%] px-2.5 py-2 text-start font-semibold">{tr('عملکرد', 'Performance')}</th>
                <th className="px-2.5 py-2 text-end font-semibold">{tr('انحراف از تخصیص', 'vs allocation')}</th>
              </tr>
            </thead>
            <tbody>
              {budgetLines.map((b) => {
                const over = b.spentBn > b.allocatedBn;
                const devPct = (b.spentBn - b.allocatedBn) / b.allocatedBn * 100;
                return (
                  <tr key={b.id} className="border-b border-line/60">
                    <td className="whitespace-nowrap px-2.5 py-2 text-slate-200">{tx(b.name)}</td>
                    <td className="px-2.5 py-2 text-end font-mono text-slate-400">{n(b.approvedBn)}</td>
                    <td className="px-2.5 py-2 text-end font-mono text-slate-300">{n(b.allocatedBn)}</td>
                    <td className="px-2.5 py-2 text-end font-mono text-elec-300">{n(b.spentBn)}</td>
                    <td className="px-2.5 py-2 text-end font-mono text-signal-forecast">{n(b.committedBn)}</td>
                    <td className="px-2.5 py-2">
                      <div className="relative h-2.5 bg-slate-500/10">
                        <div className="absolute inset-y-0 start-0" style={{ width: `${b.allocatedBn / b.approvedBn * 100}%`, background: 'rgba(59,111,209,0.35)' }} />
                        <div className="absolute inset-y-[3px] start-0" style={{ width: `${Math.min(100, b.spentBn / b.approvedBn * 100)}%`, background: over ? PALETTE.crit : PALETTE.elec }} />
                        <div
                          className="absolute inset-y-[3px]"
                          style={{ insetInlineStart: `${Math.min(100, b.spentBn / b.approvedBn * 100)}%`, width: `${Math.min(100 - b.spentBn / b.approvedBn * 100, b.committedBn / b.approvedBn * 100)}%`, background: PALETTE.violet, opacity: 0.7 }} />
                        
                      </div>
                    </td>
                    <td className={`px-2.5 py-2 text-end font-mono ${over ? 'text-signal-crit' : 'text-slate-400'}`}>{devPct > 0 ? '+' : ''}{pct(devPct, 1)}</td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-7" title={tr('روند هزینه‌ها — برنامه در برابر واقعی', 'Cost trend — plan vs actual')} icon={<TrendingUpIcon size={14} />} accent="warn">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trend} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="m" {...ax.x} interval={1} />
                <YAxis {...ax.y} />
                <Tooltip content={<ChartTooltip unit={bn} />} />
                <Area dataKey="planned" name={tr('برنامه', 'Plan')} stroke={PALETTE.slate} fill={PALETTE.slate} fillOpacity={0.12} strokeDasharray="4 3" />
                <Line dataKey="actual" name={tr('واقعی', 'Actual')} stroke={PALETTE.brandOrange} strokeWidth={2} dot={{ r: 2.5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <Legend items={[{ label: tr('هزینه برنامه‌ای', 'Planned cost'), color: PALETTE.slate, dashed: true }, { label: tr('هزینه واقعی', 'Actual cost'), color: PALETTE.brandOrange }]} />
          <p className="mt-1 text-2xs text-slate-500">
            {tr('انحراف تجمعی ۱۲ ماه', '12-month cumulative variance')}: <span className="font-mono text-signal-warn">{pct(trend[trend.length - 1].cumDev, 1)}</span>
          </p>
        </Panel>
        <Panel className="xl:col-span-5" title={tr('ترکیب هزینه‌ها', 'Cost composition')} icon={<PieChartIcon size={14} />}>
          <div className="flex items-center gap-3">
            <div className="h-[230px] w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={costCategories.map((c) => ({ name: tx(c.name), value: c.value }))} dataKey="value" innerRadius="55%" outerRadius="85%" paddingAngle={2} stroke="none">
                    {costCategories.map((c, i) => <Cell key={c.name.en} fill={PIE[i]} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip unit={bn} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex-1 space-y-1.5 text-[12px]">
              {costCategories.map((c, i) => {
                const total = costCategories.reduce((a, x) => a + x.value, 0);
                return (
                  <li key={c.name.en} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0" style={{ background: PIE[i] }} />
                    <span className="flex-1 truncate text-slate-300">{tx(c.name)}</span>
                    <span className="font-mono text-slate-400">{pct(c.value / total * 100, 0)}</span>
                  </li>);

              })}
            </ul>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-4" title={tr('وضعیت اعتبارات', 'Credit status')} icon={<LandmarkIcon size={14} />}>
          <ul className="space-y-2.5">
            {funnel.map((f) =>
            <li key={f.k}>
                <div className="flex justify-between text-[12px]">
                  <span className="text-slate-300">{f.k}</span>
                  <span className="font-mono text-slate-200">{n(f.v)} <span className="text-2xs text-slate-500">{bn}</span></span>
                </div>
                <div className="mt-1 h-2 bg-slate-500/10">
                  <div className="h-full" style={{ width: `${f.v / credits.approvedBn * 100}%`, background: f.c }} />
                </div>
              </li>
            )}
          </ul>
        </Panel>
        <Panel className="xl:col-span-4" title={tr('جذب بودجه مناطق', 'Regional budget absorption')} icon={<BanknoteIcon size={14} />}>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regions.map((r) => ({ name: tx(r.name), v: Math.round(r.spentBn / r.budgetBn * 100) }))} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="name" {...ax.x} interval={0} tick={{ fill: '#64748b', fontSize: 8 }} angle={-40} textAnchor="end" height={46} />
                <YAxis {...ax.y} domain={[0, 100]} />
                <Tooltip content={<ChartTooltip unit="%" />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
                <ReferenceLine y={kpiById('KPI-10').target} stroke={PALETTE.ok} strokeDasharray="4 4" />
                <Bar dataKey="v" name={tr('جذب', 'Absorption')} barSize={16}>
                  {regions.map((r) => {
                    const v = r.spentBn / r.budgetBn * 100;
                    return <Cell key={r.id} fill={v > 85 ? PALETTE.warn : v < 65 ? PALETTE.slate : PALETTE.elec} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel className="xl:col-span-4" title={tr('مطالبات از مشترکین', 'Customer receivables')} icon={<ReceiptIcon size={14} />} accent="warn">
          <p className="font-mono text-2xl font-bold text-slate-100">{n(receivables.totalBn)} <span className="text-2xs font-normal text-slate-500">{bn}</span></p>
          <p className="text-2xs text-slate-500">
            {tr('وصول ماه جاری', 'Collected this month')} {n(receivables.collectedMonthBn)} {tr('از', 'of')} {n(receivables.billedMonthBn)} ({pct(receivables.collectedMonthBn / receivables.billedMonthBn * 100, 0)})
          </p>
          <ul className="mt-3 space-y-2">
            {recv.map((r) =>
            <li key={r.k}>
                <div className="flex justify-between text-[12px]"><span className="text-slate-300">{r.k}</span><span className="font-mono text-slate-400">{n(r.v)}</span></div>
                <div className="mt-1 h-1.5 bg-slate-500/10"><div className="h-full bg-signal-warn/80" style={{ width: `${r.v / receivables.totalBn * 100}%` }} /></div>
              </li>
            )}
          </ul>
        </Panel>
      </div>

      <Lineage ids={['SRC-FIN', 'SRC-CIS', 'SRC-PMIS', 'SRC-PROC', 'SRC-HR']} />
    </>);

}
