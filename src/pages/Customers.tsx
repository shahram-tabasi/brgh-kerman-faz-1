import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { ClipboardListIcon, HeadphonesIcon, MessageSquareWarningIcon, StarIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { KpiTile } from '../components/common/KpiTile';
import { Meter } from '../components/common/Gauge';
import { Lineage } from '../components/common/Lineage';
import { RegionFilter } from '../components/common/RegionFilter';
import { ChartTooltip, GRID_STROKE, Legend, PALETTE, useAxes } from '../components/charts/ChartKit';
import { useLocale } from '../contexts/LocaleContext';
import { company, regionById, regions } from '../data/regions';
import { complaintTypes, customerTypes, requestTrend, requestTypes, serviceQuality, serviceStatus } from '../data/customers';
import { kpiById, levelOf } from '../data/kpis';
import { MONTHS } from '../data/common';
import { levelColor } from '../utils/format';

export function Customers() {
  const { tr, tx, n, pct } = useLocale();
  const ax = useAxes();
  const [region, setRegion] = useState('ALL');
  const r = region === 'ALL' ? null : regionById(region);
  const m = r ?? company;
  const share = r ? r.customers / company.customers : 1;
  const per10k = m.complaints / m.customers * 10000;

  const trend = useMemo(
    () => MONTHS.map((mo, i) => ({ m: tx(mo), received: Math.round(requestTrend.received[i] * share), closed: Math.round(requestTrend.closed[i] * share) })),
    [tx, share]
  );
  const backlog = trend.reduce((a, t) => a + t.received - t.closed, 0);
  const k = (id: string, v: number) => levelOf(kpiById(id), v);

  return (
    <>
      <PageHeader
        section="10.5"
        title={tr('داشبورد مشترکین و خدمات', 'Customers & Services Dashboard')}
        subtitle={tr('تعداد مشترکین، درخواست‌ها، زمان پاسخگویی، شکایات، وضعیت خدمات، روند درخواست‌ها و شاخص‌های کیفیت خدمات', 'Customer base, requests, response time, complaints, service status, request trend and service-quality indicators')}
        actions={<RegionFilter value={region} onChange={setRegion} />} />
      

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-6">
        <KpiTile label={tr('تعداد مشترکین', 'Customers')} value={n(m.customers)} unit={tr('مشترک', 'accounts')} tone="elec" />
        <KpiTile label={tr('درخواست‌های ماه', 'Requests (month)')} value={n(m.requests)} unit={`${tr('معوق', 'backlog')} ${n(backlog)}`} tone="neutral" trend={trend.map((t) => t.received)} />
        <KpiTile label={tr('زمان پاسخگویی', 'Response time')} value={n(m.responseHrs, 1)} unit={tr('ساعت', 'hours')} level={k('KPI-14', m.responseHrs)} to="/kpi?id=KPI-14" />
        <KpiTile label={tr('شکایات ماه', 'Complaints (month)')} value={n(m.complaints)} unit={`${n(per10k, 1)} ${tr('در ۱۰ هزار مشترک', 'per 10k')}`} level={k('KPI-15', per10k)} to="/kpi?id=KPI-15" />
        <KpiTile label={tr('رضایت مشترکین', 'Satisfaction')} value={n(m.satisfaction, 1)} unit={tr('از ۱۰۰', 'of 100')} level={k('KPI-16', m.satisfaction)} gauge={m.satisfaction} to="/kpi?id=KPI-16" />
        <KpiTile label={tr('واگذاری انشعاب', 'New connection')} value={n(kpiById('KPI-17').value)} unit={tr('روز', 'days')} level={k('KPI-17', kpiById('KPI-17').value)} to="/kpi?id=KPI-17" />
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-4" title={tr('ترکیب مشترکین', 'Customer mix')} icon={<UsersIcon size={14} />} accent="elec">
          <div className="flex items-center gap-3">
            <div className="h-[200px] w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={customerTypes.map((c) => ({ name: tx(c.name), value: Math.round(c.count * share) }))} dataKey="value" innerRadius="55%" outerRadius="88%" paddingAngle={2} stroke="none">
                    {customerTypes.map((c) => <Cell key={c.color} fill={c.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex-1 space-y-1.5 text-[12px]">
              {customerTypes.map((c) =>
              <li key={c.color} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5" style={{ background: c.color }} />
                  <span className="flex-1 text-slate-300">{tx(c.name)}</span>
                  <span className="font-mono text-slate-400">{n(Math.round(c.count * share))}</span>
                </li>
              )}
            </ul>
          </div>
        </Panel>
        <Panel className="xl:col-span-8" title={tr('روند درخواست‌ها', 'Request trend')} subtitle={tr('دریافتی در برابر بسته‌شده — ۱۲ ماه', 'Received vs closed — 12 months')} icon={<TrendingUpIcon size={14} />}>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trend} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="m" {...ax.x} interval={1} />
                <YAxis {...ax.y} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="received" name={tr('دریافتی', 'Received')} fill={PALETTE.elec} fillOpacity={0.7} barSize={14} />
                <Line dataKey="closed" name={tr('بسته‌شده', 'Closed')} stroke={PALETTE.ok} strokeWidth={2} dot={{ r: 2.5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <Legend items={[{ label: tr('دریافتی', 'Received'), color: PALETTE.elec }, { label: tr('بسته‌شده', 'Closed'), color: PALETTE.ok }]} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-5" title={tr('درخواست‌ها و زمان پاسخگویی', 'Requests & response time')} icon={<ClipboardListIcon size={14} />} bodyClassName="p-0">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-line-strong text-2xs uppercase tracking-[0.08em] text-slate-500">
                <th className="px-2.5 py-2 text-start font-semibold">{tr('نوع درخواست', 'Request type')}</th>
                <th className="px-2.5 py-2 text-end font-semibold">{tr('تعداد', 'Count')}</th>
                <th className="px-2.5 py-2 text-end font-semibold">{tr('میانگین / هدف (ساعت)', 'Avg / target (h)')}</th>
                <th className="w-24 px-2.5 py-2" />
              </tr>
            </thead>
            <tbody>
              {requestTypes.map((q) => {
                const ok = q.avgHrs <= q.targetHrs;
                const c = ok ? PALETTE.ok : q.avgHrs <= q.targetHrs * 1.2 ? PALETTE.warn : PALETTE.crit;
                return (
                  <tr key={q.name.en} className="border-b border-line/60">
                    <td className="px-2.5 py-2 text-slate-200">{tx(q.name)}</td>
                    <td className="px-2.5 py-2 text-end font-mono text-slate-400">{n(Math.round(q.count * share))}</td>
                    <td className="px-2.5 py-2 text-end font-mono"><span style={{ color: c }}>{n(q.avgHrs)}</span> <span className="text-slate-600">/ {n(q.targetHrs)}</span></td>
                    <td className="px-2.5 py-2"><Meter value={q.avgHrs} max={q.targetHrs * 1.5} color={c} height={4} /></td>
                  </tr>);

              })}
            </tbody>
          </table>
        </Panel>
        <Panel className="xl:col-span-4" title={tr('شکایات به تفکیک موضوع', 'Complaints by topic')} icon={<MessageSquareWarningIcon size={14} />} accent="warn">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complaintTypes.map((c) => ({ name: tx(c.name), v: Math.round(c.count * (r ? r.complaints / company.complaints : 1)) }))} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
                <XAxis type="number" {...ax.xn} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={86} axisLine={false} tickLine={false} orientation={ax.y.orientation} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
                <Bar dataKey="v" name={tr('شکایت', 'Complaints')} fill={PALETTE.brandOrange} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel className="xl:col-span-3" title={tr('وضعیت خدمات (کانال‌ها)', 'Service status by channel')} icon={<HeadphonesIcon size={14} />}>
          <ul className="space-y-3">
            {serviceStatus.map((s) => {
              const tot = s.open + s.inProgress + s.done;
              return (
                <li key={s.name.en}>
                  <div className="flex justify-between text-[12px]"><span className="text-slate-300">{tx(s.name)}</span><span className="font-mono text-slate-500">{n(Math.round(tot * share))}</span></div>
                  <div className="mt-1 flex h-2 overflow-hidden">
                    <span style={{ width: `${s.done / tot * 100}%`, background: PALETTE.ok }} />
                    <span style={{ width: `${s.inProgress / tot * 100}%`, background: PALETTE.elec }} />
                    <span style={{ width: `${s.open / tot * 100}%`, background: PALETTE.warn }} />
                  </div>
                </li>);

            })}
          </ul>
          <Legend items={[{ label: tr('انجام‌شده', 'Done'), color: PALETTE.ok }, { label: tr('در جریان', 'In progress'), color: PALETTE.elec }, { label: tr('باز', 'Open'), color: PALETTE.warn }]} />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Panel className="xl:col-span-4" title={tr('شاخص‌های کیفیت خدمات', 'Service-quality indicators')} icon={<StarIcon size={14} />} accent="elec">
          <ul className="space-y-3">
            {serviceQuality.map((q) => {
              const c = q.value >= q.target ? PALETTE.ok : q.value >= q.target - 8 ? PALETTE.warn : PALETTE.crit;
              return (
                <li key={q.name.en}>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-slate-300">{tx(q.name)}</span>
                    <span className="font-mono"><span style={{ color: c }}>{pct(q.value, 0)}</span> <span className="text-2xs text-slate-600">/ {pct(q.target, 0)}</span></span>
                  </div>
                  <div className="relative mt-1">
                    <Meter value={q.value} color={c} height={5} />
                    <span className="absolute -top-0.5 h-[9px] w-[2px] bg-slate-200" style={{ insetInlineStart: `${q.target}%` }} />
                  </div>
                </li>);

            })}
          </ul>
        </Panel>
        <Panel className="xl:col-span-8" title={tr('مقایسه مناطق', 'Regional comparison')} icon={<UsersIcon size={14} />} bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-line-strong text-2xs uppercase tracking-[0.08em] text-slate-500">
                  <th className="px-2.5 py-2 text-start font-semibold">{tr('منطقه', 'Region')}</th>
                  <th className="px-2.5 py-2 text-end font-semibold">{tr('مشترکین', 'Customers')}</th>
                  <th className="px-2.5 py-2 text-end font-semibold">{tr('درخواست', 'Requests')}</th>
                  <th className="px-2.5 py-2 text-end font-semibold">{tr('پاسخگویی (ساعت)', 'Response (h)')}</th>
                  <th className="px-2.5 py-2 text-end font-semibold">{tr('شکایت / ۱۰ هزار', 'Complaints / 10k')}</th>
                  <th className="px-2.5 py-2 text-end font-semibold">{tr('رضایت', 'Satisfaction')}</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((x) => {
                  const p10 = x.complaints / x.customers * 10000;
                  const cell = (id: string, v: number, d = 0) =>
                  <span className="font-mono" style={{ color: levelColor[k(id, v)] }}>{n(v, d)}</span>;
                  return (
                    <tr
                      key={x.id}
                      onClick={() => setRegion(region === x.id ? 'ALL' : x.id)}
                      className={`cursor-pointer border-b border-line/60 transition-colors duration-150 hover:bg-elec-400/[0.06] ${region === x.id ? 'bg-elec-400/[0.1]' : ''}`}>
                      
                      <td className="px-2.5 py-1.5 text-slate-200">{tx(x.name)}</td>
                      <td className="px-2.5 py-1.5 text-end font-mono text-slate-400">{n(x.customers)}</td>
                      <td className="px-2.5 py-1.5 text-end font-mono text-slate-400">{n(x.requests)}</td>
                      <td className="px-2.5 py-1.5 text-end">{cell('KPI-14', x.responseHrs)}</td>
                      <td className="px-2.5 py-1.5 text-end">{cell('KPI-15', p10, 1)}</td>
                      <td className="px-2.5 py-1.5 text-end">{cell('KPI-16', x.satisfaction)}</td>
                    </tr>);

                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <Lineage ids={['SRC-CIS', 'SRC-CRM', 'SRC-121', 'SRC-BILL', 'SRC-MDM']} />
    </>);

}
