import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChevronLeftIcon, ChevronRightIcon, GitForkIcon, HomeIcon, LayersIcon } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Panel } from '../components/common/Panel';
import { KpiTile } from '../components/common/KpiTile';
import { Meter } from '../components/common/Gauge';
import { LevelBadge, Tag } from '../components/common/Badge';
import { Segmented } from '../components/common/Segmented';
import { Lineage } from '../components/common/Lineage';
import { ChartTooltip, GRID_STROKE, PALETTE, useAxes } from '../components/charts/ChartKit';
import { useLocale } from '../contexts/LocaleContext';
import { findPath, levelLabel, networkTree } from '../data/hierarchy';
import type { DrillNode, NodeLevel } from '../data/hierarchy';
import { deputies, projects } from '../data/projects';
import type { Level, Tx } from '../types';
import { levelColor } from '../utils/format';

const NET_CHAIN: NodeLevel[] = ['company', 'region', 'district', 'feeder', 'equipment', 'event'];

export function Drilldown() {
  const { tr } = useLocale();
  const [params, setParams] = useSearchParams();
  const mode = params.get('mode') === 'projects' ? 'projects' : 'network';
  const ids = (params.get('path') ?? '').split(',').filter(Boolean);

  const go = (nextIds: string[], m = mode) => {
    const p: Record<string, string> = {};
    if (m === 'projects') p.mode = 'projects';
    if (nextIds.length) p.path = nextIds.join(',');
    setParams(p);
  };

  return (
    <>
      <PageHeader
        section="11"
        title={tr('ساختار شکست مسئله و تحلیل سلسله‌مراتبی', 'Drill-down & hierarchical analysis')}
        subtitle={tr('حرکت از اطلاعات کلان به جزئیات تا رسیدن به علت و منشأ — نه فقط یک عدد یا نمودار', 'Move from the big picture to detail until the cause and origin are found — not just a number or a chart')}
        actions={
        <Segmented
          label={tr('سلسله‌مراتب', 'Hierarchy')}
          value={mode}
          onChange={(m) => go([], m)}
          options={[
          { value: 'network', label: tr('شرکت ← منطقه ← ناحیه ← فیدر ← تجهیز ← رخداد', 'Company → region → district → feeder → asset → event') },
          { value: 'projects', label: tr('کل پروژه‌ها ← معاونت ← پروژه ← فعالیت ← وضعیت', 'Projects → deputy → project → activity → status') }]
          } />
        } />
      
      {mode === 'network' ? <NetworkDrill ids={ids} go={go} /> : <ProjectDrill ids={ids} go={go} />}
    </>);

}

function Breadcrumb({ items, onPick }: {items: {label: string;level: string;}[];onPick: (depth: number) => void;}) {
  const { isFa } = useLocale();
  const Sep = isFa ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <nav className="flex flex-wrap items-center gap-1 border border-line bg-ink-900/60 px-3 py-2 text-[12px]" aria-label="breadcrumb">
      <HomeIcon size={13} className="text-slate-500" />
      {items.map((it, i) =>
      <span key={i} className="flex items-center gap-1">
          {i > 0 && <Sep size={13} className="text-slate-600" />}
          <button
          type="button"
          onClick={() => onPick(i)}
          disabled={i === items.length - 1}
          className={`flex items-center gap-1.5 px-1.5 py-0.5 transition-colors duration-150 ${
          i === items.length - 1 ? 'bg-elec-400/10 text-elec-300' : 'text-slate-400 hover:text-elec-300'}`
          }>
          
            <span className="text-2xs text-slate-600">{it.level}</span>
            {it.label}
          </button>
        </span>
      )}
    </nav>);

}

function NetworkDrill({ ids, go }: {ids: string[];go: (ids: string[]) => void;}) {
  const { tr, tx, n } = useLocale();
  const ax = useAxes();
  const path = useMemo(() => findPath(networkTree, ids), [ids]);
  const node = path[path.length - 1];
  const childLevel = NET_CHAIN[NET_CHAIN.indexOf(node.level) + 1];
  const children = [...node.children].sort((a, b) => b.outages - a.outages || b.outageMin - a.outageMin);
  const maxOut = Math.max(1, ...children.map((c) => c.outages));
  const ciMin = node.customers ? node.outageMin / Math.max(1, node.outages) : 0;

  const lv = (c: DrillNode): Level => {
    const share = c.outages / Math.max(1, node.outages) * node.children.length;
    return share > 1.4 ? 'CRIT' : share > 1.05 ? 'WARN' : 'OK';
  };

  return (
    <>
      <Breadcrumb
        items={path.map((p) => ({ label: tx(p.name), level: tx(levelLabel[p.level]) }))}
        onPick={(d) => go(path.slice(1, d + 1).map((p) => p.id))} />
      

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <KpiTile label={tr('سطح', 'Level')} value={tx(levelLabel[node.level])} unit={node.id} tone="elec" />
        <KpiTile label={tr('مشترکین تحت پوشش', 'Customers served')} value={n(node.customers)} tone="neutral" />
        <KpiTile label={tr('خاموشی‌ها (ماه)', 'Outages (month)')} value={n(node.outages)} unit={`${n(ciMin, 0)} ${tr('دقیقه به‌طور میانگین', 'min average')}`} tone="warn" />
        <KpiTile label={node.level === 'event' ? tr('مدت', 'Duration') : tr('بار (مگاوات)', 'Load (MW)')} value={node.level === 'event' ? n(node.outageMin) : n(node.loadMW, 1)} unit={node.level === 'event' ? tr('دقیقه', 'min') : tr('مگاوات', 'MW')} tone="forecast" />
      </div>

      {childLevel && children.length > 0 ?
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
          <Panel
          className="xl:col-span-7"
          title={`${tr('زیرمجموعه‌ها', 'Breakdown by')} ${tx(levelLabel[childLevel])}`}
          subtitle={tr('مرتب‌شده بر اساس سهم خاموشی — برای ادامه روی ردیف کلیک کنید', 'Sorted by outage contribution — click a row to go deeper')}
          icon={<GitForkIcon size={14} />}
          accent="elec"
          bodyClassName="p-0">
          
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-line-strong text-2xs uppercase tracking-[0.08em] text-slate-500">
                  <th className="px-2.5 py-2 text-start font-semibold">{tx(levelLabel[childLevel])}</th>
                  <th className="px-2.5 py-2 text-end font-semibold">{tr('مشترکین', 'Customers')}</th>
                  <th className="w-[32%] px-2.5 py-2 text-start font-semibold">{tr('خاموشی', 'Outages')}</th>
                  <th className="px-2.5 py-2 text-end font-semibold">{childLevel === 'event' ? tr('مدت (دقیقه)', 'Duration (min)') : tr('دقیقه خاموشی', 'Outage min')}</th>
                  <th className="px-2.5 py-2 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {children.map((c) => {
                const l = lv(c);
                return (
                  <tr
                    key={c.id}
                    tabIndex={c.children.length ? 0 : undefined}
                    onClick={c.children.length ? () => go([...ids, c.id]) : undefined}
                    onKeyDown={(e) => {if (e.key === 'Enter' && c.children.length) go([...ids, c.id]);}}
                    className={`border-b border-line/60 transition-colors duration-150 ${c.children.length ? 'cursor-pointer hover:bg-elec-400/[0.06] focus:bg-elec-400/[0.08] focus:outline-none' : ''}`}>
                    
                      <td className="px-2.5 py-1.5 text-slate-200">
                        {tx(c.name)}
                        {c.detail && <span className="ms-2 text-2xs text-slate-500">{tx(c.detail)}</span>}
                      </td>
                      <td className="px-2.5 py-1.5 text-end font-mono text-slate-400">{n(c.customers)}</td>
                      <td className="px-2.5 py-1.5">
                        <div className="flex items-center gap-2">
                          <span className="flex-1"><Meter value={c.outages} max={maxOut} color={levelColor[l]} height={4} /></span>
                          <span className="w-10 text-end font-mono" style={{ color: levelColor[l] }}>{n(c.outages)}</span>
                        </div>
                      </td>
                      <td className="px-2.5 py-1.5 text-end font-mono text-slate-400">{n(c.outageMin)}</td>
                      <td className="px-2.5 py-1.5 text-end">{c.level !== 'event' && <LevelBadge level={l} size="xs" />}</td>
                    </tr>);

              })}
              </tbody>
            </table>
          </Panel>
          <Panel className="xl:col-span-5" title={tr('سهم هر زیرمجموعه از دقایق خاموشی', 'Share of outage minutes')} icon={<LayersIcon size={14} />}>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={children.slice(0, 12).map((c) => ({ name: c.id, v: c.outageMin, l: lv(c) }))} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
                  <XAxis type="number" {...ax.xn} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={96} axisLine={false} tickLine={false} orientation={ax.y.orientation} />
                  <Tooltip content={<ChartTooltip unit={tr('دقیقه', 'min')} />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
                  <Bar dataKey="v" name={tr('دقیقه خاموشی', 'Outage minutes')} barSize={12}>
                    {children.slice(0, 12).map((c) => <Cell key={c.id} fill={c.level === 'event' ? PALETTE.elec : levelColor[lv(c)]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div> :

      <Panel title={tr('جزئیات رخداد', 'Event detail')} icon={<GitForkIcon size={14} />} accent="crit">
          <dl className="grid grid-cols-2 gap-3 text-[12px] sm:grid-cols-4">
            <div><dt className="text-slate-500">{tr('علت و زمان', 'Cause & time')}</dt><dd className="text-slate-200">{tx(node.name)}</dd></div>
            <div><dt className="text-slate-500">{tr('مدت', 'Duration')}</dt><dd className="font-mono text-slate-200">{n(node.outageMin)} {tr('دقیقه', 'min')}</dd></div>
            <div><dt className="text-slate-500">{tr('مشترک متأثر', 'Customers affected')}</dt><dd className="font-mono text-slate-200">{n(node.customers)}</dd></div>
            <div><dt className="text-slate-500">{tr('مسیر کامل', 'Full path')}</dt><dd className="font-mono text-2xs text-elec-300">{path.map((p) => p.id).join(' › ')}</dd></div>
          </dl>
        </Panel>
      }
      <Lineage ids={['SRC-OMS', 'SRC-GIS', 'SRC-SCADA', 'SRC-AM', 'SRC-CIS']} />
    </>);

}

/* ---------- projects hierarchy: all → deputy → project → activity → status ---------- */

interface PNode {
  id: string;
  name: Tx;
  kind: Tx;
  budget?: number;
  planned: number;
  actual: number;
  delay?: number;
  children: PNode[];
}

function buildProjectTree(): PNode {
  const deps: PNode[] = deputies.map((d) => {
    const ps = projects.filter((p) => p.deputyId === d.id);
    const kids: PNode[] = ps.map((p) => ({
      id: p.id, name: p.name, kind: { fa: 'پروژه', en: 'Project' }, budget: p.budgetBn, planned: p.planned, actual: p.physical, delay: p.delayDays,
      children: p.activities.map((a, i) => ({
        id: `${p.id}-A${i + 1}`, name: a.name, kind: { fa: 'فعالیت', en: 'Activity' }, planned: a.planned, actual: a.actual, children: []
      }))
    }));
    const avg = (f: (x: PNode) => number) => kids.length ? Math.round(kids.reduce((a, x) => a + f(x), 0) / kids.length) : 0;
    return {
      id: d.id, name: d.name, kind: { fa: 'معاونت', en: 'Deputy' },
      budget: kids.reduce((a, x) => a + (x.budget ?? 0), 0), planned: avg((x) => x.planned), actual: avg((x) => x.actual),
      delay: Math.max(0, ...kids.map((x) => x.delay ?? 0)), children: kids
    };
  });
  return {
    id: 'ALL', name: { fa: 'کل پروژه‌ها', en: 'All projects' }, kind: { fa: 'سبد', en: 'Portfolio' },
    budget: deps.reduce((a, x) => a + (x.budget ?? 0), 0),
    planned: Math.round(projects.reduce((a, p) => a + p.planned, 0) / projects.length),
    actual: Math.round(projects.reduce((a, p) => a + p.physical, 0) / projects.length),
    children: deps
  };
}

const PROJECT_TREE = buildProjectTree();

function ProjectDrill({ ids, go }: {ids: string[];go: (ids: string[]) => void;}) {
  const { tr, tx, n, pct } = useLocale();
  const path: PNode[] = [PROJECT_TREE];
  for (const id of ids) {
    const next = path[path.length - 1].children.find((c) => c.id === id);
    if (!next) break;
    path.push(next);
  }
  const node = path[path.length - 1];
  const status = (p: PNode): Level => {
    const gap = p.actual - p.planned;
    return gap >= -3 ? 'OK' : gap >= -12 ? 'WARN' : 'CRIT';
  };

  return (
    <>
      <Breadcrumb items={path.map((p) => ({ label: tx(p.name), level: tx(p.kind) }))} onPick={(d) => go(path.slice(1, d + 1).map((p) => p.id))} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <KpiTile label={tr('سطح', 'Level')} value={tx(node.kind)} unit={node.id} tone="elec" />
        <KpiTile label={tr('پیشرفت واقعی', 'Actual progress')} value={pct(node.actual, 0)} gauge={node.actual} tone="elec" />
        <KpiTile label={tr('پیشرفت برنامه‌ای', 'Planned progress')} value={pct(node.planned, 0)} gauge={node.planned} tone="neutral" />
        <KpiTile label={tr('وضعیت اجرا', 'Execution status')} value={`${node.actual - node.planned >= 0 ? '+' : ''}${n(node.actual - node.planned)}`} unit={tr('واحد درصد نسبت به برنامه', 'pts vs plan')} level={status(node)} />
      </div>
      <Panel
        title={node.children.length ? `${tr('زیرمجموعه‌ها', 'Breakdown')} — ${tx(node.children[0].kind)}` : tr('وضعیت اجرا', 'Execution status')}
        icon={<GitForkIcon size={14} />}
        accent="elec"
        bodyClassName="p-0">
        
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-line-strong text-2xs uppercase tracking-[0.08em] text-slate-500">
              <th className="px-2.5 py-2 text-start font-semibold">{tr('عنوان', 'Item')}</th>
              {node.children[0]?.budget !== undefined && <th className="px-2.5 py-2 text-end font-semibold">{tr('بودجه (میلیارد تومان)', 'Budget (bn toman)')}</th>}
              <th className="w-[36%] px-2.5 py-2 text-start font-semibold">{tr('واقعی / برنامه', 'Actual / plan')}</th>
              {node.children[0]?.delay !== undefined && <th className="px-2.5 py-2 text-end font-semibold">{tr('تأخیر (روز)', 'Delay (d)')}</th>}
              <th className="px-2.5 py-2 font-semibold">{tr('وضعیت اجرا', 'Status')}</th>
            </tr>
          </thead>
          <tbody>
            {(node.children.length ? node.children : [node]).map((c) => {
              const l = status(c);
              const canGo = c !== node && c.children.length > 0;
              return (
                <tr
                  key={c.id}
                  onClick={canGo ? () => go([...ids, c.id]) : undefined}
                  className={`border-b border-line/60 ${canGo ? 'cursor-pointer transition-colors duration-150 hover:bg-elec-400/[0.06]' : ''}`}>
                  
                  <td className="px-2.5 py-1.5 text-slate-200"><span className="me-2 font-mono text-2xs text-slate-500">{c.id}</span>{tx(c.name)}</td>
                  {node.children[0]?.budget !== undefined && <td className="px-2.5 py-1.5 text-end font-mono text-slate-400">{n(c.budget ?? 0)}</td>}
                  <td className="px-2.5 py-1.5">
                    <div className="flex items-center gap-2">
                      <div className="relative h-2 flex-1 bg-slate-500/15">
                        <div className="absolute inset-y-0 start-0" style={{ width: `${c.actual}%`, background: levelColor[l] }} />
                        <div className="absolute inset-y-[-3px] w-[2px] bg-slate-200" style={{ insetInlineStart: `${c.planned}%` }} />
                      </div>
                      <span className="w-20 font-mono text-2xs text-slate-400">{pct(c.actual, 0)} / {pct(c.planned, 0)}</span>
                    </div>
                  </td>
                  {node.children[0]?.delay !== undefined && <td className="px-2.5 py-1.5 text-end font-mono text-slate-400">{n(c.delay ?? 0)}</td>}
                  <td className="px-2.5 py-1.5">
                    <LevelBadge level={l} size="xs" label={l === 'OK' ? tr('طبق برنامه', 'On plan') : l === 'WARN' ? tr('عقب‌تر از برنامه', 'Behind') : tr('تأخیر جدی', 'Seriously late')} />
                  </td>
                </tr>);

            })}
          </tbody>
        </table>
        {!node.children.length && <p className="px-3 py-2 text-2xs text-slate-500"><Tag tone="elec">{tr('آخرین سطح', 'Leaf level')}</Tag></p>}
      </Panel>
      <Lineage ids={['SRC-PMIS', 'SRC-FIN']} />
    </>);

}
